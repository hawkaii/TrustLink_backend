// mongooseConnect.js
import mongoose from "mongoose";
import dotenv from "dotenv";

import "../models/postLike.js"; // Adjust the path as needed
import "../models/comment.js"; // Adjust the path as needed
import "../models/post.js"; // Adjust the path as needed
import "../models/profile.js"; // Adjust the path as needed
import "../models/message.js";
// Load environment variables
dotenv.config();

// MongoDB URI from environment variables
const mongoURI = process.env.MONGODB_URI;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoURI, {});
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process if connection fails
  }
};

// Handle Mongoose events
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to the database");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from the database");
});

export { connectToDatabase };
