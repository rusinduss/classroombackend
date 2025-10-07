import express from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { enrollCourse, getMyEnrollments, getCourseStudents } from "../controllers/enrollmentController.js";

const router = express.Router();

// Student enroll
router.post("/courses/:id/enroll", protect, requireRole("student"), enrollCourse);

// Student view own enrollments
router.get("/me", protect, requireRole("student"), getMyEnrollments);

// Instructor/Admin view students of a course
router.get("/courses/:id/students", protect, requireRole("instructor", "admin"), getCourseStudents);

export default router;
