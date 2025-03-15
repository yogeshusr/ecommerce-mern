// routes/adminRoutes.js
const express = require("express");
const Admin = require("../models/Admin");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Admin signup route
router.post("/admin/signup", async (req, res) => {
  // const { name, password } = req.body;

  // if (!name || !password) {
  //   return res.status(400).json({ message: "Name and password are required" });
  // }

  // try {
  //   // Check if the admin already exists
  //   const adminExists = await Admin.findOne({ name });
  //   if (adminExists) {
  //     return res.status(400).json({ message: "Admin already exists" });
  //   }

  //   // Create a new admin
  //   const newAdmin = new Admin({
  //     name,
  //     password,
  //   });

  //   await newAdmin.save();

  //   res
  //     .status(201)
  //     .json({ success: true, message: "Admin registered successfully!" });
  // } catch (error) {
  //   console.error("Error during signup:", error);
  //   res.status(500).json({ message: "Server error during admin registration" });
  // }
  const { username, password } = req.body;

  try {
    let admin = await Admin.findOne({ username });

    if (admin)
      return res.status(400).json({
        success: false,
        message: "Please try again with different username",
      });

    const securePassword = await bcrypt.hash(password, 12);

    admin = new Admin({ username, password: securePassword });
    await admin.save();

    return res.status(201).json({
      success: true,
      message: "Admin signup successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
