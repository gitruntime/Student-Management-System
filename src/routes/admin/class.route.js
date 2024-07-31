const express = require("express");
/**
 * Control class related endpoints
 */
const router = express.Router();
const classController = require("../../controllers/admin/class.controller");
const {
  authMiddleware,
} = require("../../middlewares/authentication.middleware");
const { isAdmin } = require("../../middlewares/authorization.middleware");

router.get("/", authMiddleware, isAdmin, classController.classList);
router.post("/", authMiddleware, isAdmin, classController.classCreate);
router.get("/:id", authMiddleware, isAdmin, classController.classView);
router.put("/:id", authMiddleware, isAdmin, classController.classUpdate);
router.delete("/:id", authMiddleware, isAdmin, classController.classDelete);

module.exports = router;
