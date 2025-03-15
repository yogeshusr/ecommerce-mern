//import React from "react";
//import React, { useState } from "react";

import { Input } from "../components/ui/input";
//import { Checkbox } from "../components/ui/checkbox";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserLogin } from "../redux/slices/authSlice";
//import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = e.target.elements;

    // Validate empty fields
    if (email.value.trim() === "" || password.value.trim() === "") {
      toast("Please fill all the fields", { type: "error" });
      return; // Stop further execution if validation fails
    }

    try {
      // Log the API URL for debugging
      //console.log(import.meta.env); // Log all environment variables
      //console.log(import.meta.env.VITE_API_URL); // Log just VITE_API_URL
      //console.log("API URL:", import.meta.env.VITE_API_URL);
      //const apiUrl = import.meta.env.VITE_API_URL;
      //console.log(apiUrl); // This should print the URL from the .env file

      // Make the POST request
      const res = await axios.post("http://localhost:5000/api" + "/login", {
        email: email.value,
        password: password.value,
      });

      const data = await res.data;
      dispatch(setUserLogin(data));
      // Show success toast with the message from the server response
      toast(data.message, { type: "success" });

      // Navigate to login page after successful signup
      navigate("/");
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
    <div className="w-[60vw] lg:w-[25vw] mx-auto my-32 grid gap-3">
      <h1 className="text-2xl font-bold">Login your account</h1>
      <form className="grid gap-3" onSubmit={handleSubmit}>
        <Input placeholder="Enter Your Email" type="email" name="email" />
        <Input
          placeholder="Enter Your Password"
          type="password"
          name="password"
        />
        <Button>Login</Button>
        <div className="flex gap-2 items-center">
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Dont have an account?
          </label>
          <Link to={"/signup"}>
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              signup
            </label>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
