import express from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { getRecommendations } from "../controllers/gptController.js";

const router = express.Router();

// Students request GPT recommendations
router.post("/recommendations", protect, requireRole("student"), getRecommendations);

export default router;
