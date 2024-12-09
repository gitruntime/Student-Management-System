const express = require("express");
/**
 * Control subject related endpoints
 */
const router = express.Router();
const { authMiddleware, isAdmin, validate } = require("../../../middlewares");
const { classController } = require("../../../controllers/admin/v2");

router.get("/", authMiddleware, isAdmin, classController.subjectList);
router.post("/", authMiddleware, isAdmin, classController.subjectCreate);
router.put("/:id", authMiddleware, isAdmin, classController.subjectUpdate);
router.delete("/:id", authMiddleware, isAdmin, classController.subjectDelete);

module.exports = router;
