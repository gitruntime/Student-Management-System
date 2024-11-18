const { Response } = require("../utils/handlers/response");
const { HTTP_401_UNAUTHORIZED } = require("../utils/handlers/status");

/**
 * Middleware to restrict access for admin routes only
 * If the user is not an admin, it responds with a 401 Unauthorized status code
 *
 * @param {Object} req - The Express request object, which contains information about the HTTP request.
 * @param {Object} res - The Express response object, used to send a response to the client.
 * @param {Function} next - The next middleware function to call if the user is authorized.
 *
 * @throws {Error} Throws an error if the user is not authorized.
 */
const isAdmin = (req, res, next) => {
  const { userRole } = req.user;
  if (userRole !== "admin")
    return new Response(
      { message: "You dont have permission to access this page" },
      HTTP_401_UNAUTHORIZED,
      res
    );
  next();
};

module.exports = { isAdmin };
