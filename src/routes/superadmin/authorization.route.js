const express = require("express");
const { authMiddleware, validate } = require("../../middlewares");
const { permissionController } = require("../../controllers/superadmin");
const {
  permissionSchema,
} = require("../../utils/validators/superadmin/authorization.validator");
/**
 * Controls Tenant related routes
 */
const router = express.Router();

router.get("/permissions", authMiddleware, permissionController.permissionList);
router.post(
  "/permissions",
  authMiddleware,
  validate(permissionSchema),
  permissionController.permissionCreate,
);
router.get(
  "/permissions/:id",
  authMiddleware,
  permissionController.permissionView,
);
router.put(
  "/permissions/:id",
  authMiddleware,
  validate(permissionSchema),
  permissionController.permissionUpdate,
);
router.delete(
  "/permissions/:id",
  authMiddleware,
  permissionController.permissionDelete,
);
module.exports = router;
