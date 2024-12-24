const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize } = format;

const devFormat = printf(({ level, message, timestamp }) => {
  return `[${level}] ${timestamp} ${message}`;
});

const devLogger = () => {
  return createLogger({
    level: "debug",
    format: combine(colorize(), timestamp({ format: "HH:mm:ss" }), devFormat),
    transports: [new transports.Console()],
  });
};

module.exports = devLogger;
