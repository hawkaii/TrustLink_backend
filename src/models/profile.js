// Profile.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const profileSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  profilePic: {
    type: String,
    default: null,
  },
  profilePicUploadId: {
    type: String,
    default: null,
  },
  profilePicUrl: {
    type: String,
    default: null,
  },
  profession: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
    default: null,
  },
  profilePicInfoId: {
    type: String,
    default: null,
  },
  profilePicLowQualityURL: {
    type: String,
    default: null,
  },
  profilePicMediumQualityURL: {
    type: String,
    default: null,
  },
  userId: {
    type: Number, // Assuming that userId is an integer from your SQL DB
    unique: true,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  experience: [
    {
      type: Schema.Types.ObjectId,
      ref: "Experience",
    },
  ],
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  postLikes: [
    {
      type: Schema.Types.ObjectId,
      ref: "PostLike",
    },
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Follow",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "Follow",
    },
  ],
  notified: [
    {
      type: Schema.Types.ObjectId,
      ref: "Notification",
    },
  ],
  notifying: [
    {
      type: Schema.Types.ObjectId,
      ref: "Notification",
    },
  ],
  location: {
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update `updatedAt` on profile updates
profileSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Profile = mongoose.model("Profile", profileSchema);

export { Profile };
