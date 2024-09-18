const express = require("express");
const { authMiddleware, validate } = require("../../middlewares");
const { tenantUserController } = require("../../controllers/superadmin");
const {
  tenantUserCreateSchema,
  tenantUserUpdateSchema,
} = require("../../utils/validators/superadmin/tenant.validator");

/**
 * Controls Tenant related routes
 */
const router = express.Router();

router.get("/", authMiddleware, tenantUserController.tenantUserList);
router.post(
  "/",
  authMiddleware,
  validate(tenantUserCreateSchema),
  tenantUserController.tenantUserCreate,
);
router.get("/:id", authMiddleware, tenantUserController.tenantUserView);
router.put(
  "/:id",
  authMiddleware,
  validate(tenantUserUpdateSchema),
  tenantUserController.tenantUserUpdate,
);
router.delete("/:id", authMiddleware, tenantUserController.tenantUserDelete);

module.exports = router;
