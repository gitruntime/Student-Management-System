const express = require("express");
/**
 * Control Class related endpoints
 */
const router = express.Router();

const { authMiddleware, validate } = require("../../middlewares");
const { AccountController } = require("../../controllers/students");

router.get("/", authMiddleware, AccountController.ViewProfileData);

module.exports = router;
