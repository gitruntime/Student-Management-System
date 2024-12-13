const express = require("express");
const { ClassController } = require("../../controllers/students");
const { authMiddleware } = require("../../middlewares");
/**
 * Control Class related endpoints
 */
const router = express.Router();

router.get("/teachers", authMiddleware, ClassController.TeacherList);
router.get("/classmates", authMiddleware, ClassController.ClassmatesList);
router.get("/attendances", authMiddleware, ClassController.AttendanceList);
router.get("/marks", authMiddleware, ClassController.MarksList);

module.exports = router;
