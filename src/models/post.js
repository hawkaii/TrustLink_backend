import mongoose from "mongoose";
const { Schema } = mongoose;

const baseOptions = {
  discriminatorKey: "postType",
  collection: "posts",
};

const PostSchema = new Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    mediaUrl: {
      type: String,
      required: false,
    },
    mediaUploadId: {
      type: String,
      default: null,
    },
    body: {
      type: String,
      default: null,
    },
    published: {
      type: Boolean,
      default: true,
    },
    profileId: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    userId: {
      type: Number,
      ref: "User",
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    lowQualityImageURLs: {
      type: [String],
      required: false,
    },
    mediumQualityImageURLs: {
      type: [String],
      required: false,
    },
    imageInfoIds: {
      type: [String],
      default: null,
    },
  },
  baseOptions,
);

const Post = mongoose.model("Post", PostSchema);

const ActivityPostSchema = new Schema({
  activityDetails: {
    type: String,
    required: true,
  },
  mentions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Profile",
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "PostLike",
    },
  ],
});

const RequirementPostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
});

const MomentPostSchema = new Schema({
  momentDetails: {
    type: String,
    required: true,
  },
});

const ActivityPost = Post.discriminator("ActivityPost", ActivityPostSchema);
const RequirementPost = Post.discriminator(
  "RequirementPost",
  RequirementPostSchema,
);
const MomentPost = Post.discriminator("MomentPost", MomentPostSchema);

export { Post, ActivityPost, RequirementPost, MomentPost };
