require("dotenv").config();
const env = process.env;
const { Sequelize } = require("sequelize");
const logger = require("../../logger");

const db = new Sequelize(env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging:console.log
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
