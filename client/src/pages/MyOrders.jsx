//import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import OrderData from "../components/custom/OrderData";
//import useErrorLogout from "../hooks/use-error-logout";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  //const { handleErrorLogout } = useErrorLogout();

  useEffect(() => {
    const getMyOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/" + "/get-orders-by-user-id",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const { data } = res.data;
        setOrders(data);
      } catch (error) {
        //return handleErrorLogout(error);
      }
    };
    getMyOrders();
  }, []);

  return (
    <div className="w-[90vw] lg:w-[50vw] mx-auto my-10 sm:my-32 grid gap-3">
      <h1 className="text-2xl font-bold">My Orders</h1>
      <div className="grid gap-3">
        {orders.length === 0 ? (
          <h1>No Orders to show</h1>
        ) : (
          orders.map((order) => <OrderData key={order._id} {...order} />)
        )}
      </div>
    </div>
  );
};

export default MyOrders;
