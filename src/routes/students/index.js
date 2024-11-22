const express = require("express");
/**
 * this is the base admin router controls every other admin router actions
 */
const router = express.Router();

const AccountRouter = require("./account.route");

// router.use("/permissions", permissionRouter);
router.use("/", AccountRouter);

module.exports = router;
