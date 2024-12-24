const logger = require("../../../logger");
/**
 * Here we handle try and catch
 * if any exception raised we will store it in logs if the NODE_ENV is in production
 * @param {Function} fn
 *
 * @returns {Function}
 *
 * @throws {Error} Passes any caught errors to the next error-handling middleware.
 */
const tryCatch = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    console.log(error);
    logger.error(error);
    next(error);
  });
};

module.exports = { tryCatch };
