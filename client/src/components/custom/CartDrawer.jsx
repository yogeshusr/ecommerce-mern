//import React from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Drawer,
  //DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../components/ui/drawer.jsx";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";
import CartProduct from "./CartProduct";
import LinkButton from "./LinkButton";
import { useNavigate } from "react-router-dom";
//import { useDispatch } from "react-redux";

const CartDrawer = () => {
  // let cartItems = [
  //   {
  //     id: 1,
  //     name: "Product 1",
  //     price: 100,
  //     quantity: 1,
  //   },
  //   {
  //     id: 2,
  //     name: "Product 2",
  //     price: 200,
  //     quantity: 1,
  //   },
  // ];
  // const totalQuantity = 5;
  // const totalPrice = 500;
  const { cartItems, totalQuantity, totalPrice } = useSelector(
    (state) => state.cart
  );
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user?.isAuthenticated);
  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate("/checkout");
    } else {
      navigate("/login");
    }
  };

  return (
    <Drawer>
      <DrawerTrigger className="relative">
        {totalQuantity > 0 && (
          <Badge className={`absolute px-1 py-0`}>{totalQuantity}</Badge>
        )}
        <ShoppingCart
          className="text-gray-800 dark:text-white hover:scale-105 transition-all ease-in-out cursor-pointer"
          strokeWidth={1.3}
          size={28}
        />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            Total Items : {totalQuantity}, Total Price : {totalPrice}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col sm:flex-row justify-start gap-3 h-[70vh] overflow-y-scroll sm:overflow-y-hidden sm:h-auto mx-3">
          {cartItems.length === 0 ? (
            <h2 className="text-primary text-3xl">
              Nothing To Show, Please add some products...
            </h2>
          ) : (
            cartItems.map((item) => <CartProduct key={item._id} {...item} />)
          )}
        </div>

        <DrawerFooter>
          <LinkButton to="/checkout" text="Checkout" />
          {/* <Button variant="outline" onClick={handleCheckout}>
            Checkout
          </Button> */}
          {/* {<DrawerClose><Button variant="outline">Cancel</Button></DrawerClose>} */}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
