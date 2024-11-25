const express = require("express");
/**
 * Controls student related endpoints
 */
const router = express.Router();
const studentController = require("../../controllers/admin/student.controller");
const { authMiddleware, isAdmin, validate } = require("../../middlewares");
const AdminValidator = require("../../utils/validators/admin");
const {
  CreateMarksSchema,
} = require("../../utils/validators/admin/student.validator");

// Account and Student model CRUD
router.get("/", authMiddleware, isAdmin, studentController.studentList);
router.post(
  "/",
  authMiddleware,
  isAdmin,
  validate(AdminValidator.studentPOSTSchema),
  studentController.studentCreate
);
router.get("/:id", authMiddleware, isAdmin, studentController.studentView);
router.put("/:id", authMiddleware, isAdmin, studentController.studentUpdate);
router.delete("/:id", authMiddleware, isAdmin, studentController.studentDelete);
router.get(
  "/:id/interests",
  authMiddleware,
  isAdmin,
  studentController.InterestList
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
  validate(AdminValidator.AttendancesSchema),
  studentController.attendanceCreate
);
router.put(
  "/:studentId/attendances/:id",
  authMiddleware,
  isAdmin,
  validate(AdminValidator.AttendancesSchema),
  studentController.attendanceUpdate
);
router.delete(
  "/:studentId/attendances/:id",
  authMiddleware,
  isAdmin,
  studentController.attendanceDelete
);

router.get("/:id/ai", authMiddleware, isAdmin, studentController.aiDashboard);

router.get(
  "/:id/addresses",
  authMiddleware,
  isAdmin,
  studentController.addressList
);
router.get("/:id/marks", authMiddleware, isAdmin, studentController.ListMarks);
router.post(
  "/:id/marks",
  authMiddleware,
  validate(CreateMarksSchema),
  isAdmin,
  studentController.CreateMarks
);
// router.post("/", authMiddleware, isAdmin, studentController.studentCreate);
// router.get("/:id", authMiddleware, isAdmin, studentController.studentView);
// router.put("/:id", authMiddleware, isAdmin, studentController.studentUpdate);
// router.delete("/:id", authMiddleware, isAdmin, studentController.studentDelete);

module.exports = router;
