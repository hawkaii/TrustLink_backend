import mongoose from "mongoose";
const { Schema } = mongoose;

const followSchema = new Schema({
  profileId: {
    type: Schema.Types.ObjectId, // Reference to the Profile being followed
    ref: "Profile",
    required: true,
  },
  followerId: {
    type: Schema.Types.ObjectId, // Reference to the Profile who is following
    ref: "Profile",
    required: true,
  },
  notifications: [
    {
      type: Schema.Types.ObjectId,
      ref: "Notification", // Reference to the Notification model for follow notifications
    },
  ],
});

followSchema.index({ profileId: 1, followerId: 1 }, { unique: true });

const Follow = mongoose.model("Follow", followSchema);

export default Follow;
