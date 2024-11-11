const express = require("express");
/**
 * this is the base admin router controls every other admin router actions
 */
const router = express.Router();

const accountRouter = require("./account.routes")

router.use("/", accountRouter);

module.exports = router;
