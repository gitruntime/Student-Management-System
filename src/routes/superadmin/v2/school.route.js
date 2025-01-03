const express = require("express");
const { authMiddleware, validate } = require("../../../middlewares");
const { schoolController } = require("../../../controllers/superadmin/v2");
const {
  SchoolsPOSTSchema,
} = require("../../../utils/validators/superadmin/school.validator");
/**
 * Controls Tenant related routes
 */
const router = express.Router();

router.get("/", authMiddleware, schoolController.SchoolList);
router.post(
  "/",
  authMiddleware,
  validate(SchoolsPOSTSchema),
  schoolController.SchoolCreate
);
router.get("/:id", authMiddleware, schoolController.SchoolView);
router.put(
  "/:id",
  authMiddleware,
  validate(SchoolsPOSTSchema),
  schoolController.SchoolUpdate
);

router.get("/:id/teachers", authMiddleware, schoolController.TeacherList);
router.get("/:id/students", authMiddleware, schoolController.StudentList);

module.exports = router;
