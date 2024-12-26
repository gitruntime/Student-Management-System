const express = require("express");
const { ClassController } = require("../../../controllers/students/v2");
const { authMiddleware } = require("../../../middlewares");
/**
 * Control Class related endpoints
 */
const router = express.Router();

router.get("/teachers", authMiddleware, ClassController.TeacherList);
router.get("/classmates", authMiddleware, ClassController.ClassmatesList);
router.get("/attendances", authMiddleware, ClassController.AttendanceList);
router.get("/marks", authMiddleware, ClassController.MarksList);
router.get("/exams", authMiddleware, ClassController.ExamList);
router.get("/assignments", authMiddleware, ClassController.AssignmentList);

module.exports = router;
