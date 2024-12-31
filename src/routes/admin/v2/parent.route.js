const express = require("express");
/**
 * Controls parent related endpoints
 */
const router = express.Router();
const { authMiddleware, isAdmin, validate } = require("../../../middlewares");
const { parentController } = require("../../../controllers/admin/v2");
const {
  parentPOSTSchema,
} = require("../../../utils/validators/v2/admin/parent.validator");

router.get("/", authMiddleware, isAdmin, parentController.parentList);
router.post(
  "/",
  authMiddleware,
  isAdmin,
  validate(parentPOSTSchema),
  parentController.parentCreate
);
router.get("/:id", authMiddleware, isAdmin, parentController.parentView);
router.put(
  "/:id",
  authMiddleware,
  validate(parentPOSTSchema),
  isAdmin,
  parentController.parentUpdate
);
router.delete("/:id", authMiddleware, isAdmin, parentController.parentDelete);

module.exports = router;
