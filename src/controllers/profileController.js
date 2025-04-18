import profileServices from "../services/profileServices.js";

const profileController = {
  // Get all profiles
  getProfiles: async (req, res) => {
    try {
      const profiles = await profileServices.getProfiles();
      console.log(`Profiles fetched: ${JSON.stringify(profiles)}`);

      if (!profiles) {
        return res.status(404).json({ message: "No profiles found" });
      }

      res.status(200).json(profiles);
    } catch (error) {
      console.error(`Error fetching profiles: ${error.message}`);
      if (!res.headersSent) {
        res.status(500).json({ message: error.message });
      }
    }
  },

  // Get a profile by user ID
  getProfile: async (req, res) => {
    try {
      const profile = await profileServices.getProfileByUserId(req.params.id);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      } else {
        res
          .status(200)
          .json({ profile, message: "Successfully fetched profile" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get the current user's profile
  getCurrentProfile: async (req, res) => {
    const profileId = req.user.profileId;

    try {
      const profile = await profileServices.getProfile(profileId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.status(200).json(profile);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create and update profile
  createAndUpdateProfile: async (req, res) => {
    const { username, profession, birthday, latitude, longitude, city } =
      req.body;
    const userId = req.user.id; // Assuming req.user is set by your authentication middleware
    const { files: image } = req;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    try {
      const location =
        latitude && longitude && city ? { latitude, longitude, city } : null;
      const result = await profileServices.createAndUpdateProfile({
        userId,
        username,
        profession,
        birthday,
        location,
        image,
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete a profile
  deleteProfile: async (req, res) => {
    const userId = req.user.id;
    try {
      await profileServices.deleteProfile(userId);
      res.status(200).json({ message: "Profile deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get follow status
  getFollowStatus: async (req, res) => {
    const userId = req.user.id;
    const { username } = req.body;

    try {
      const status = await profileServices.getFollowStatus(userId, username);
      res.status(200).json({ status });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Follow a profile
  followProfile: async (req, res) => {
    const userId = req.user.id;
    const { username } = req.body;

    try {
      await profileServices.followProfile(userId, username);
      res.status(200).json({ message: "Profile followed" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Unfollow a profile
  unfollowProfile: async (req, res) => {
    const activeId = req.user.id;
    const { username } = req.body;
    try {
      await profileServices.unfollowProfile(activeId, username);
      res.status(200).json({ message: "Profile unfollowed" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get posts by user ID
  getPosts: async (req, res) => {
    const userId = req.params.id;
    try {
      const posts = await profileServices.getPostsByUserId(userId);
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get activity posts by user ID
  getActivityPosts: async (req, res) => {
    const userId = req.params.id;
    try {
      const posts = await profileServices.getActivityPostsByUserId(userId);
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get requirement posts by user ID
  getRequirementPosts: async (req, res) => {
    const userId = req.params.id;
    try {
      const posts = await profileServices.getRequirementPostsByUserId(userId);
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get moment posts by user ID
  getMomentPosts: async (req, res) => {
    const userId = req.params.id;
    try {
      const posts = await profileServices.getMomentPostsByUserId(userId);
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new post
  createPost: async (req, res) => {
    const { imageURL, publicId, caption, type } = req.body; // Extract post data from the request body
    const author = req.user.username; // Use the signed-in user's username
    const profileId = req.user.profileId; // Use the signed-in user's profileId
    const userId = req.user.id; // Use the signed-in user's userId
    const { files: image } = req;
    const data = JSON.parse(req.body?.data || null);
    try {
      // Call the service to create a new post
      const post = await profileServices.createPost({
        imageURL,
        publicId,
        caption,
        author,
        profileId,
        userId,
        type, // Post type (activity, requirement, moment)
        data, // Post-specific data (optional)
        image,
      });
      res.status(201).json(post); // Send the newly created post as JSON in the response
    } catch (error) {
      res.status(500).json({ message: error.message }); // Handle errors
    }
  },

  // Create a new experience
  createExperience: async (req, res) => {
    const { company, position, startDate, endDate, description } = req.body;
    const profileId = req.user.profileId;

    try {
      const experience = await profileServices.createExperience(profileId, {
        company,
        position,
        startDate,
        endDate,
        description,
      });
      res
        .status(201)
        .json({ experience, message: "Experience created successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get experiences for a profile
  getExperience: async (req, res) => {
    const profileId = req.user.profileId;

    try {
      const experiences = await profileServices.getExperience(profileId);
      res.status(200).json(experiences);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  checkUserNameExists: async (req, res) => {
    const { username = null } = req.params;
    try {
      if (!username) {
        throw new Error("Username is required!");
      }
      const userExists = await profileServices.checkUserNameExists(username);
      res.status(200).json({ isUserExists: userExists });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default profileController;
