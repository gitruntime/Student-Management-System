require("dotenv").config();
const productionLogger = require("./production.logger");
const devLogger = require("./development.logger");

let logger;

if (process.env.NODE_ENV === "production") {
  logger = productionLogger();
} else {
  logger = devLogger();
}

module.exports = logger;
