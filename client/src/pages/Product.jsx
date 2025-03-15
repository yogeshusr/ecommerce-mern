//import React from "react";
import { Circle, Minus, Plus } from "lucide-react";
import { Colors } from "../constants/colors";
import { startsGenerator } from "../constants/helper";
import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import ReviewsComponent from "../components/custom/ReviewsComponent";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
//import useRazorpay from "react-razorpay";
import "react-toastify/dist/ReactToastify.css";
import { addToCart } from "../redux/slices/cartSlice";
import useRazorpay from "../hooks/use-razorpay";

const imagesArray = [
  {
    url: "https://images.pexels.com/photos/532173/pexels-photo-532173.jpeg?auto=compress&cs=tinysrgb&w=400",
    id: 1,
  },
  {
    url: "https://images.pexels.com/photos/532173/pexels-photo-532173.jpeg?auto=compress&cs=tinysrgb&w=400",
    id: 2,
  },
  {
    url: "https://images.pexels.com/photos/532173/pexels-photo-532173.jpeg?auto=compress&cs=tinysrgb&w=400",
    id: 3,
  },
  {
    url: "https://images.pexels.com/photos/532173/pexels-photo-532173.jpeg?auto=compress&cs=tinysrgb&w=400",
    id: 4,
  },
];

const productStock = 10;

const Product = () => {
  const { productName } = useParams();
  //alert(productName);
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { verifyPayment, generatePayment } = useRazorpay();

  const [productQuantity, setProductQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [purchaseProduct, setPurchaseProduct] = useState(false);
  const [address, setAddress] = useState("");
  const [product, setProduct] = useState({
    name: "",
    description: "",
    images: [],
  });
  const [selectedImage, setSelectedImage] = useState(0);
  const [productColor, setProductColor] = useState("");

  useEffect(() => {
    const fetchProductByName = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/" +
            `/get-product-by-name/${productName?.split("-").join(" ")}`
        );
        const data = res.data;

        if (!data.success) {
          // Handle API errors gracefully
          console.log(data.message); // Log the error message returned from the API
          setProduct({
            name: "Product Name Unavailable",
            description: "Product description is not available.",
            images: [],
          });
          return;
        }

        const product = data.data;
        setProduct(product);
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct({
          name: "Error fetching product",
          description: "There was an error retrieving the product details.",
          images: [],
        });
      }
    };
    fetchProductByName();
  }, [productName]);

  const calculateEmi = (price) => Math.round(price / 6);

  const checkAvailability = async () => {
    if (pincode.trim() === "") {
      setAvailabilityMessage("Please enter a valid pincode");
      return;
    }
    const res = await axios.get(
      "http://localhost:5000/api/" + `/get-pincode/${pincode}`
    );
    const data = await res.data;
    setAvailabilityMessage(data.message);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (productColor == "") {
      toast.error("Please select a color");
      return;
    }
    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: productQuantity,
        image: product.images[0].url,
        color: productColor,
        stock: product.stock,
        blacklisted: product.blacklisted,
      })
    );
    setProductQuantity(1);
    toast.success("Product added to cart");
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      //toast.error("Please login to proceed");
      navigate("/login");
      return;
    }
    if (productQuantity > product.stock) {
      toast.error("Product out of stock");
      return;
    }
    if (product.blacklisted) {
      toast.error("Product isn't available for purchase");
      return;
    }
    if (productColor == "") {
      toast.error("Please select a color");
      return;
    }
    const order = await generatePayment(product.price * productQuantity);
    await verifyPayment(
      order,
      [{ id: product._id, productQuantity, color: productColor }],
      address
    );
    setPurchaseProduct(false);
  };

  return (
    <>
      <div>
        <main className="w-[93vw] lg:w-[70vw] flex flex-col sm:flex-row justify-start items-start gap-10 mx-auto my-10">
          {/*LEFT SIDE*/}
          <div className="grid sm:w-[50%] gap-3">
            <img
              src={product?.images?.[selectedImage]?.url}
              className="w-full lg:h-[30rem] rounded-xl object-center object-cover
            border dark:border-none"
            />
            <div className="grid grid-cols-4 gap-3">
              {product?.images?.map(({ url, id }, index) => (
                <img
                  src={url}
                  key={id}
                  onClick={() => setSelectedImage(index)}
                  className="rounded-xl filter hover:brightness-50 cursor-pointer transition-all ease-in-out duration-300 border dark:border-none"
                />
              ))}
            </div>
          </div>

          {/*RIGHT SIDE*/}
          <div className="sm:w-[50%] lg:w-[30%]">
            <div className="pb-5">
              <h2 className="font-extrabold text-2xl">{product?.name}</h2>
              <p className="text-sm my-2">{product?.description}</p>
              <div className="flex items-center">
                {startsGenerator(product.rating, "0", 15)}
                <span className="text-md ml-1">
                  ({product?.reviews?.length})
                </span>
              </div>
            </div>

            <div className="py-5 border-t border-b">
              <h3 className="font-bold text-xl">
                Rs.{product.price} or Rs.{calculateEmi(product.price)}/month
              </h3>
              <p className="text-sm">
                Suggested payments with 6 months special financing
              </p>
            </div>

            <div className="py-5 border-b">
              <h3 className="font-bold text-lg">Choose Color</h3>
              <div className="flex items-center my-2">
                {product?.colors?.map((color, index) => (
                  <Circle
                    key={index + color}
                    fill={color}
                    strokeOpacity={0.2}
                    strokeWidth={0.2}
                    size={40}
                    onClick={() => setProductColor(color)}
                    className="cursor-pointer filter hover:brightness-50"
                  />
                ))}

                {/* <Circle
                  fill={Colors.customGray}
                  strokeOpacity={0.2}
                  strokeWidth={0.2}
                  size={40}
                /> */}
              </div>
            </div>

            <div className="py-5">
              <div className="flex gap-3 items-center">
                <div className="flex items-center gap-5 bg-gray-100 rounded-fill px-3 py-2 w-fit">
                  <Minus
                    stroke={Colors.customGray}
                    cursor={"pointer"}
                    onClick={() =>
                      setProductQuantity((qty) => (qty > 1 ? qty - 1 : 1))
                    }
                  />

                  <span className="text-slate-950">{productQuantity}</span>

                  <Plus
                    stroke={Colors.customGray}
                    onClick={() =>
                      setProductQuantity((qty) =>
                        qty < productStock ? qty + 1 : qty
                      )
                    }
                  />
                </div>
                {product.stock - productQuantity > 0 && (
                  <div className="grid text-sm font-semibold text-gray-600">
                    Only{" "}
                    <span className="text-customYellow">
                      {product.stock - productQuantity} items{" "}
                    </span>
                    Left!
                    <span>Dont miss it</span>
                  </div>
                )}
              </div>

              <div className="grid gap-3 my-5">
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter Your Pincode Here"
                    onChange={(e) => setPincode(e.target.value)}
                  />
                  <Button onClick={checkAvailability}>
                    Check Availability{" "}
                  </Button>
                </div>
                <p className="text-sm px-2">{availabilityMessage}</p>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setPurchaseProduct(true)}>
                  Buy Now
                </Button>
                <Button variant="outline" onClick={handleAddToCart}>
                  Add to Cart
                </Button>
              </div>
              {purchaseProduct && (
                <div className="my-2 space-y-2">
                  <Input
                    placeholder="Enter Your Address Here..."
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <Button onClick={handleBuyNow}>Confirm Order</Button>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* REVIEW SECTION */}
        <ReviewsComponent productId={product?._id} />
      </div>
    </>
  );
};

export default Product;
