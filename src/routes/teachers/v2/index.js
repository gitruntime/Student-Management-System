const express = require("express");
/**
 * this is the base admin router controls every other admin router actions
 */
const router = express.Router();

const accountRouter = require("./account.routes");
const studentRouter = require("./student.route");
const classRoute = require("./class.route");

router.use("/account", accountRouter);
router.use("/students", studentRouter);
router.use("/classes", classRoute);

module.exports = router;
