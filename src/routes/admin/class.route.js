const express = require("express");
/**
 * Control Class related endpoints
 */
const router = express.Router();
const classController = require("../../controllers/admin/class.controller");

const { authMiddleware, isAdmin, validate } = require("../../middlewares");
const { classSchema } = require("../../utils/validators/admin");

router.get("/", authMiddleware, isAdmin, classController.classList);
router.post(
  "/",
  authMiddleware,
  isAdmin,
  validate(classSchema),
  classController.classCreate,
);
router.get("/:id", authMiddleware, isAdmin, classController.classView);
router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  validate(classSchema),
  classController.classUpdate,
);
router.delete("/:id", authMiddleware, isAdmin, classController.classDelete);

module.exports = router;
