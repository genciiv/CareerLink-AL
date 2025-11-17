// server/routes/postRoutes.js
import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  getFeed,
  createPost,
  toggleLike,
  addComment,
  deleteComment,
  deletePost,
} from "../controllers/postController.js";

const router = express.Router();

// Feed publik (leximi)
router.get("/", getFeed);
router.get("/:id", getFeed); // opcionale nëse do single, për thjeshtësi po përdorim vetëm /

// Veprime që kërkojnë login
router.post("/", requireAuth, createPost);
router.post("/:id/like", requireAuth, toggleLike);
router.post("/:id/comments", requireAuth, addComment);
router.delete("/:postId/comments/:commentId", requireAuth, deleteComment);
router.delete("/:id", requireAuth, deletePost);

export default router;
