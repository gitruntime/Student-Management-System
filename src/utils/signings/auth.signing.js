require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateAccessToken = (user) =>
  jwt.sign({ ...user, type: "access" }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.NODE_ENV === "production" ? "1800s" : "30d",
  });

const generateRefreshToken = (user) =>
  jwt.sign({ ...user, type: "refresh" }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
