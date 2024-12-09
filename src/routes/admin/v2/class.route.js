const express = require("express");
/**
 * Control Class related endpoints
 */
const router = express.Router();

const { authMiddleware, isAdmin, validate } = require("../../../middlewares");
const { classController } = require("../../../controllers/admin/v2");

router.get("/", authMiddleware, isAdmin, classController.classList);
router.post("/", authMiddleware, isAdmin, classController.classCreate);
router.put("/:id", authMiddleware, isAdmin, classController.classUpdate);
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
  classController.addStudentToClass
);
router.delete(
  "/:classId/teachers/:id",
  authMiddleware,
  isAdmin,
  classController.removeTeacherFromClass
);

module.exports = router;
