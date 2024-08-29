const express = require("express");
/**
 * Control subject related endpoints
 */
const router = express.Router();
const classController = require("../../controllers/admin/class.controller");
const { authMiddleware, isAdmin, validate } = require("../../middlewares");
const { subjectSchema } = require("../../utils/validators/admin");

router.get("/", authMiddleware, isAdmin, classController.subjectList);
router.post(
  "/",
  authMiddleware,
  isAdmin,
  validate(subjectSchema),
  classController.subjectCreate,
);
router.get("/:id", authMiddleware, isAdmin, classController.subjectView);
router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  validate(subjectSchema),
  classController.subjectUpdate,
);
router.delete("/:id", authMiddleware, isAdmin, classController.subjectDelete);

module.exports = router;
