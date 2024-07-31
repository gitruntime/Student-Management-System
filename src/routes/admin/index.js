const express = require("express");
/**
 * this is the base admin router controls every other admin router actions
 */
const router = express.Router();
const permissionRouter = require("./authorization.route");
const teacherRouter = require("./teacher.route");
const studentRouter = require("./student.route");
const classRouter = require("./class.route");
const subjectRouter = require("./subject.route");
const parentRouter = require("./parent.route");

router.use("/permissions", permissionRouter);
router.use("/teachers", teacherRouter);
router.use("/students", studentRouter);
router.use("/class", classRouter);
router.use("/subjects", subjectRouter);
router.use("/parents", parentRouter);

module.exports = router;
