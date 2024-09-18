const express = require("express");
/**
 * this is the base admin router controls every other admin router actions
 */
const router = express.Router();

const tenantRouter = require("./tenant.route");
const tenantUserRouter = require("./tenantUser.route");
const authorizationRouter = require("./authorization.route");

router.use("/", authorizationRouter);
router.use("/tenants", tenantRouter);
router.use("/users", tenantUserRouter);

module.exports = router;
