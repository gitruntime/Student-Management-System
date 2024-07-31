const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/signings/auth.signing");
const errorHandler = require("../../utils/handlers/error");
const { Account } = require("../../models/associates/associate.model");
const bcrypt = require("bcrypt");

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await Account.findOne({
      where: { email },
      attributes: [
        "id",
        "first_name",
        "last_name",
        "full_name",
        "user_role",
        "is_active",
        "is_staff",
        "is_superuser",
        "password",
      ],
      paranoid: false,
    });
    if (!user)
      return res
        .status(404)
        .json({ message: "User with this email is not present" });
    const userData = user.get({ plain: true });
    // Removing Un-necessary Data
    delete userData.password;
    delete userData.first_name;
    delete userData.last_name;
    if (!user) return errorHandler(400, "Invalid email");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return errorHandler(400, "Password is Incorrect");

    const accessToken = generateAccessToken(userData);
    const refreshToken = generateRefreshToken(userData);

    return res
      .status(200)
      .json({ message: "User Login Successfully", accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
};
