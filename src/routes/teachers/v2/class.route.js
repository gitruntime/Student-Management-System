const express = require("express");
/**
 * Controls Teacher related routes
 */
const router = express.Router();
const { classController } = require("../../controllers/teachers");
const { authMiddleware, validate } = require("../../middlewares");
const {
  AssignmentSchema,
} = require("../../utils/validators/teacher/class.validator");

router.get("/", authMiddleware, classController.classList);
router

// router.get("/assignments", authMiddleware, classController.AssignmentList);
// router.post(
//   "/assignments",
//   authMiddleware,
//   validate(AssignmentSchema),
//   classController.AssignmentCreate
// );
// router.put(
//   "/assignments/:id",
//   authMiddleware,
//   validate(AssignmentSchema),
//   classController.AssignmentUpdate
// );
// router.delete(
//   "/assignments/:id",
//   authMiddleware,
//   classController.AssignmentDelete
// );
// <======================================== Exam Managment ===============================================================>
// router.get("/exams", authMiddleware, classController.ExamList);
// router.post("/exams", authMiddleware, classController.ExamCreate);
// router.put(
//   "/exams/:id",
//   authMiddleware,
//   validate(AssignmentSchema),
//   classController.ExamUpdate
// );
// router.delete(
//   "/exams/:id",
//   authMiddleware,
//   validate(AssignmentSchema),
//   classController.ExamUpdate
// );

module.exports = router;
