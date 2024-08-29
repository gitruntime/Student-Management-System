require("dotenv").config();
const { Response } = require("../utils/handlers/response");
const { verifyAccessToken } = require("../utils/signings/auth.signing");

/**
 * Here we set Token and User data in the request.
 */
const authMiddleware = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    try {
      const authData = verifyAccessToken(req.token);
      req.user = authData;
      next();
    } catch (error) {
      return new Response({ message: "Token is not valid" }, 403, res);
    }
  } else {
    return new Response({ message: "Token not provided" }, 403, res);
  }
};

module.exports = {
  authMiddleware,
};
