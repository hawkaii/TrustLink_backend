//import mongoose from "mongoose";

import { Profile } from "../models/profile.js";
import Follow from "../models/follow.js";
import {
  Post,
  ActivityPost,
  RequirementPost,
  MomentPost,
} from "../models/post.js";
import PostLike from "../models/postLike.js";
import { Experience } from "../models/experience.js";
import userServices from "./userServices.js";

const profileServices = {
  getProfiles: async () => {
    try {
      const profiles = await Profile.find();
      return profiles;
    } catch (error) {
      throw new Error("Error fetching profiles" + error);
    }
  },

  createAndUpdateProfile: async (payload) => {
    const { userId, username, profession, birthday, location, image } = payload;
    try {
      let profile = await Profile.findOne({ userId });
      let fileDetail;
      if (image && image?.length > 0) {
        fileDetail = await userServices.uploadImages(image, userId);
      }
      if (profile) {
        // Update existing profile
        profile.username = username;
        if (profession) profile.profession = profession;
        if (birthday) profile.birthday = birthday;
        if (location) profile.location = location;
        if (fileDetail) {
          profile.profilePicInfoId = fileDetail[0]._id;
          profile.profilePicLowQualityURL = fileDetail[0].highlyCompressedPath;
          profile.profilePicMediumQualityURL =
            fileDetail[0].mediumCompressedPath;
        }
        profile.updatedAt = new Date();
        profile = await profile.save();
        return { message: "Profile updated", profile };
      } else {
        // Create new profile
        profile = new Profile({
          userId,
          username,
          profession,
          birthday,
          location,
          createdAt: new Date(),
          updatedAt: new Date(),
          // profilePicInfoId: fileDetail[0]._id,
          // profilePicLowQualityURL: fileDetail[0].highlyCompressedPath,
          // profilePicMediumQualityURL: fileDetail[0].mediumCompressedPath,
        });
        profile = await profile.save();
        return { message: "Profile created", profile };
      }
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create or update profile");
    }
  },

  getProfile: async (profileId) => {
    try {
      const profile = await Profile.findById(profileId)
        .populate({
          path: "followers", // Populate `followers` from `Follow` model
          model: "Follow",
          populate: {
            path: "followerId", // Populate the follower profiles
            model: "Profile",
            select: "username profilePic",
          },
        })
        .populate({
          path: "following", // Populate `following` from `Follow` model
          populate: {
            path: "profileId", // Populate the profiles being followed
            model: "Profile",
            select: "username profilePic",
          },
        })
        .populate("posts") // Populate posts
        .populate("experience");

      if (!profile) throw new Error("Profile not found");
      return profile;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw new Error("Failed to fetch profile");
    }
  },
  getProfileByUserId: async (userId) => {
    try {
      const profile = await Profile.findOne({ userId })
        .populate({
          path: "followers", // Populate `followers` from `Follow` model
          populate: {
            path: "followerId", // Populate the follower profiles
            model: "Profile",
            select: "username profilePic",
          },
        })
        .populate({
          path: "following", // Populate `following` from `Follow` model
          populate: {
            path: "profileId", // Populate the profiles being followed
            model: "Profile",
            select: "username profilePic",
          },
        })
        .populate("posts") // Populate posts
        .populate("experience");

      // if (!profile) throw new Error('Profile not found');
      return profile;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw new Error("Failed to fetch profile");
    }
  },

  getFollowStatus: async (currentUserId, username) => {
    try {
      const activeId = await Profile.findOne({ userId: Number(currentUserId) });
      console.log(activeId);
      const profileId = await Profile.findOne({ username: username });
      console.log(profileId);

      if (!profileId) {
        throw new Error("Profile not found");
      }

      const status = await Follow.findOne({
        profileId: profileId,
        followerId: activeId,
      });
      console.log(status);
      return !!status;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to check follow status");
    }
  },

  followProfile: async (currentUserId, usernameToFollow) => {
    try {
      const currentProfile = await Profile.findOne({
        userId: Number(currentUserId),
      });
      const profileToFollow = await Profile.findOne({
        username: usernameToFollow,
      });
      if (!profileToFollow) {
        throw new Error("Profile not found");
      }

      let follow = await Follow.findOne({
        profileId: profileToFollow._id,
        followerId: currentProfile._id,
      });

      if (follow) {
        throw new Error("Already following profile");
      }

      follow = new Follow({
        profileId: profileToFollow._id,
        followerId: currentProfile._id,
      });
      await follow.save();

      currentProfile.follows.push(follow._id);
      await currentProfile.save();

      return follow;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to follow profile");
    }
  },

  unfollowProfile: async (currentUserId, usernameToUnfollow) => {
    try {
      const currentProfile = await Profile.findOne({
        userId: Number(currentUserId),
      });
      const profileToUnfollow = await Profile.findOne({
        username: usernameToUnfollow,
      });
      if (!profileToUnfollow) {
        throw new Error("Profile not found");
      }

      await Follow.deleteOne({
        profileId: profileToUnfollow._id,
        followerId: currentProfile._id,
      });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to unfollow profile");
    }
  },
  getPosts: async (profileId) => {
    console.log(profileId);

    try {
      const posts = await Post.find({ profileId: profileId })
        .sort({ createdAt: -1 })
        // .populate('profileId')
        .populate("likes")
        .populate({
          path: "comments",
          populate: {
            path: "profile likes",
          },
        });
      console.log(`Posts fetched: ${JSON.stringify(posts)}`);
      return posts;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch posts");
    }
  },

  createPost: async (postData) => {
    try {
      let {
        imageURL,
        publicId,
        caption,
        author,
        profileId,
        userId,
        type,
        data,
        mentions,
        image,
        imageInfoIds,
        lowQualityImageURLs,
        mediumQualityImageURLs,
      } = postData;

      const profile = await Profile.findById(profileId);
      if (!profile) {
        throw new Error("Profile not found");
      }
      let fileDetail;
      if (image && image?.length > 0) {
        fileDetail = await userServices.uploadImages(image, userId);
      }
      if (fileDetail) {
        imageInfoIds = fileDetail.map((deatils) => deatils._id);
        lowQualityImageURLs = fileDetail.map(
          (deatils) => deatils.highlyCompressedPath,
        );
        mediumQualityImageURLs = fileDetail.map(
          (deatils) => deatils.mediumCompressedPath,
        );
      }
      let post;
      switch (type) {
        case "activity":
          post = await ActivityPost.create({
            mediaUrl: imageURL,
            mediaUploadId: publicId,
            body: caption || null,
            profileId: profileId,
            userId: userId,
            activityDetails: data.activityDetails,
            mentions: mentions || [],
            comments: data.comments || [],
            likes: data.likes || [],
            lowQualityImageURLs,
            mediumQualityImageURLs,
            imageInfoIds,
          });
          break;
        case "requirement":
          post = await RequirementPost.create({
            mediaUrl: imageURL,
            mediaUploadId: publicId,
            body: caption || null,
            profileId: profileId,
            userId: userId,
            title: data.title,
            description: data.description,
            location: data.location,
            profession: data.profession,
            lowQualityImageURLs,
            mediumQualityImageURLs,
            imageInfoIds,
          });
          break;
        case "moment":
          post = await MomentPost.create({
            mediaUrl: imageURL,
            mediaUploadId: publicId,
            body: caption || null,
            profileId: profileId,
            userId: userId,
            momentDetails: data.momentDetails,
            lowQualityImageURLs,
            mediumQualityImageURLs,
            imageInfoIds,
          });
          break;
        default:
          throw new Error("Invalid post type");
      }

      profile.posts.push(post._id);
      await profile.save();

      return post;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create post");
    }
  },

  deleteProfile: async (userId) => {
    try {
      await Profile.deleteOne({ userId });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to delete profile");
    }
  },

  getPostsByUserId: async (userId) => {
    try {
      const profile = await Profile.findOne({ userId });
      if (!profile) throw new Error("Profile not found");
      const posts = await Post.find({ profileId: profile._id })
        .sort({ createdAt: -1 })
        .populate("likes")
        .populate({
          path: "comment",
          populate: {
            path: "profile likes",
          },
        });
      return posts;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch posts");
    }
  },

  getActivityPostsByUserId: async (userId) => {
    try {
      const profile = await Profile.findOne({ userId });
      if (!profile) throw new Error("Profile not found");
      const posts = await ActivityPost.find({ profileId: profile._id })
        .sort({ createdAt: -1 })
        .populate("likes")
        .populate({
          path: "comment",
          populate: {
            path: "profile likes",
          },
        });
      return posts;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch activity posts");
    }
  },

  getRequirementPostsByUserId: async (userId) => {
    try {
      const profile = await Profile.findOne({ userId });
      if (!profile) throw new Error("Profile not found");
      const posts = await RequirementPost.find({ profileId: profile._id }).sort(
        { createdAt: -1 },
      );
      return posts;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch requirement posts");
    }
  },

  getMomentPostsByUserId: async (userId) => {
    try {
      const profile = await Profile.findOne({ userId });
      if (!profile) throw new Error("Profile not found");
      const posts = await MomentPost.find({ profileId: profile._id }).sort({
        createdAt: -1,
      });
      return posts;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch moment posts");
    }
  },
  checkUserNameExists: async (userName) => {
    try {
      const user = await Profile.findOne({ username: userName });
      return !!user;
    } catch (error) {
      throw new Error("Failed to fetch user");
    }
  },

  createExperience: async (profileId, experienceData) => {
    try {
      const profile = await Profile.findById(profileId);
      if (!profile) {
        throw new Error("Profile not found");
      }

      const experience = new Experience({ ...experienceData, profileId });
      await experience.save();

      profile.experience.push(experience._id);
      await profile.save();

      return experience;
    } catch (error) {
      console.error("Error creating experience:", error);
      throw new Error("Failed to create experience");
    }
  },

  getExperience: async (profileId) => {
    try {
      const profile = await Profile.findById(profileId).populate("experience");
      if (!profile) {
        throw new Error("Profile not found");
      }
      return profile.experience;
    } catch (error) {
      console.error("Error fetching experiences:", error);
      throw new Error("Failed to fetch experiences");
    }
  },
};

export default profileServices;
