const express = require("express");
/**
 * Controls parent related endpoints
 */
const router = express.Router();
const parentController = require("../../controllers/admin/parent.controller");
const {
  authMiddleware,
} = require("../../middlewares/authentication.middleware");
const { isAdmin } = require("../../middlewares/authorization.middleware");

router.get("/", authMiddleware, isAdmin, parentController.parentList);
router.post("/", authMiddleware, isAdmin, parentController.parentCreate);
router.get("/:id", authMiddleware, isAdmin, parentController.parentView);
router.put("/:id", authMiddleware, isAdmin, parentController.parentUpdate);
router.delete("/:id", authMiddleware, isAdmin, parentController.parentDelete);

module.exports = router;
