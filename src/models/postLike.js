import mongoose from "mongoose";
const { Schema } = mongoose;

const PostLikeSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  userId: {
    type: Number,
    ref: "User",
    required: true,
  },
  profileId: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PostLike = mongoose.model("PostLike", PostLikeSchema);
export default PostLike;
