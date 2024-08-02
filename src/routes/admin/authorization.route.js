const express = require("express");
/**
 * Controls Permission related endpoints
 */
const router = express.Router();
const permissionController = require("../../controllers/admin/authorization.controller");
const {
  authMiddleware,
} = require("../../middlewares/authentication.middleware");
const { isAdmin } = require("../../middlewares/authorization.middleware");
const validate = require("../../middlewares/validation.middleware");
const {
  permissionSchema,
} = require("../../utils/validators/authorization.validator");

router.get("/", authMiddleware, isAdmin, permissionController.permissionList);
router.post(
  "/",
  authMiddleware,
  isAdmin,
  validate(permissionSchema),
  permissionController.permissionCreate,
);
router.get(
  "/:id",
  authMiddleware,
  isAdmin,
  permissionController.permissionView,
);
router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  validate(permissionSchema),
  permissionController.permissionUpdate,
);
router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  permissionController.permissionDelete,
);

module.exports = router;
