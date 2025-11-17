// server/routes/jobRoutes.js
import express from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import {
  listJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  applyToJob,
} from "../controllers/jobController.js";

const router = express.Router();

// publike
router.get("/", listJobs);
router.get("/:id", getJobById);

// vetem employer
router.post("/", requireAuth, requireRole("employer"), createJob);
router.put("/:id", requireAuth, requireRole("employer"), updateJob);
router.delete("/:id", requireAuth, requireRole("employer"), deleteJob);

// aplikim per punë (cdo user i loguar)
router.post("/:id/apply", requireAuth, applyToJob);

export default router;
