const express = require("express");
const router = express.Router();

const authController = require("../../controllers/accounts/auth.controller");
const validator = require("../../utils/validators/validator");
const authValidator = require("../../utils/validators/auth.validator");

// Auth API's
router.post(
  "/login",
  validator(authValidator.loginValidator),
  authController.login,
);

module.exports = router;
