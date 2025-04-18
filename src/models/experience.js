import mongoose from "mongoose";

const { Schema } = mongoose;

const experienceSchema = new Schema({
  profileId: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  description: {
    type: String,
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

experienceSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Experience = mongoose.model("Experience", experienceSchema);

export { Experience };
