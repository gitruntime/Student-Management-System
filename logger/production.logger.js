const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;

const prodFormat = printf(({ level, message, timestamp }) => {
  return `[${level.toUpperCase()}] ${timestamp}  ${message}`;
});

const productionLogger = () => {
  return createLogger({
    level: "silly",
    format: combine(timestamp(), prodFormat),
    transports: [
      new transports.File({
        filename: "logs/application.log",
        handleExceptions: true,
      }),
      new transports.Console(),
    ],
  });
};

module.exports = productionLogger;
