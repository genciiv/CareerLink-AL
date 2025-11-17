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
  getMyJobs,
  getJobApplicants,
  updateApplicationStatus,
  getMyApplications,
} from "../controllers/jobController.js";

const router = express.Router();

// --- Publike ---
router.get("/", listJobs);

// Rrugë të mbrojtura – DUHET të jenë PARA "/:id"
router.get("/my", requireAuth, requireRole("employer"), getMyJobs);
router.get(
  "/my-applications",
  requireAuth,
  getMyApplications // çdo user i loguar
);

// GET /api/jobs/:id – pas rrugëve të mësipërme që kanë prefix
router.get("/:id", getJobById);

// Vetëm employer (krijim, update, delete, applicants, status)
router.post("/", requireAuth, requireRole("employer"), createJob);
router.put("/:id", requireAuth, requireRole("employer"), updateJob);
router.delete("/:id", requireAuth, requireRole("employer"), deleteJob);
router.get(
  "/:id/applicants",
  requireAuth,
  requireRole("employer"),
  getJobApplicants
);
router.patch(
  "/:jobId/applicants/:applicantId/status",
  requireAuth,
  requireRole("employer"),
  updateApplicationStatus
);

// Aplikimi nga candidate
router.post("/:id/apply", requireAuth, applyToJob);

export default router;
