import { WebSocketServer, WebSocket } from "ws";
import messageServices from "./services/messageServices.js";

const clients = new Map();

export const setupWebSocketServer = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    let userId;
    try {
      userId = new URL(req.url, `http://${req.headers.host}`).searchParams.get(
        "userId",
      );
      if (!userId) {
        console.log("Sender User ID is missing, closing connection.");
        ws.close();
        return;
      }

      clients.set(userId, ws);
      console.log(`User ${userId} connected`);

      ws.on("message", async (message) => {
        try {
          const { recipientId, content, timestamp } = JSON.parse(message);
          if (!recipientId || !content) {
            console.log(`Invalid message format from user: ${userId}.`);
            return;
          }

          const recipientWs = clients.get(recipientId);
          if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
            recipientWs.send(
              JSON.stringify({ senderId: userId, content, timestamp }),
            );
            await messageServices.saveMessages({
              senderId: userId,
              recipientId: recipientId,
              content,
              timestamp,
            });
          } else {
            console.log(`Recipient ${recipientId} not connected.`);
          }
        } catch (err) {
          console.log("Message Event Error: ", err);
        }
      });

      ws.on("close", () => {
        clients.delete(userId);
        console.log(`User ${userId} disconnected`);
      });

      ws.on("error", (err) => {
        console.log(`Error with user ${userId}: ${err.message}`);
      });
    } catch (err) {
      console.log("Error during WebSocket connection:", err);
      if (userId) {
        clients.delete(userId);
      }
      ws.close();
    }
  });

  console.log("WebSocket server is running");
};
