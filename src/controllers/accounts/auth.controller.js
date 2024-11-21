const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../../utils/signings/auth.signing");
const { tryCatch } = require("../../utils/handlers/tryCatch");
const { Account } = require("../../models");

const login = tryCatch(async (req, res) => {
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
      "tenantId",
      "isSuperuser",
      "password",
    ],
  });
  console.log(user,"thousi");
  
  if (!user)
    return res
      .status(404)
      .json({ errors: { email: "User with this email is not present" } });
  const isMatch = await user.comparePassword(password);
  if (!isMatch)
    return res
      .status(400)
      .json({ errors: { password: "Password is not Correct" } });

  let userData = user.get({ plain: true });

  // Removing Un-necessary Data
  delete userData.password;
  delete userData.firstName;
  delete userData.lastName;
  delete userData.tenantId;

  const accessToken = generateAccessToken(userData);
  const refreshToken = generateRefreshToken(userData);
  return res.status(200).json({
    message: "User Login Successfully",
    data: { accessToken, refreshToken },
  });
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

const forgetPassword = tryCatch(async (req, res) => {});

module.exports = {
  login,
  refresh,
};
