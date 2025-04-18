import mongoose from "mongoose";
import PostLike from "../models/postLike.js";
import { Post } from "../models/post.js";
import { Profile } from "../models/profile.js";
import { Comment } from "../models/comment.js";

const postServices = {
  // Like a post
  likePost: async (postId, userId, profileId) => {
    try {
      const postLike = new PostLike({ postId, userId, profileId });
      await postLike.save();

      const post = await Post.findById(postId);
      if (!post) {
        throw new Error("Post not found");
      }
      post.likes.push(postLike._id);
      await post.save();

      const profile = await Profile.findById(profileId);
      if (!profile) {
        throw new Error("Profile not found");
      }
      profile.postLikes.push(postLike._id);
      await profile.save();

      return postLike;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to like post");
    }
  },

  // Unlike a post
  unlikePost: async (postId, userId) => {
    try {
      await PostLike.deleteOne({ postId, userId });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to unlike post");
    }
  },

  // Get likes for a post
  getPostLikes: async (postId) => {
    try {
      const likes = await PostLike.find({ postId }).populate(
        "userId",
        "username",
      );
      return likes;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch post likes");
    }
  },
  createComment: async (postId, profileId, body) => {
    try {
      const post = await Post.findById(postId);
      if (!post) {
        throw new Error("Post not found");
      }

      const comment = new Comment({ postId, profileId, body });
      await comment.save();

      post.comments.push(comment._id);
      await post.save();
      return comment;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to create comment: ${error.message}`);
    }
  },
  editComment: async (commentId, profileId, body) => {
    try {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        throw new Error("Comment not found");
      }
      if (comment.profileId.toString() !== profileId) {
        throw new Error("You are not authorized to edit this comment");
      }
      comment.body = body;
      await comment.save();
      return comment;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to edit comment: ${error.message}`);
    }
  },
};

export default postServices;
