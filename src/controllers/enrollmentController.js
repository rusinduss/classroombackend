import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

// Student enrolls in a course
export const enrollCourse = async (req, res) => {
  try {
    const { id } = req.params; // courseId
    const course = await Course.findById(id);

    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check if already enrolled
    const existing = await Enrollment.findOne({ user: req.user._id, course: id });
    if (existing) return res.status(400).json({ message: "Already enrolled" });

    const enrollment = await Enrollment.create({
      user: req.user._id,
      course: id,
    });

    // Update student count (optional denormalization)
    course.studentsCount += 1;
    await course.save();

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: "Error enrolling", error: error.message });
  }
};

// Get current user's enrollments
export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate("course", "title description instructor")
      .populate("user", "name email");

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enrollments", error: error.message });
  }
};

// Instructor gets students enrolled in their course
export const getCourseStudents = async (req, res) => {
  try {
    const { id } = req.params; // courseId
    const course = await Course.findById(id);

    if (!course) return res.status(404).json({ message: "Course not found" });

    // Ownership check
    if (req.user.role !== "admin" && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: not course owner" });
    }

    const students = await Enrollment.find({ course: id })
      .populate("user", "name email role")
      .select("user status progress createdAt");

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error: error.message });
  }
};
