const express = require("express");
/**
 * Controls Teacher related routes
 */
const router = express.Router();
const { studentController } = require("../../controllers/teachers");
const { authMiddleware, validate } = require("../../middlewares");
const {
  studentPOSTSchema,
} = require("../../utils/validators/teacher/student.validator");

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

module.exports = router;
