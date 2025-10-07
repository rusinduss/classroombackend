import express from "express";
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getCourses);
router.get("/:id", getCourseById);

// Instructor/Admin only
router.post("/", protect, requireRole("instructor", "admin"), createCourse);
router.put("/:id", protect, requireRole("instructor", "admin"), updateCourse);
router.delete("/:id", protect, requireRole("instructor", "admin"), deleteCourse);

export default router;
