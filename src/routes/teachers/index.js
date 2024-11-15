const express = require("express");
/**
 * this is the base admin router controls every other admin router actions
 */
const router = express.Router();

const accountRouter = require("./account.routes")
const studentRouter = require("./student.route")

router.use("/", accountRouter);
router.use("/students",studentRouter)

module.exports = router;
