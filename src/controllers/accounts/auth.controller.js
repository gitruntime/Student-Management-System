const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../../utils/signings/auth.signing");
const bcrypt = require("bcrypt");
const { Response } = require("../../utils/handlers/response");
const tryCatch = require("../../utils/handlers/tryCatch");
const {
  HTTP_400_BAD_REQUEST,
  HTTP_200_OK,
} = require("../../utils/handlers/status");
const { Account } = require("../../models");

const login = tryCatch(async (req, res, next) => {
  const { email, password } = req.validatedData;
  const user = await Account.findOne({
    where: { email },
    attributes: [
      "id",
      "firstName",
      "lastName",
      "fullName",
      "userRole",
      "isActive",
      "isTenant",
      "tenantId",
      "isSuperuser",
      "password",
      "tenantUserId",
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
  delete userData.firstName;
  delete userData.lastName;
  delete userData.tenantId;

  const accessToken = generateAccessToken(userData);
  const refreshToken = generateRefreshToken(userData);
  return new Response(
    { message: "User Login Successfully", data: { accessToken, refreshToken } },
    HTTP_200_OK,
    res,
  );
});

const refresh = tryCatch(async (req, res) => {
  let { refreshToken } = req.validatedData;
  try {
    const authData = verifyRefreshToken(refreshToken);
    const userData = await Account.findByPk(authData.id);
    if (!user) return res.status(400).json({ message: "User not found.!" });

    // Removing Un-necessary Data
    delete userData.password;
    delete userData.first_name;
    delete userData.last_name;

    const accessToken = generateAccessToken(userData);
    refreshToken = generateRefreshToken(userData);

    return res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    return res.status(400).json({ message: "Token Invalid" });
  }
});

module.exports = {
  login,
  refresh,
};
