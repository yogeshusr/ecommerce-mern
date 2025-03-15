//import React from "react";

import { Card } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import OrderProductTile from "./OrderProductTile";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import { useEffect, useState } from "react";
import axios from "axios";
//import useErrorLogout from "../../hooks/use-error-logout";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  //const { handleErrorLogout } = useErrorLogout();
  useEffect(() => {
    const fetchOrders = () => {
      try {
        axios
          .get(
            "http://localhost:5000/api/" +
              `/get-all-orders?page=${currentPage}&limit=10`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((res) => {
            const { data, totalPages, currentPage } = res.data;
            setOrders(data);
            setTotalPages(totalPages);
            setCurrentPage(currentPage);
          });
      } catch (error) {
        //return handleErrorLogout(error, error.response.data.message);
      }
    };
    fetchOrders();
  }, [currentPage]);

  const updateOrderStatus = async (status, paymentId) => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/" + `/update-order-status/${paymentId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      //return handleErrorLogout(error,error.response.data.message);
    }
  };
  return (
    <>
      <h1 className="text-3xl font-bold mb-8 ml-3">Orders</h1>
      <div className="flex flex-col gap-5 mx-auto my-10">
        <div className="space-y-8">
          <div className="p-4 space-y-4">
            <h2 className="text-xl font-medium">Order Summary</h2>
            <div className="grid space-y-1 gap-2 sm:w-[80vw]">
              {orders.length === 0 ? (
                <h2 className="text-primary text-3xl">
                  Nothing To Show,Please add some products...
                </h2>
              ) : (
                orders.map((item) => (
                  <Card key={item._id} className="space-y-2 p-3 shadow-md">
                    <div className="grid sm:grid-cols-3 gap-2">
                      {item?.products?.map((product) => (
                        <OrderProductTile key={product._id} {...product} />
                      ))}
                    </div>
                    <hr />
                    <div>
                      <p className="flex justify-between sm:justify-start gap-2 items-center px-3">
                        <span className="font-bold">Total:</span>
                        <span className="text-sm text-customGray">
                          Rs{item?.amount}
                        </span>
                      </p>
                      <p className="flex justify-between sm:justify-start gap-2 items-center px-3">
                        <span className="font-bold">Address:</span>
                        <span className="text-sm text-customGray">
                          {item?.address}
                        </span>
                      </p>
                      <p className="flex justify-between sm:justify-start gap-2 items-center px-3">
                        <span className="font-bold">Name:</span>
                        <span className="text-sm text-customGray">
                          {item?.userId?.name}
                        </span>
                      </p>
                      <p className="flex justify-between sm:justify-start gap-2 items-center px-3">
                        <span className="font-bold">Email:</span>
                        <span className="text-sm text-customGray">
                          {item?.userId?.email}
                        </span>
                      </p>
                      <p className="flex justify-between sm:justify-start gap-2 items-center px-3">
                        <span className="font-bold">Payment ID:</span>
                        <span className="text-sm text-customGray">
                          {item?.razorpayPaymentId}
                        </span>
                      </p>
                    </div>
                    <Select
                      onValueChange={(value) => {
                        alert("Do you really want to update the status?");
                        updateOrderStatus(value, item.razorpayPaymentId);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="pending" />
                      </SelectTrigger>
                      <SelectContent className="capitalize">
                        <SelectItem value="pending">pending</SelectItem>
                        <SelectItem value="packed">packed</SelectItem>
                        <SelectItem value="in transit">in transit</SelectItem>
                        <SelectItem value="completed">completed</SelectItem>
                        <SelectItem value="failed">failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => {
                  setCurrentPage((currentPage) =>
                    currentPage >= 2 ? currentPage - 1 : 1
                  );
                }}
              />
            </PaginationItem>
            <PaginationItem>
              {Array.from({ length: totalPages }, (data, i) => (
                <PaginationLink
                  href="#"
                  onClick={() => setCurrentPage(i + 1)}
                  key={i}
                >
                  {i + 1}
                </PaginationLink>
              ))}
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => setCurrentPage(currentPage + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

export default Orders;
