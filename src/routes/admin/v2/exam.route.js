const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin, validate } = require("../../../middlewares");
const { examController } = require("../../../controllers/admin/v2");

router.get("/", authMiddleware, isAdmin, examController.examList);

router.post("/", authMiddleware, isAdmin, examController.examCreate);

router.put("/:id", authMiddleware, isAdmin, examController.examUpdate);

router.delete("/:id", authMiddleware, isAdmin, examController.examDelete);

module.exports = router;
