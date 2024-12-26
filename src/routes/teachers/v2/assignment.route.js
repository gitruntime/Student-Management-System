const express = require("express");
// /**
//  * Controls Teacher related routes
//  */
const router = express.Router();
const { classController } = require("../../../controllers/teachers/v2");
const { authMiddleware, validate } = require("../../../middlewares");
const {
  AssignmentSchema,
} = require("../../../utils/validators/teacher/class.validator");

router.get("/", authMiddleware, classController.AssignmentList);
router.post(
  "/",
  authMiddleware,
  validate(AssignmentSchema),
  classController.AssignmentCreate
);
router.put(
  "/:id",
  authMiddleware,
  validate(AssignmentSchema),
  classController.AssignmentUpdate
);
router.delete("/:id", authMiddleware, classController.AssignmentDelete);

module.exports = router;
