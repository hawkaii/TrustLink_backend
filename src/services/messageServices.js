import Messages from "../models/message.js";

const messageServices = {
  getMessages: async (data) => {
    try {
      const messages = await Messages.find({
        $or: [
          { senderId: data.senderId, recipientId: data.recipientId },
          { senderId: data.recipientId, recipientId: data.senderId },
        ],
      })
        .skip(data.skip)
        .limit(data.limit)
        .sort({ timestamp: 1 });

      const totalMessages = await Messages.countDocuments({
        $or: [
          { senderId: data.senderId, recipientId: data.recipientId },
          { senderId: data.recipientId, recipientId: data.senderId },
        ],
      });

      const totalPages = Math.ceil(totalMessages / data.limit);
      return {
        page: data.page,
        limit: data.limit,
        totalPages,
        totalMessages,
        messages,
      };
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching profiles");
    }
  },

  saveMessages: async (messageData) => {
    try {
      const { senderId, recipientId, content, timestamp } = messageData;
      if (!senderId || !recipientId || !content) {
        throw new Error("senderId, recipientId, and content are required");
      }
      return Messages.create({ senderId, recipientId, content, timestamp });
    } catch (error) {
      console.error("Error saving message:", error);
      throw new Error("Failed to save messages");
    }
  },
};

export default messageServices;
