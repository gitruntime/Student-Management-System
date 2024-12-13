const express = require("express");
/**
 * Control Class related endpoints
 */
const router = express.Router();

const { authMiddleware, isAdmin, validate } = require("../../../middlewares");
const { classController } = require("../../../controllers/admin/v2");
const {
  classPOSTSchema,
  addTeachersToClassSchema,
} = require("../../../utils/validators/v2/admin/academic.validator");

router.get("/", authMiddleware, isAdmin, classController.classList);
router.post(
  "/",
  authMiddleware,
  isAdmin,
  validate(classPOSTSchema),
  classController.classCreate
);
router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  validate(classPOSTSchema),
  classController.classUpdate
);
router.delete("/:id", authMiddleware, isAdmin, classController.classDelete);

// router.get(
//   "/:id/subjects",
//   authMiddleware,
//   isAdmin,
//   classController.getSubjectsFromClass
// );
// router.get(
//   "/:id/subjectsData",
//   authMiddleware,
//   isAdmin,
//   classController.getSubjectDataUsingClass
// );
// router.post(
//   "/:id/subjects",
//   authMiddleware,
//   isAdmin,
//   classController.addSubjectstoClass
// );
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
router.get(
  "/:id/subjects",
  authMiddleware,
  isAdmin,
  classController.getClassSubjects
);
// router.delete(
//   "/:classId/teachers/:id",
//   authMiddleware,
//   isAdmin,
//   classController.removeTeacherFromClass
// );

module.exports = router;
