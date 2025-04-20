import express from "express";
import profileController from "../controllers/profileController.js";
import { verifyAuthentication } from "../passport/passport.js"; // import verifyAuthentication from passport.js
import {
  uploadAndCompress,
  uploadMultipleFiles,
} from "../middleware/fileUploader.js";
const router = express.Router();

// Get the current user's profile
router.get(
  "/profiles/current",
  verifyAuthentication,
  profileController.getCurrentProfile,
);

// Get follow status of profiles
router.get(
  "/profiles/follows",
  verifyAuthentication,
  profileController.getFollowStatus,
);

// Get posts of a specific profile by ID
router.get(
  "/profiles/:id/posts",
  verifyAuthentication,
  profileController.getPosts,
);

// Get all profiles
router.get("/profiles", verifyAuthentication, profileController.getProfiles);

// Get a specific profile by ID
router.get("/profiles/:id", verifyAuthentication, profileController.getProfile);

// Follow a profile
router.post(
  "/profiles/follows",
  verifyAuthentication,
  profileController.followProfile,
);

// Create or update a profile with file uploads and compression
router.post(
  "/profiles",
  verifyAuthentication,
  uploadMultipleFiles,
  uploadAndCompress,
  profileController.createAndUpdateProfile,
);

// Add experience to a profile
router.post(
  "/profiles/experience",
  verifyAuthentication,
  profileController.createExperience,
);

// Update a profile with file uploads and compression
router.put(
  "/profiles",
  verifyAuthentication,
  uploadMultipleFiles,
  uploadAndCompress,
  profileController.createAndUpdateProfile,
);

// Unfollow a profile
router.delete(
  "/profiles/follows",
  verifyAuthentication,
  profileController.unfollowProfile,
);

// Delete a specific profile by ID
router.delete(
  "/profiles/:id",
  verifyAuthentication,
  profileController.deleteProfile,
);

// Check if a username already exists
router.get(
  "/profiles/user-exists/:username",
  verifyAuthentication,
  profileController.checkUserNameExists,
);

// Get activity posts of a specific profile by ID
router.get("/profiles/:id/activity-posts", profileController.getActivityPosts);

// Get requirement posts of a specific profile by ID
router.get(
  "/profiles/:id/requirement-posts",
  profileController.getRequirementPosts,
);

// Get moment posts of a specific profile by ID
router.get("/profiles/:id/moment-posts", profileController.getMomentPosts);

// router.get('/profiles/:username', verifyAuthentication, profileController.getProfileByUsername);

export default router;
