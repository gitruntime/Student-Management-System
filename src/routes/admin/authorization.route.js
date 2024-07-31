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

router.get("/", authMiddleware, isAdmin, permissionController.permissionList);
router.post(
  "/",
  authMiddleware,
  isAdmin,
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
  permissionController.permissionUpdate,
);
router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  permissionController.permissionDelete,
);

module.exports = router;
