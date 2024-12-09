const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../../../middlewares");
const { accountController } = require("../../../controllers/admin/v2");

router.get("/dashboard", authMiddleware, isAdmin, accountController.Dashboard);

module.exports = router;
