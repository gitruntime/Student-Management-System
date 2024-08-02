/**
 *
 * @param {Object}  data - The data to be included in the body
 * @param {number} statusCode -  The HTTP status code to set for the response.
 * @param {Object} res - The Express.js response object.
 *
 * This Response() class will handle API Response
 */
class Response {
  constructor(data, statusCode, res) {
    this.statusCode = statusCode;
    this.res = res;
    this.data = data;
    this.send();
  }
  send() {
    return this.res.status(this.statusCode).json(this.data);
  }
}
module.exports = {
  Response,
};
