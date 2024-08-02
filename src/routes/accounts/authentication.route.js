const express = require("express");
const router = express.Router();

const authController = require("../../controllers/accounts/auth.controller");
const validate = require("../../middlewares/validation.middleware");
const { loginSchema } = require("../../utils/validators/auth.validator");

// Auth API's
router.post("/login", validate(loginSchema), authController.login);

module.exports = router;
