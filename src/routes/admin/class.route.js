const express = require("express");
/**
 * Control Class related endpoints
 */
const router = express.Router();
const classController = require("../../controllers/admin/class.controller");

const { authMiddleware, isAdmin, validate } = require("../../middlewares");
const { classSchema } = require("../../utils/validators/admin");
const {
  classSubjectsSchema,
  addTeachersToClassSchema,
  addStudentsToClassSchema,
} = require("../../utils/validators/admin/class.validator");

router.get("/", authMiddleware, isAdmin, classController.classList);
router.post(
  "/",
  authMiddleware,
  isAdmin,
  validate(classSchema),
  classController.classCreate
);
router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  validate(classSchema),
  classController.classUpdate
);
router.delete("/:id", authMiddleware, isAdmin, classController.classDelete);

router.get(
  "/:id/subjects",
  authMiddleware,
  isAdmin,
  classController.getSubjectsFromClass
);
router.get(
  "/:id/subjectsData",
  authMiddleware,
  isAdmin,
  classController.getSubjectDataUsingClass
);
router.post(
  "/:id/subjects",
  authMiddleware,
  isAdmin,
  validate(classSubjectsSchema),
  classController.addSubjectstoClass
);
router.get(
  "/:id/teachers",
  authMiddleware,
  isAdmin,
  classController.getTeachersFromClass
);
router.post(
  "/:id/teachers",
  authMiddleware,
  isAdmin,
  validate(addTeachersToClassSchema),
  classController.addTeacherstoClass
);
router.get(
  "/:id/students",
  authMiddleware,
  isAdmin,
  classController.fetchClassStudents
);
router.post(
  "/:id/students",
  authMiddleware,
  isAdmin,
  validate(addStudentsToClassSchema),
  classController.addStudentToClass
);
router.delete(
  "/:classId/teachers/:id",
  authMiddleware,
  isAdmin,
  classController.removeTeacherFromClass
);

module.exports = router;
