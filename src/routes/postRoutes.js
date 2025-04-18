import express from "express";

import profileController from "../controllers/profileController.js";
import postController from "../controllers/postController.js";
import { verifyAuthentication } from "../passport/passport.js"; // import verifyAuthentication from passport.js
import {
  uploadMultipleFiles,
  uploadAndCompress,
} from "../middleware/fileUploader.js";
const router = express.Router();

router.post(
  "/posts",
  verifyAuthentication,
  uploadMultipleFiles,
  uploadAndCompress,
  profileController.createPost,
);
router.post("/posts/like", verifyAuthentication, postController.likePost);

router.post(
  "/posts/:id/comment/",
  verifyAuthentication,
  postController.createComment,
);

router.delete("/posts/unlike", verifyAuthentication, postController.unlikePost);

export default router;
