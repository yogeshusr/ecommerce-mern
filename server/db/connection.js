// const mongoose = require("mongoose");

// const connectDb = async () => {
//   try {
//     const connection = await mongoose.connect(process.env.MONGO_URI);

//     if (connection.STATES.connecting) {
//       console.log(`DB connecting to ${connection.connection.host}`);
//     }

//     if (connection.STATES.connected) {
//       console.log(`DB connected to ${connection.connection.host}`);
//     }

//     if (connection.STATES.disconnected) {
//       console.log(`DB disconnected from ${connection.connection.host}`);
//     }
//   } catch (error) {
//     console.log("Error connecting to database", error);
//   }
// };

// module.exports = { connectDb };
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

module.exports = { connectDb };
