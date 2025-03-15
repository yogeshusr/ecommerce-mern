const { ROLES } = require("../utils/constants");
const Product = require("../models/Product");
const cloudinary = require("../utils/cloudinary");

const createProduct = async (req, res) => {
  // Create a new product
  if (req.role !== ROLES.admin) {
    return res.status(401).json({ success: false, message: "Access denied" });
  }

  try {
    const { name, price, description, stock, colors, category } = req.body;

    const uploadedImages = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "products",
      });
      uploadedImages.push({
        url: result.secure_url,
        id: result.public_id,
      });
    }

    const product = new Product({
      name,
      price,
      description,
      stock,
      colors,
      category,
      images: uploadedImages,
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  if (req.role !== ROLES.admin) {
    return res.status(401).json({ success: false, message: "Access denied" });
  }

  try {
    const { name, price, description, stock, colors, category } = req.body;
    const { id } = req.params;

    const data = { name, price, description, stock, colors, category };

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  if (req.role !== ROLES.admin) {
    return res.status(401).json({ success: false, message: "Access denied" });
  }

  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    let { page, limit, category, price, search } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 9;

    let query = {};

    if (category)
      query.category = category.charAt(0).toUpperCase() + category.slice(1);

    if (category === "all") delete query.category;

    if (price > 0) query.price = { $lte: price };

    if (search) query.name = { $regex: search, $options: "i" };

    const totalProducts = await Product.countDocuments(query);
    const totalpages = Math.ceil(totalProducts / limit);

    const products = await Product.find(query)
      .select(" name price images rating description blacklisted")
      .skip((page - 1) * limit)
      .limit(limit);

    let newProductsArray = [];

    products.forEach((product) => {
      const productObj = product.toObject();
      productObj.image = productObj.images[0];
      newProductsArray.push(productObj);
    });

    if (!products.length) {
      return res
        .status(404)
        .json({ success: false, message: "No products found" });
    }

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: newProductsArray,
      pagination: {
        totalProducts,
        totalpages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getProductByName = async (req, res) => {
  const { name } = req.params;
  try {
    const product = await Product.findOne({
      name: {
        $regex: new RegExp(name, "i"),
      },
    });
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    const productObj = product.toObject();
    if (productObj.images && productObj.images.length > 0) {
      productObj.image = productObj.images[0].url; // Ensure 'images' exists before assigning
    }

    // Check if name or description is missing and handle gracefully
    if (!productObj.name) {
      return res
        .status(400)
        .json({ success: false, message: "Product name is missing" });
    }

    if (!productObj.description) {
      return res
        .status(400)
        .json({ success: false, message: "Product description is missing" });
    }

    // Return the product data with a success status
    return res
      .status(200)
      .json({ success: true, message: "Product found", data: productObj });
  } catch (error) {
    console.error("Error fetching product:", error); // Add error logging for better debugging
    return res.status(500).json({ success: false, message: error.message });
  }
};

const blacklistProduct = async (req, res) => {
  if (req.role !== ROLES.admin) {
    return res.status(401).json({ success: false, message: "Access denied" });
  }

  const { id } = req.params;

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { blacklisted: true },
      { new: true }
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: `The product ${product.name} has been blacklisted.`,
      data: product,
      undo: {
        message: "Click here to undo",
        url: `/products/${id}/remove-from-blacklist`,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const removeFromBlacklist = async (req, res) => {
  if (req.role !== ROLES.admin) {
    return res.status(401).json({ success: false, message: "Access denied" });
  }

  const { id } = req.params;

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { blacklisted: false },
      { new: true }
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: `The product ${product.name} has been removed from blacklist`,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductByName,
  blacklistProduct,
  removeFromBlacklist,
};
