const express = require("express");
/**
 * Controls Teacher related routes
 */
const router = express.Router();
const { studentController } = require("../../controllers/teachers");
const { authMiddleware, validate } = require("../../middlewares");
const {
  studentPOSTSchema,
  AttendancePOSTSchema,
} = require("../../utils/validators/teacher/student.validator");
const { attendanceSchema } = require("../../utils/validators/common.validator");

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

router.get(
  "/:studentId/attendances",
  authMiddleware,
  studentController.AttendanceList
);
router.post(
  "/:studentId/attendances",
  authMiddleware,
  validate(AttendancePOSTSchema),
  studentController.AttendanceCreate
);
router.put(
  "/:studentId/attendances/:id",
  authMiddleware,
  validate(AttendancePOSTSchema),
  studentController.AttendanceUpdate
);
router.delete(
  "/:studentId/attendances/:id",
  authMiddleware,
  studentController.AttendanceDelete
);

module.exports = router;
