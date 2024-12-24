const { errorHandler } = require("./error");
const { Response } = require("./response");
const { tryCatch } = require("./tryCatch");
const { urlNotFound } = require("./urlNotFound");

/**
 * Calculate total pages for pagination.
 *
 * @param {number} totalCount
 * @param {number} limit
 * @returns {number}
 */
function calculateTotalPages(totalCount, limit) {
  return Math.ceil(totalCount / limit);
}

module.exports = {
  errorHandler,
  Response,
  tryCatch,
  urlNotFound,
  calculateTotalPages
};
