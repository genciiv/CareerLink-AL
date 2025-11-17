// server/models/User.js
import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },        // p.sh. Frontend Developer
    company: { type: String, required: true },      // p.sh. CareerLink AL
    location: { type: String },
    startDate: { type: String },                    // mund t'i mbajmë si string p.sh. "Jan 2023"
    endDate: { type: String },
    current: { type: Boolean, default: false },
    description: { type: String },
  },
  { _id: true } // kemi nevojë për id të experience
);

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },         // p.sh. EcoLens Platform
    link: { type: String },                         // p.sh. https://...
    description: { type: String },
    from: { type: String },
    to: { type: String },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["candidate", "employer", "admin"],
      default: "candidate",
    },

    // 🔹 Fusha bazë të profilit
    headline: { type: String, default: "" },        // p.sh. "Junior Web Developer"
    location: { type: String, default: "" },        // p.sh. "Fier, Shqipëri"
    bio: { type: String, default: "" },

    // 🔹 Skills si array strings
    skills: { type: [String], default: [] },

    // 🔹 Experience & Projects si sub-dokumente
    experiences: { type: [experienceSchema], default: [] },
    projects: { type: [projectSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
