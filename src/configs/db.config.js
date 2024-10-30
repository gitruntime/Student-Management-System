require("dotenv").config();
const env = process.env;
const { Sequelize } = require("sequelize");
const logger = require("../../logger");
const productionLogger = require("../../logger/production.logger");

const db = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  dialect: env.DB_DIALECT,
  logging: productionLogger,
});

const dbConnect = () => {
  db.authenticate()
    .then(() => {
      logger.info("Connection has been established successfully.");
    })
    .catch((err) => {
      logger.error("Unable to connect to the database:", err);
    });
};

module.exports = {
  db,
  dbConnect,
};
