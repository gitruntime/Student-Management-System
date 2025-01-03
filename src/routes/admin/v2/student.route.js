const express = require("express");
/**
 * Controls student related endpoints
 */
const router = express.Router();
const { studentController } = require("../../../controllers/admin/v2");
const {
  studentPOSTSchema,
  attendancePOSTSchema,
} = require("../../../utils/validators/v2/admin/student.validator");
const { validate, authMiddleware, isAdmin } = require("../../../middlewares");
const {
  CreateMarksSchema,
} = require("../../../utils/validators/admin/student.validator");

// Account and Student model CRUD
router.get("/", authMiddleware, isAdmin, studentController.studentList);
router.post(
  "/",
  authMiddleware,
  isAdmin,
  validate(studentPOSTSchema),
  studentController.studentCreate
);
router.get("/:id", authMiddleware, isAdmin, studentController.StudentView);
router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  validate(studentPOSTSchema),
  studentController.studentUpdate
);
// router.delete("/:id", authMiddleware, isAdmin, studentController.studentDelete);
router.get(
  "/:id/interests",
  authMiddleware,
  isAdmin,
  studentController.interestList
);
router.get(
  "/:id/attendances/graph",
  authMiddleware,
  isAdmin,
  studentController.attendanceGraph
);
router.get(
  "/:id/attendances",
  authMiddleware,
  isAdmin,
  studentController.attendanceList
);
router.post(
  "/:id/attendances",
  authMiddleware,
  isAdmin,
  validate(attendancePOSTSchema),
  studentController.attendanceCreate
);
router.put(
  "/:studentId/attendances/:id",
  authMiddleware,
  isAdmin,
  validate(attendancePOSTSchema),
  studentController.attendanceUpdate
);
router.delete(
  "/:studentId/attendances/:id",
  authMiddleware,
  isAdmin,
  studentController.attendanceDelete
);

router.get(
  "/:id/ai/overview",
  authMiddleware,
  isAdmin,
  studentController.aiOverview
);

router.get(
  "/:id/ai/career",
  authMiddleware,
  isAdmin,
  studentController.aiCareer
);

router.get(
  "/:id/ai/astrological",
  authMiddleware,
  isAdmin,
  studentController.aiAstrological
);

// router.get(
//   "/:id/addresses",
//   authMiddleware,
//   isAdmin,
//   studentController.addressList
// );
router.get("/:id/marks", authMiddleware, isAdmin, studentController.ListMarks);
router.post(
  "/:id/marks",
  authMiddleware,
  isAdmin,
  validate(CreateMarksSchema),
  studentController.CreateMarks
);
// router.get(
//   "/:id/performances",
//   authMiddleware,
//   isAdmin,
//   studentController.PerformanceData
// );
router.get("/:id/goals", authMiddleware, isAdmin, studentController.GoalList);
// router.get(
//   "/:id/volunteers",
//   authMiddleware,
//   isAdmin,
//   studentController.VolunteerList
// );
// router.put("/:id", authMiddleware, isAdmin, studentController.studentUpdate);
// router.delete("/:id", authMiddleware, isAdmin, studentController.studentDelete);

module.exports = router;
