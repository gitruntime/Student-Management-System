require("dotenv").config();
const jwt = require("jsonwebtoken");
const { Response } = require("../utils/handlers/response");

/**
 * Here we set Token and User data in the request
 */
const authenticateToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, (err, authData) => {
      if (err) return new Response({ message: "Token is not valid" }, 403, res);
      req.user = authData;
      next();
    });
  } else {
    return new Response({ message: "Token not provided" }, 403, res);
  }
};

module.exports = {
  authMiddleware: authenticateToken,
};
