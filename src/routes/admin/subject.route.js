const express = require("express");
/**
 * Control subject related endpoints
 */
const router = express.Router();
const classController = require("../../controllers/admin/class.controller");
const {
  authMiddleware,
} = require("../../middlewares/authentication.middleware");
const { isAdmin } = require("../../middlewares/authorization.middleware");

router.get("/", authMiddleware, isAdmin, classController.subjectList);
router.post("/", authMiddleware, isAdmin, classController.subjectCreate);
router.get("/:id", authMiddleware, isAdmin, classController.subjectView);
router.put("/:id", authMiddleware, isAdmin, classController.subjectUpdate);
router.delete("/:id", authMiddleware, isAdmin, classController.subjectDelete);

module.exports = router;
