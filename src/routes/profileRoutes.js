import express from "express";
import profileController from "../controllers/profileController.js";
import { verifyAuthentication } from "../passport/passport.js"; // import verifyAuthentication from passport.js
import {
  uploadAndCompress,
  uploadMultipleFiles,
} from "../middleware/fileUploader.js";
const router = express.Router();

router.get(
  "/profiles/current",
  verifyAuthentication,
  profileController.getCurrentProfile,
);
router.get(
  "/profiles/follows",
  verifyAuthentication,
  profileController.getFollowStatus,
);
router.get(
  "/profiles/:id/posts",
  verifyAuthentication,
  profileController.getPosts,
);
router.get("/profiles", verifyAuthentication, profileController.getProfiles);
router.get("/profiles/:id", verifyAuthentication, profileController.getProfile);

router.post(
  "/profiles/follows",
  verifyAuthentication,
  profileController.followProfile,
);
router.post(
  "/profiles",
  verifyAuthentication,
  uploadMultipleFiles,
  uploadAndCompress,
  profileController.createAndUpdateProfile,
);
router.post(
  "/profiles/experience",
  verifyAuthentication,
  profileController.createExperience,
);

router.put(
  "/profiles",
  verifyAuthentication,
  uploadMultipleFiles,
  uploadAndCompress,
  profileController.createAndUpdateProfile,
);

router.delete(
  "/profiles/follows",
  verifyAuthentication,
  profileController.unfollowProfile,
);
router.delete(
  "/profiles/:id",
  verifyAuthentication,
  profileController.deleteProfile,
);
router.get(
  "/profiles/user-exists/:username",
  verifyAuthentication,
  profileController.checkUserNameExists,
);
router.get("/profiles/:id/activity-posts", profileController.getActivityPosts);
router.get(
  "/profiles/:id/requirement-posts",
  profileController.getRequirementPosts,
);
router.get("/profiles/:id/moment-posts", profileController.getMomentPosts);

// router.get('/profiles/:username', verifyAuthentication, profileController.getProfileByUsername);

export default router;
