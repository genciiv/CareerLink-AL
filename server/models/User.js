// server/models/User.js
import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    period: { type: String, default: "" }, // p.sh. "2023 - Vazhdon"
    location: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    link: { type: String, default: "" },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["candidate", "employer", "admin"],
      default: "candidate",
    },

    // Profile fields
    headline: { type: String, default: "" }, // p.sh. "Full Stack Developer"
    location: { type: String, default: "" },
    bio: { type: String, default: "" },

    skills: {
      type: [String],
      default: [],
    },

    experiences: {
      type: [experienceSchema],
      default: [],
    },

    projects: {
      type: [projectSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
