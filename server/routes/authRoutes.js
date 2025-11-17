// server/routes/authRoutes.js
import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Rrugë të mbrojtura (opsionale)
router.get("/me", requireAuth, (req, res) => {
  res.json({ message: "Je i loguar", userId: req.userId });
});

export default router;
