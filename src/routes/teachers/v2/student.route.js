const express = require("express");
/**
 * Controls Teacher related routes
 */
const router = express.Router();
const { studentController } = require("../../../controllers/teachers");
const { authMiddleware, validate } = require("../../../middlewares");
const {
  studentPOSTSchema,
  AttendancePOSTSchema,
} = require("../../../utils/validators/teacher/student.validator");
const {
  attendanceSchema,
} = require("../../../utils/validators/common.validator");
const AdminValidator = require("../../../utils/validators/admin");
const {
  CreateMarksSchema,
} = require("../../../utils/validators/admin/student.validator");

router.get("/", authMiddleware, studentController.StudentList);
router.post(
  "/",
  authMiddleware,
  validate(studentPOSTSchema),
  studentController.StudentCreate
);
router.get("/:id", authMiddleware, studentController.StudentView);
router.put(
  "/:id",
  authMiddleware,
  validate(studentPOSTSchema),
  studentController.StudentUpdate
);
router.delete("/:id", authMiddleware, studentController.StudentDelete);

router.get("/:id/interests", authMiddleware, studentController.InterestList);
router.get(
  "/:id/attendances",
  authMiddleware,
  studentController.attendanceList
);
router.post(
  "/:id/attendances",
  authMiddleware,
  validate(AdminValidator.AttendancesSchema),
  studentController.attendanceCreate
);
router.put(
  "/:studentId/attendances/:id",
  authMiddleware,
  validate(AdminValidator.AttendancesSchema),
  studentController.attendanceUpdate
);
router.delete(
  "/:studentId/attendances/:id",
  authMiddleware,
  studentController.attendanceDelete
);

router.get("/:id/ai", authMiddleware, studentController.aiDashboard);

router.get("/:id/addresses", authMiddleware, studentController.addressList);
router.get("/:id/marks", authMiddleware, studentController.ListMarks);
router.post(
  "/:id/marks",
  authMiddleware,
  validate(CreateMarksSchema),
  studentController.CreateMarks
);
router.get(
  "/:id/performances",
  authMiddleware,
  studentController.PerformanceData
);
router.get("/:id/goals", authMiddleware, studentController.GoalList);
router.get("/:id/volunteers", authMiddleware, studentController.VolunteerList);
// router.put("/:id", authMiddleware, isAdmin, studentController.studentUpdate);
// router.delete("/:id", authMiddleware, isAdmin, studentController.studentDelete);

module.exports = router;
