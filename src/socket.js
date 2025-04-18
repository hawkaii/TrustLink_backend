import { Server } from "socket.io";
import messageServices from "./services/messageServices.js";

const clients = new Map();

export const setupSocketServer = (server) => {
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

      socket.on("message", async (data) => {
        try {
          const { recipientId, content, timestamp } = data;
          if (!recipientId || !content) {
            console.log(`Invalid message format from user: ${userId}.`);
            return;
          }
          const recipientSocket = clients.get(recipientId);
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

  console.log("Socket.io server is running");
};
