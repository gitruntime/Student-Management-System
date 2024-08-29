const express = require("express");
const router = express.Router();

const authController = require("../../controllers/accounts/auth.controller");
const validate = require("../../middlewares/validation.middleware");
const { loginSchema, tokenSchema } = require("../../utils/validators/account");

// Auth API's
router.post("/login", validate(loginSchema), authController.login);
router.post("/token/refresh", validate(tokenSchema), authController.refresh);

module.exports = router;
