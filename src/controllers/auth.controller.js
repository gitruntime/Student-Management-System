const Auth = require("../models/auth.model");
const { generateAccessToken, generateRefreshToken } = require("../utils/signings/auth.signing")

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    let user = await Auth.findUserByEmail(email);
    if (!user)
      return res.status(404).json({
        errors: {
          email: "User with this email not found!",
        },
      });
    if (user.is_superuser && user.password !== password)
        return res
          .status(400)
          .json({ message: "Superuser login credentials are wrong" });

    // Generating Access & Refresh Token using JWT
    let access_token = generateAccessToken(user);
    let refresh_token = generateRefreshToken(user);

    // for now we are not encrypting the superuser password
    if (user.is_superuser && user.password === password) {
      return res
        .status(200)
        .json({
          message: "Superuser logined successfully",
          token: { access_token, refresh_token },
        });
    }
  } catch (error){
    console.error("Login Error ",error);
  }

};

module.exports = {
  login,
};
