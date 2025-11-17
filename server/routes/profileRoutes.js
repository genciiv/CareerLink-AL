// server/routes/profileRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMyProfile,
  updateMyProfile,
  addExperience,
  deleteExperience,
  addProject,
  deleteProject,
} from "../controllers/profileController.js";

const router = express.Router();

// /api/profile/me
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);

// /api/profile/experience
router.post("/experience", protect, addExperience);
router.delete("/experience/:id", protect, deleteExperience);

// /api/profile/project
router.post("/project", protect, addProject);
router.delete("/project/:id", protect, deleteProject);

export default router;
