import mongoose from "mongoose";
const { Schema } = mongoose;

const NotificationSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the current date and time when the notification is created
  },
  followerId: {
    type: Number, // Assuming followerId is an integer from your SQL DB
    default: null,
  },
  followingId: {
    type: Number, // Assuming followingId is an integer from your SQL DB
    default: null,
  },
  commentId: {
    type: Number, // Assuming commentId is an integer from your SQL DB
    default: null,
  },
  postLikeId: {
    type: Number, // Assuming postLikeId is an integer from your SQL DB
    default: null,
  },
  commentLikeId: {
    type: Number, // Assuming commentLikeId is an integer from your SQL DB
    default: null,
  },
  postId: {
    type: Number, // Assuming postId is an integer from your SQL DB
    default: null,
  },
  notifiedProfileId: {
    type: Number, // Reference to the profile that is being notified
    required: true,
  },
  profileId: {
    type: Number, // Reference to the profile that triggered the notification
    required: true,
  },
  // Relations (associating to other models)
  newFollow: {
    type: Schema.Types.ObjectId,
    ref: "Follow",
    default: null,
  },
  newComment: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  newPostLike: {
    type: Schema.Types.ObjectId,
    ref: "PostLike",
    default: null,
  },
  newCommentLike: {
    type: Schema.Types.ObjectId,
    ref: "CommentLike",
    default: null,
  },
  newPostShare: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    default: null,
  },
  notifiedProfile: {
    type: Schema.Types.ObjectId,
    ref: "Profile", // Reference to the Profile model of the user being notified
    required: true,
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: "Profile", // Reference to the Profile model of the user who triggered the notification
    required: true,
  },
});

export default mongoose.model("Notification", NotificationSchema);
