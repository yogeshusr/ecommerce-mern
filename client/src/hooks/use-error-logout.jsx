import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setUserLogout } from "../redux/slices/authSlice";
//import { useNavigate } from "react-router-dom";

const useErrorLogout = () => {
  const dispatch = useDispatch();
  //const navigate = useNavigate();

  const handleErrorLogout = (error, otherTitle = "Error occurred") => {
    if (error.response && error.response.status === 401) {
      // Step 1: Clear the expired token from localStorage
      //localStorage.removeItem("token");

      // Step 2: Dispatch logout action if you're using Redux
      dispatch(setUserLogout());

      // Step 3: Show the "session expired" toast
      toast.error("Session expired. Please login again to continue.");

      // Step 4: Redirect to the login page after a short delay
      // setTimeout(() => {
      //   navigate("/login"); // React Router v6 redirection
      // }, 2000); // 2 seconds delay
    } else {
      // Handle other errors
      const message = error?.response?.data?.message || "An unexpected error occurred.";
      toast.error(`${otherTitle}: ${message}`);
    }
  };

  return { handleErrorLogout };
};

export default useErrorLogout;
