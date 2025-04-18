import mongoose from "mongoose";
const { Schema } = mongoose;

const CommentSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the current date and time when the comment is created
  },
  body: {
    type: String,
    required: true, // The content of the comment is required
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post", // Reference to the Post model to link the comment to a specific post
    required: true, // Each comment must be associated with a post
  },
  profileId: {
    type: Schema.Types.ObjectId,
    ref: "Profile", // Reference to the Profile model to associate the comment with the profile of the user who made the comment
    required: true, // Each comment must be made by a user profile
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "CommentLike", // References the likes associated with this comment
    },
  ],
  notifications: [
    {
      type: Schema.Types.ObjectId,
      ref: "Notification", // Notifications related to this comment (e.g., when someone replies to or likes the comment)
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically updates when the comment is modified
  },
});

const Comment = mongoose.model("Comment", CommentSchema);

export { Comment };
