require("dotenv").config();
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
      return res.status(403).json({ message: "Token is not valid" });
    }
  } else {
    return res.status(403).json({ message: "Token not provided" });
  }
};

module.exports = {
  authMiddleware,
};
