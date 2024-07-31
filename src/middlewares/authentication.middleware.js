require("dotenv").config();
const jwt = require("jsonwebtoken");

/**
 * Here we set Token and User data in the request
 */
const authenticateToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, (err, authData) => {
      if (err) return res.sendStatus(403);
      req.user = authData;
      next();
    });
  } else {
    return res.sendStatus(403);
  }
};

module.exports = {
  authMiddleware: authenticateToken,
};
