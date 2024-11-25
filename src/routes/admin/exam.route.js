const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin, validate } = require("../../middlewares");
const { examController } = require("../../controllers/admin");
const { examSchema } = require("../../utils/validators/admin/exam.validator");

router.get("/", authMiddleware, isAdmin, examController.examList);

router.post(
  "/",
  authMiddleware,
  validate(examSchema),
  isAdmin,
  examController.examCreate
);

router.put(
  "/:id",
  authMiddleware,
  validate(examSchema),
  isAdmin,
  examController.examUpdate
);

router.delete("/:id", authMiddleware, isAdmin, examController.examDelete);

module.exports = router;
