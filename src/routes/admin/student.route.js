const express = require("express");
/**
 * Controls student related endpoints
 */
const router = express.Router();
const studentController = require("../../controllers/admin/student.controller");
const { authMiddleware, isAdmin, validate } = require("../../middlewares");
const AdminValidator = require("../../utils/validators/admin");

// Account and Student model CRUD
router.get("/", authMiddleware, isAdmin, studentController.studentList);
router.post(
  "/",
  authMiddleware,
  isAdmin,
  validate(AdminValidator.studentPOSTSchema),
  studentController.studentCreate,
);
router.get("/:id", authMiddleware, isAdmin, studentController.studentView);
router.put("/:id", authMiddleware, isAdmin, studentController.studentUpdate);
router.delete("/:id", authMiddleware, isAdmin, studentController.studentDelete);

router.get("/:id/ai", authMiddleware, isAdmin, studentController.aiDashboard);

// router.get("/", authMiddleware, isAdmin, studentController.studentList);
// router.post("/", authMiddleware, isAdmin, studentController.studentCreate);
// router.get("/:id", authMiddleware, isAdmin, studentController.studentView);
// router.put("/:id", authMiddleware, isAdmin, studentController.studentUpdate);
// router.delete("/:id", authMiddleware, isAdmin, studentController.studentDelete);

module.exports = router;
