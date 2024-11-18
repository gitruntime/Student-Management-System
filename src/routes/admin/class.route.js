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
router.post(
  "/:id/subjects",
  authMiddleware,
  isAdmin,
  validate(classSubjectsSchema),
  classController.addSubjectstoClass
);

module.exports = router;
