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
      // Fetch a profile using the user ID from the request parameters
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
    const profileId = req.user.profileId; // Extract profile ID from the authenticated user

    try {
      // Fetch the profile using the profile ID
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
      req.body; // Extract profile data from the request body
    const userId = req.user.id; // Extract user ID from the authenticated user
    const { files: image } = req; // Extract uploaded files
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    try {
      // Create or update the profile with the provided data
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
    const userId = req.user.id; // Extract user ID from the authenticated user
    try {
      // Delete the profile associated with the user ID
      await profileServices.deleteProfile(userId);
      res.status(200).json({ message: "Profile deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get follow status
  getFollowStatus: async (req, res) => {
    const userId = req.user.id; // Extract user ID from the authenticated user
    const { username } = req.body; // Extract username from the request body

    try {
      // Fetch the follow status for the given username
      const status = await profileServices.getFollowStatus(userId, username);
      res.status(200).json({ status });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Follow a profile
  followProfile: async (req, res) => {
    const userId = req.user.id; // Extract user ID from the authenticated user
    const { username } = req.body; // Extract username from the request body

    try {
      // Follow the profile with the given username
      await profileServices.followProfile(userId, username);
      res.status(200).json({ message: "Profile followed" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Unfollow a profile
  unfollowProfile: async (req, res) => {
    const activeId = req.user.id; // Extract user ID from the authenticated user
    const { username } = req.body; // Extract username from the request body
    try {
      // Unfollow the profile with the given username
      await profileServices.unfollowProfile(activeId, username);
      res.status(200).json({ message: "Profile unfollowed" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get posts by user ID
  getPosts: async (req, res) => {
    const userId = req.params.id; // Extract user ID from the request parameters
    try {
      // Fetch posts associated with the user ID
      const posts = await profileServices.getPostsByUserId(userId);
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get activity posts by user ID
  getActivityPosts: async (req, res) => {
    const userId = req.params.id; // Extract user ID from the request parameters
    try {
      // Fetch activity posts associated with the user ID
      const posts = await profileServices.getActivityPostsByUserId(userId);
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get requirement posts by user ID
  getRequirementPosts: async (req, res) => {
    const userId = req.params.id; // Extract user ID from the request parameters
    try {
      // Fetch requirement posts associated with the user ID
      const posts = await profileServices.getRequirementPostsByUserId(userId);
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get moment posts by user ID
  getMomentPosts: async (req, res) => {
    const userId = req.params.id; // Extract user ID from the request parameters
    try {
      // Fetch moment posts associated with the user ID
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
    const { files: image } = req; // Extract uploaded files
    const data = JSON.parse(req.body?.data || null); // Parse additional post-specific data
    try {
      // Create a new post with the provided data
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
    const { company, position, startDate, endDate, description } = req.body; // Extract experience data from the request body
    const profileId = req.user.profileId; // Extract profile ID from the authenticated user

    try {
      // Create a new experience for the profile
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
    const profileId = req.user.profileId; // Extract profile ID from the authenticated user

    try {
      // Fetch experiences associated with the profile ID
      const experiences = await profileServices.getExperience(profileId);
      res.status(200).json(experiences);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Check if a username already exists
  checkUserNameExists: async (req, res) => {
    const { username = null } = req.params; // Extract username from the request parameters
    try {
      if (!username) {
        throw new Error("Username is required!");
      }
      // Check if the username exists in the database
      const userExists = await profileServices.checkUserNameExists(username);
      res.status(200).json({ isUserExists: userExists });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default profileController;
