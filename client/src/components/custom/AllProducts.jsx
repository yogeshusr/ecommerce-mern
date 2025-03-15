//import React from 'react'

import { Edit, Search } from "lucide-react";
import { Input } from "../ui/input";
//import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  //DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  //DialogTrigger,
} from "../../components/ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../redux/slices/productSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useErrorLogout from "../../hooks/use-error-logout";

const AllProducts = () => {
  const { products } = useSelector((state) => state.product);
  const [category, setCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { handleErrorLogout } = useErrorLogout();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const getFilterProducts = async () => {
  //     const res = await axios.get(
  //       "http://localhost:5000/api/" +
  //         `/get-products?category=${category}&search=${searchTerm}`
  //     );
  //     const data = await res.data;
  //     dispatch(setProducts(data.data));
  //   };
  //   getFilterProducts();
  // }, [searchTerm, category]);

  useEffect(() => {
    const getFilterProducts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/" +
            `/get-products?category=${category}&search=${searchTerm}`
        );
        const data = await res.data;
        if (Array.isArray(data.data)) {
          dispatch(setProducts(data.data)); // Set as an array
        } else {
          console.error("API response is not an array:", data);
          dispatch(setProducts([])); // Set empty array on error
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        dispatch(setProducts([])); // Set empty array on error
      }
    };
    getFilterProducts();
  }, [searchTerm, category, dispatch]);

  const removeFromBlacklist = async (id) => {
    try {
      const token = localStorage.getItem("token");
      //if (!token) throw new Error("No token found");

      const res = await axios.put(
        `http://localhost:5000/api/remove-from-blacklist/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { message, data } = res.data;
      toast.success(message);
    } catch (error) {
      handleErrorLogout(error, "Error occured while reverting changes");
    }
  };

  // const blacklistProduct = async (id) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     //if (!token) throw new Error("No token found");

  //     const res = await axios.put(
  //       `http://localhost:5000/api/blacklist-product/${id}`,
  //       null,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     const { message, data } = res.data;
  //     toast(
  //       <div>
  //         <strong>Success</strong>
  //         <div>{message}</div>
  //         {data && (
  //           <button
  //             onClick={() => {
  //               removeFromBlacklist(data._id);
  //             }}
  //             // style={{ color: "blue", textDecoration: "underline" }}
  //           >
  //             Undo Changes
  //           </button>
  //         )}
  //       </div>,
  //       {
  //         type: toast.TYPE.SUCCESS,
  //         position: toast.POSITION.TOP_RIGHT,
  //         autoClose: 5000, // Toast will auto-close after 5 seconds
  //       }
  //     );
  //   } catch (error) {
  //     handleErrorLogout(error, "Error occured while blacklisting product");
  //   }
  // };

  const blacklistProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Please log in.");
        return;
      }

      const res = await axios.put(
        `http://localhost:5000/api/blacklist-product/${id}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { message, data } = res.data;
      toast.success(message);

      // Optionally update the product list after blacklisting
      // dispatch(
      //   setProducts((prevProducts) =>
      //     prevProducts.map((products) =>
      //       products._id === id
      //         ? { ...products, isBlacklisted: true }
      //         : products
      //     )
      //   )
      // );

      if (data) {
        toast.success(
          <div>
            <strong>Success</strong>
            <div>{message}</div>
            <button
              onClick={() => {
                removeFromBlacklist(data._id);
              }}
              style={{ color: "blue", textDecoration: "underline" }}
            >
              Undo Changes
            </button>
          </div>,
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }
        );
      }
    } catch (error) {
      //console.error("Error occurred while blacklisting product:", error);
      //toast.error("An unexpected error occurred while blacklisting the product.");
      //handleErrorLogout(error, "Error occurred while blacklisting product");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedProduct = {
      ...editingProduct,
      name: formData.get("name"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price")),
      category: formData.get("category"),
    };
    dispatch(
      setProducts(
        products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
      )
    );

    try {
      const res = await axios.put(
        `http://localhost:5000/api/update-product/${editingProduct._id}`,
        {
          name: updatedProduct.name,
          description: updatedProduct.description,
          price: updatedProduct.price,
          category: updatedProduct.category,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { message, data } = res.data;
      toast.success(message || "Product Updated Successfully");
    } catch (error) {
      handleErrorLogout(error, "Error occurred while updating product");
    }
    setIsEditModalOpen(false);
    setEditingProduct(null);
    //window.location.reload();
  };

  return (
    <div className="mx-auto px-4 sm:px-8 -z-10">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <div className="mb-8">
        <form className="flex gap-4 items-end sm:w-[76vw]">
          <div className="flex-1">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="search"
            >
              Search Products
            </label>
            <div className="relative">
              <Input
                type="text"
                id="search"
                placeholder="Search by name or description"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
          <div className="w-48">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="category"
            >
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="headset">Headset</SelectItem>
                <SelectItem value="keyboard">Keyboard</SelectItem>
                <SelectItem value="mouse">Mouse</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </div>

      {products?.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">
          No products found,Try adjusting your search or category
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-2 sm:mx-0">
          {products?.map((product) => (
            <Card key={product._id} className="flex flex-col">
              <div className="aspect-square relative">
                <img
                  src={product.image?.url}
                  alt={product.name}
                  className="rounded-t-lg"
                />
              </div>

              <CardContent className="flex-grow p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {product.description}
                </p>
                <p className="text-lg font-bold">
                  Rs {product.price.toFixed(2)}
                </p>
              </CardContent>

              <CardFooter className="p-4 pt-0 flex justify-between flex-col space-y-4">
                <Button variant="outline" onClick={() => handleEdit(product)}>
                  <Edit className="mr-2 h-4 s-4" />
                  Edit
                </Button>
                <Button
                  className="mr-2 h-4 s-4"
                  onClick={() => {
                    !product.isBlacklisted
                      ? blacklistProduct(product._id)
                      : removeFromBlacklist(product._id);
                  }}
                >
                  {!product.isBlacklisted
                    ? "Blacklist Product"
                    : "Remove from Blacklist"}
                </Button>
                <Button
                  className="mr-2 h-4 s-4"
                  onClick={() => {
                    product.isBlacklisted
                      ? blacklistProduct(product._id)
                      : removeFromBlacklist(product._id);
                  }}
                >
                  {product.isBlacklisted
                    ? "Blacklist Product"
                    : "Remove from Blacklist"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-4 items-center">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingProduct?.name}
                />
              </div>
              <div className="grid gap-4 items-center">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingProduct?.description}
                />
              </div>
              <div className="grid gap-4 items-center">
                <Label htmlFor="price">Price</Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  defaultValue={editingProduct?.price}
                />
              </div>
              <div className="grid gap-4 items-center">
                <Label htmlFor="category">category</Label>
                <Select name="category" defaultValue={editingProduct?.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Headset">Headset</SelectItem>
                    <SelectItem value="Keyboard">Keyboard</SelectItem>
                    <SelectItem value="Mouse">Mouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllProducts;
