const express = require("express");
/**
 * this is the base admin router controls every other admin router actions
 */
const router = express.Router();

const accountRouter = require("./account.routes");
const studentRouter = require("./student.route");
const classRoute = require("./class.route");
const assignmentRoute = require("./assignment.route");
const examRoute = require("./exam.route");

router.use("/account", accountRouter);
router.use("/students", studentRouter);
router.use("/classes", classRoute);
router.use("/assignments", assignmentRoute);
router.use("/exams", examRoute);

module.exports = router;
