const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/signings/auth.signing");
const { Account } = require("../../models/associates/associate.model");
const bcrypt = require("bcrypt");
const { Response } = require("../../utils/handlers/response");
const tryCatch = require("../../utils/handlers/tryCatch");
const {
  HTTP_400_BAD_REQUEST,
  HTTP_200_OK,
} = require("../../utils/handlers/status");

const login = tryCatch(async (req, res, next) => {
  const { email, password } = req.validatedData;
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
    return new Response(
      { message: "User with this email is not present" },
      HTTP_400_BAD_REQUEST,
      res,
    );
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return new Response(
      { message: "User with this email is not present" },
      HTTP_400_BAD_REQUEST,
      res,
    );
  let userData = user.get({ plain: true });
  // Removing Un-necessary Data
  delete userData.password;
  delete userData.first_name;
  delete userData.last_name;
  const accessToken = generateAccessToken(userData);
  const refreshToken = generateRefreshToken(userData);
  return new Response(
    { message: "User Login Successfully", accessToken, refreshToken },
    HTTP_200_OK,
    res,
  );
});

module.exports = {
  login,
};
