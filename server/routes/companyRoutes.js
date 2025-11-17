// server/routes/companyRoutes.js
import express from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import {
  listCompanies,
  getCompanyById,
  getMyCompany,
  upsertMyCompany,
} from "../controllers/companyController.js";

const router = express.Router();

// publike
router.get("/", listCompanies);
router.get("/:id", getCompanyById);

// vetem employer i loguar
router.get("/me/profile", requireAuth, requireRole("employer"), getMyCompany);
router.post("/me/profile", requireAuth, requireRole("employer"), upsertMyCompany);

export default router;
