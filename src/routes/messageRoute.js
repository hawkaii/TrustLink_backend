import express from "express";
import messageController from "../controllers/message.controller.js";
import { verifyAuthentication } from "../passport/passport.js";

const router = express.Router();

router.get("/messages", verifyAuthentication, messageController.getMessages);
// router.post('/messages', verifyAuthentication, messageController.saveMessages);

export default router;
