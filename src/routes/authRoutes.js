import express from "express";
import cors from "cors";
import passport from "passport";
import userController from "../controllers/userController.js";
import {
  sendAuthStatus,
  signout,
  signin,
  verifyAuthentication,
} from "../passport/passport.js";
import {
  uploadAndCompress,
  uploadMultipleFiles,
} from "../middleware/fileUploader.js";
const router = express.Router();

router.get("/status", (req, res) =>
  res.status(200).json({ message: "Service is running" }),
);

router.post("/auth/signin", userController.authenticateUser, signin);

router.post("/auth/signout", verifyAuthentication, signout);

router.get("/auth/status", sendAuthStatus);

router.post(
  "/auth/signup",
  userController.validateUserProfile,
  uploadMultipleFiles,
  uploadAndCompress,
  userController.createAndUpdateProfile,
);

export default router;
