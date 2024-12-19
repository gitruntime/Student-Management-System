const express = require("express");
/**
 * this is the base admin router controls every other admin router actions
 */
const router = express.Router();

const accountRouter = require("./v2/account.routes");
const studentRouter = require("./v2/student.route");
const classRoute = require("./v2/class.route");

// router.use("/", accountRouter);
router.use("/students", studentRouter);
// router.use("/classes", classRoute);

module.exports = router;
