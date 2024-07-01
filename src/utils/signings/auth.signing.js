require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateAccessToken = (user) =>
    jwt.sign({ ...user,type:"access" }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1800s",
    });
    
const generateRefreshToken = (user) =>
    jwt.sign({ ...user,type:"refresh" }, process.env.REFRESH_TOKEN_SECRET);

module.exports = {
    generateAccessToken,
    generateRefreshToken
}