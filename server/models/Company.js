// server/models/Company.js
import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // 1 kompani për çdo owner
    },
    logoUrl: { type: String, default: "" },
    city: { type: String, default: "" },
    country: { type: String, default: "" },
    industry: { type: String, default: "" },
    size: { type: String, default: "" }, // p.sh. "11-50", "50-200"
    website: { type: String, default: "" },
    description: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    isHiring: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);

export default Company;
