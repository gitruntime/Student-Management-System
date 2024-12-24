const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin, validate } = require("../../../middlewares");
const { accountController } = require("../../../controllers/admin/v2");
const {
  onboardSchema,
} = require("../../../utils/validators/v2/admin/account.validator");

router.get(
  "/dashboard/overview",
  authMiddleware,
  isAdmin,
  accountController.DashboardOverview
);
router.put(
  "/profile/onboard",
  authMiddleware,
  isAdmin,
  validate(onboardSchema),
  accountController.OnboardProfile
);
router.get("/profile", authMiddleware, isAdmin, accountController.Profile);

module.exports = router;
