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
router.get("/assignments", authMiddleware, classController.AssignmentList);
router.post(
  "/assignments",
  authMiddleware,
  validate(AssignmentSchema),
  classController.AssignmentCreate
);

module.exports = router;
