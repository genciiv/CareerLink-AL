// server/routes/profileRoutes.js
import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  getMyProfile,
  updateProfileBasics,
  addSkill,
  removeSkill,
  addExperience,
  deleteExperience,
  addProject,
  deleteProject,
} from "../controllers/profileController.js";

const router = express.Router();

// Të gjitha këto rruge kërkojnë auth
router.use(requireAuth);

router.get("/me", getMyProfile);
router.put("/", updateProfileBasics);

router.post("/skills", addSkill);
router.delete("/skills/:skillName", removeSkill);

router.post("/experiences", addExperience);
router.delete("/experiences/:expId", deleteExperience);

router.post("/projects", addProject);
router.delete("/projects/:projectId", deleteProject);

export default router;
