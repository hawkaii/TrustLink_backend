// Import necessary modules
import session from "express-session";
import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import cors from "cors";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import http from "http";
// import { setupWebSocketServer } from "./src/websocketServer.js";
// import { setupSocketServer } from "./src/socket.js";
// Import routes
import authRouter from "./src/routes/authRoutes.js";
import userRouter from "./src/routes/userRoutes.js";
import profileRouter from "./src/routes/profileRoutes.js";
import postRouter from "./src/routes/postRoutes.js";
import messageRouter from "./src/routes/messageRoute.js";

// Import database connection
import { connectToDatabase } from "./src/config/mongooseConnect.js";

import { Server } from "socket.io";
import messageServices from "./src/services/messageServices.js";

const clients = new Map();

const PORT = process.env.PORT || 5000;

// Configure environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));

// Session management
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, // ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/uploads", express.static("uploads"));

// Connect to the database
connectToDatabase();

// Set up routes
app.use("/v1/", authRouter);
app.use("/v1/", userRouter);
app.use("/v1/", profileRouter);
app.use("/v1/", postRouter);
app.use("/v1/", messageRouter);

// Create HTTP server
const server = http.createServer(app);

// WebSocket server setup
app.get("/v1/websocket-url", (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  const isProduction = process.env.NODE_ENV === "production";
  const protocol = isProduction ? "wss" : "ws";
  const hostName = isProduction
    ? process.env.HOST_NAME || `localhost:${PORT}`
    : `localhost:${PORT}`;
  const wsUrl = `${protocol}://${hostName}?userId=${userId}`;
  res.json({ wsUrl });
});

// setupWebSocketServer(server);
// setupSocketServer(server);

const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your allowed origins
  },
});

io.on("connection", (socket) => {
  let userId;
  console.log("USER Connection REQUEST", clients.keys());
  try {
    socket.on("register_user", async (data) => {
      console.log("Register Request for: ", data);
      try {
        if (!data.userId) {
          console.log("Sender User ID is missing, disconnecting.");
          socket.disconnect();
          return;
        }
        userId = data.userId;
        clients.set(userId, socket);
        console.log(`User ${userId} connected`);
      } catch (err) {
        console.log("User Registertion Issue", err);
      }
    });
    // userId = socket.handshake.query.userId;
    // if (!userId) {
    // 	console.log("Sender User ID is missing, disconnecting.");
    // 	socket.disconnect();
    // 	return;
    // }

    // clients.set(userId, socket);
    // console.log(`User ${userId} connected`);

    socket.on("message", async (data) => {
      try {
        console.log("allUsers: ", clients.keys());
        const { recipientId, content, timestamp } = data;
        if (!recipientId || !content) {
          console.log(`Invalid message format from user: ${userId}.`);
          return;
        }
        const recipientSocket = clients.get(recipientId);
        console.log("Is Recipient Connected", recipientSocket?.connected);
        if (recipientSocket && recipientSocket.connected) {
          recipientSocket.emit("message", {
            senderId: userId,
            content,
            timestamp,
          });
          await messageServices.saveMessages({
            senderId: userId,
            recipientId,
            content,
            timestamp,
          });
          console.log("MESSAGE SENT");
        } else {
          console.log(`Recipient ${recipientId} not connected.`);
        }
      } catch (err) {
        console.log("Message Event Error: ", err);
      }
    });

    socket.on("disconnect", () => {
      clients.delete(userId);
      console.log(`User ${userId} disconnected`);
    });

    socket.on("error", (err) => {
      console.log(`Error with user ${userId}: ${err.message}`);
    });
  } catch (err) {
    console.log("Error during Socket connection:", err);
    if (userId) {
      clients.delete(userId);
    }
    socket.disconnect();
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
