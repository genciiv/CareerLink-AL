// server/models/Job.js
import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    coverLetter: { type: String, default: "" },
    status: {
      type: String,
      enum: ["applied", "reviewed", "accepted", "rejected"],
      default: "applied",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    companyName: { type: String, required: true },
    location: { type: String, default: "" },
    city: { type: String, default: "" },

    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract", "Other"],
      default: "Full-time",
    },

    mode: {
      type: String,
      enum: ["On-site", "Remote", "Hybrid"],
      default: "On-site",
    },

    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    salaryCurrency: { type: String, default: "€" },

    description: { type: String, default: "" },
    requirements: { type: [String], default: [] },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },

    applicants: { type: [applicantSchema], default: [] },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
