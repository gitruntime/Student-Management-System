const express = require("express");
const { authMiddleware } = require("../../middlewares");
const { tenantController } = require("../../controllers/superadmin");
/**
 * Controls Tenant related routes
 */
const router = express.Router();

router.get("/", authMiddleware, tenantController.tenantList);
router.post("/", authMiddleware, tenantController.tenantCreate);
router.get("/:id", authMiddleware, tenantController.tenantView);
router.put("/:id", authMiddleware, tenantController.tenantUpdate);
router.delete("/:id", authMiddleware, tenantController.tenantDelete);

module.exports = router;
