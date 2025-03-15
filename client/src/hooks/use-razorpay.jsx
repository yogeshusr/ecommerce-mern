import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const useRazorpay = () => {
  const navigate = useNavigate();

  const generatePayment = async (amount) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/" + "/generate-payment",
        { amount },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
      const data = await res.data;
      return data.data;
    } catch (error) {
      return toast.error(error.response.data.message);
    }
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const verifyPayment = async (options, productArray, address) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      return toast.error("Failed to load Razorpay");
    }

    const paymentObject = new window.Razorpay({
      key: "zvdul2324nlawjsf",
      ...options,
      image:
        "https://images.pexels.com/photos/671629/pexels-photo-671629.jpeg?auto=compress&cs=tinysrgb&w=600",
      handler: async (response) => {
        try {
          const res = await axios.post(
            "http://localhost:5000/api/" + "/verify-payment",
            {
              razorpay_order_id: options.id,
              razorpay_payment_id: response.razorpay_payment_id,
              amount: options.amount,
              address,
              productArray,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const { data } = await res.data;
          toast.success(data.message);
          navigate("/success");
        } catch (error) {
          return toast.error(error.response.data.message);
        }
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    });
    paymentObject.open();
  };
  return { generatePayment, verifyPayment };
};

export default useRazorpay;
