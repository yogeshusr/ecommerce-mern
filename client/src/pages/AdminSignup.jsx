import { useState } from "react";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const AdminSignup = () => {
  const [enabled, setEnabled] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = e.target.elements;

    //Validate empty fields
    // if (username.value.trim() === "" || password.value.trim() === "") {
    //   toast("Please fill all the fields", { type: "error" });
    //   return; // Stop further execution if validation fails
    // }

    try {
      // Make the POST request
      const res = await axios.post(
        "http://localhost:5000/api/admin/signup", // Assuming your API endpoint
        {
          username: username.value,
          password: password.value,
        }
      );

      const data = await res.data;

      // Check if the server returned a success response
      if (data.success) {
        toast(data.message, { type: "success" }); // Success toast
        // Optionally redirect to login or auto-login
        navigate("/admin/login");
      } else {
        toast(data.message || "Something went wrong, please try again", {
          type: "error",
        });
      }
    } catch (error) {
      console.error("Full error:", error); // Log full error object

      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Axios response error:", error.response);
          toast(
            error.response.data.message || "Something went wrong on the server",
            { type: "error" }
          );
        } else if (error.request) {
          console.error("No response from the server:", error.request);
          toast(
            "No response from the server. Please check your internet connection.",
            { type: "error" }
          );
        } else {
          console.error("Error in request setup:", error.message);
          toast("Error setting up the request. Please try again.", {
            type: "error",
          });
        }
      } else if (error.message) {
        console.error("General JS error:", error.message);
        toast(`Error: ${error.message}`, { type: "error" });
      } else {
        console.error("Unknown error occurred.");
        toast("An unknown error occurred. Please try again later.", {
          type: "error",
        });
      }
    }
  };

  return (
    <div className="w-[60vw] lg:w-[25vw] mx-auto my-10 grid gap-3">
      <h1 className="text-2xl font-bold">Register your account</h1>
      <form className="grid gap-3" onSubmit={handleSubmit}>
        <Input placeholder="Enter Your Name" type="text" name="username" />
        <Input
          placeholder="Enter Your Password"
          type="password"
          name="password"
        />
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" onCheckedChange={(e) => setEnabled(e)} />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Accept terms and conditions
          </label>
        </div>
        <Button disabled={!enabled}>Sign Up</Button>
        <div className="flex gap-2 items-center">
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Already have an account?
          </label>
          <Link to={"/admin/login"}>
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Login
            </label>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AdminSignup;
