const express = require("express");
/**
 * Controls parent related endpoints
 */
const router = express.Router();
const { authMiddleware, isAdmin } = require("../../../middlewares");
const { parentController } = require("../../../controllers/admin/v2");

router.get("/", authMiddleware, isAdmin, parentController.parentList);
router.post("/", authMiddleware, isAdmin, parentController.parentCreate);
router.get("/:id", authMiddleware, isAdmin, parentController.parentView);
router.put("/:id", authMiddleware, isAdmin, parentController.parentUpdate);
router.delete("/:id", authMiddleware, isAdmin, parentController.parentDelete);

module.exports = router;
