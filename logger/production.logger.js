const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;

const prodFormat = printf(({ level, message, timestamp }) => {
  return `[${level.toUpperCase()}] ${timestamp}  ${message}`;
});

const productionLogger = () => {
  return createLogger({
    level: "info",
    format: combine(timestamp(), prodFormat),
    transports: [
      new transports.Console(),
      new transports.File({ filename: "logs/application.log" }),
    ],
  });
};

module.exports = productionLogger;
