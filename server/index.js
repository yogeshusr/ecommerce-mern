// Import necessary packages
const express = require("express");
//const bcrypt = require("bcryptjs"); // Import bcryptjs
const Admin = require("./models/Admin"); // Ensure this path is correct
//const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Initialize express
const app = express();
const dotenv = require("dotenv");
dotenv.config();

// Port number
const port = process.env.PORT || 5000;
const cors = require("cors");
const { readdirSync } = require("fs");
const { connectDb } = require("./db/connection");

// Handling connection errors
app.use(cors());
app.use(express.json());

connectDb();

// Default route
app.get("/", (req, res) => {
  res.send(`<h1><center>Server running on PORT : ${port}</center></h1>`);
});

// Dynamically include routes
readdirSync("./routes").map((route) =>
  app.use("/api", require(`./routes/${route}`))
);

// Listen to the port
app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}`);
});

// Enable CORS for all origins
app.use(cors());

// If you want to allow only your frontend (localhost:3000), specify the origin:
app.use(
  cors({
    origin: "http://localhost:3000", // Change this to the actual origin of your frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // Add any other allowed headers as needed
  })
);

// Your other backend routes go here...
app.post("/signup", (req, res) => {
  res.json({ message: "User registered successfully!" });
});

// Admin Signup Route - to create a new admin user
// app.post("/api/admin/signup", async (req, res) => {
//   const { name, password } = req.body;

//   if (!name || !password) {
//     return res
//       .status(400)
//       .json({ message: "Username and password are required" });
//   }

//   try {
//     // Check if the admin already exists
//     const adminExists = await Admin.findOne({ name });
//     if (adminExists) {
//       return res.status(400).json({ message: "Admin already exists" });
//     }

//     // Hash the password before saving to DB
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new admin user
//     const newAdmin = new Admin({
//       name, // Use username here
//       password: hashedPassword, // Save the hashed password
//     });

//     // Save to MongoDB
//     await newAdmin.save();

//     res
//       .status(201)
//       .json({ success: true, message: "Admin registered successfully!" });
//   } catch (error) {
//     console.error("Error during signup:", error); // Log the error for debugging
//     res.status(500).json({
//       message: "Server error during admin registration",
//       error: error.message,
//     });
//   }
// });

app.post("/api/admin/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    let admin = await Admin.findOne({ username });

    if (admin)
      return res.status(400).json({
        success: false,
        message: "Please try again with different username",
      });

    const securePassword = await bcrypt.hash(password, 10);

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

// Admin Login Route
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found, please signup",
      });
    }
    if (!password || !admin.password) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials!!!",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    // if (!isMatch) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid credentials",
    //   });
    // }
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET
    );
    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully !!!",
      token,
      admin: {
        username: admin.username,
        role: admin.role,
        id: admin._id,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// app.post("/api/admin/login", async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({
//       success: false,
//       message: "Username and password are required",
//     });
//   }

//   try {
//     let admin = await Admin.findOne({ username });
//     if (!admin) {
//       return res.status(404).json({
//         success: false,
//         message: "Admin not found, please signup",
//       });
//     }
//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }
//     const token = jwt.sign(
//       { id: admin._id, role: admin.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );
//     return res.status(200).json({
//       success: true,
//       message: "Admin logged in successfully",
//       token,
//       admin: {
//         username: admin.username,
//         role: admin.role,
//         id: admin._id,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// });

// app.post("/api/admin/login", async (req, res) => {
//   const { name, password } = req.body;

//   if (!name || !password) {
//     return res.status(400).json({ message: "Name and password are required" });
//   }

//   try {
//     // Find the admin by name
//     const admin = await Admin.findOne({ name });

//     if (!admin) {
//       return res.status(400).json({ message: "Admin not found" });
//     }

//     // Compare the provided password with the hashed password in the database
//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Issue a JWT token after successful login (optional)
//     const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     res
//       .status(200)
//       .json({ success: true, message: "Login successful!", token });
//   } catch (error) {
//     console.error("Error during login:", error); // Log the actual error here
//     res.status(500).json({
//       message: "Server error during admin login",
//       error: error.message,
//     });
//   }
// });

// Import and use admin routes
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);
