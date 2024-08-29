require("dotenv").config();
const {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
} = require("sequelize");
const {
  HTTP_400_BAD_REQUEST,
  HTTP_500_INTERNAL_SERVER_ERROR,
} = require("./status");
const { Response } = require("./response");

/**
 * This function will handle the exception and return the Response
 *
 * @param {*} error
 * @param {*} req
 * @param {*} res
 * @returns response with message and status code
 */
const errorHandler = (error, req, res, next) => {
  let statusCode;
  let responseMessage;
  switch (true) {
    case error instanceof ValidationError:
      statusCode = HTTP_400_BAD_REQUEST;
      responseMessage = { message: error.message, errors: error.errors };
      break;
    case error instanceof UniqueConstraintError:
      statusCode = HTTP_400_BAD_REQUEST;
      responseMessage = {
        message: error.message,
        errors: error.errors,
      };
      break;
    case error instanceof ForeignKeyConstraintError:
      statusCode = HTTP_400_BAD_REQUEST;
      responseMessage = {
        message: error.message,
        errors: {
          fields: error.fields,
          value: error.value,
        },
      };
      break;
    default:
      statusCode = HTTP_500_INTERNAL_SERVER_ERROR;
      responseMessage = error || { message: "Internal server error" };
      break;
  }
  if (process.env.NODE_ENV === "production" ? null : error.stack)
    responseMessage.stack = error.stack;
  return new Response(responseMessage, statusCode, res);
};

module.exports = { errorHandler };
