const express = require("express");
const { authMiddleware, validate } = require("../../middlewares");
const { tenantController } = require("../../controllers/superadmin");
const {
  tenantSchema,
} = require("../../utils/validators/superadmin/tenant.validator");
/**
 * Controls Tenant related routes
 */
const router = express.Router();

router.get("/", authMiddleware, tenantController.tenantList);
router.post(
  "/",
  authMiddleware,
  validate(tenantSchema),
  tenantController.tenantCreate,
);
router.get("/:id", authMiddleware, tenantController.tenantView);
router.put(
  "/:id",
  authMiddleware,
  validate(tenantSchema),
  tenantController.tenantUpdate,
);
router.delete("/:id", authMiddleware, tenantController.tenantDelete);

module.exports = router;
