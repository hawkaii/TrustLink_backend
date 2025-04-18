import messageServices from "../services/messageServices.js";

const messageController = {
  getMessages: async (req, res) => {
    const { senderId, recipientId, page = 1 } = req.query;

    if (!senderId || !recipientId) {
      return res
        .status(400)
        .json({ message: "Sender and Recipient details are required" });
    }

    const limit = 25;
    const skip = (+page - 1) * limit;
    try {
      const messageObject = await messageServices.getMessages({
        senderId,
        recipientId,
        limit,
        skip,
        page,
      });
      if (!messageObject || !messageObject.messages?.length > 0) {
        return res.status(404).json({ message: "No messages found" });
      }
      return res.status(200).json(messageObject);
    } catch (err) {
      console.error("Error fetching messages:", err);
      return res.status(500).json({ message: "Failed to retrieve messages" });
    }
  },

  // Currently not required (implemented through sockets)
  // saveMessages: async (req, res) => {
  // 	const { senderId, recipientId, content,timestamp } = req.body;
  // 	try {
  // 		const post = await messageServices.saveMessages({
  // 			senderId, recipientId, content,timestamp
  // 		});
  // 		res.status(201).json(post);
  // 	} catch (error) {
  // 		res.status(500).json({ message: error.message });
  // 	}
  // },
};

export default messageController;
