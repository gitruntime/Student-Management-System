const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin, validate } = require("../../middlewares");
const { accountController } = require("../../controllers/admin");

router.get("/dashboard", authMiddleware, isAdmin, accountController.Dashboard);

module.exports = router;
