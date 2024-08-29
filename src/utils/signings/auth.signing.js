require("dotenv").config();
const jwt = require("jsonwebtoken");
const env = process.env;

const generateAccessToken = (user) =>
  jwt.sign({ ...user, type: "access" }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.NODE_ENV === "production" ? "1800s" : "30d",
  });

const generateRefreshToken = (user) =>
  jwt.sign({ ...user, type: "refresh" }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });

const verifyAccessToken = (token) => jwt.verify(token, env.ACCESS_TOKEN_SECRET);

const verifyRefreshToken = (token) =>
  jwt.verify(token, env.REFRESH_TOKEN_SECRET);



module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
