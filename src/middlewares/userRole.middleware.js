const { Account } = require("../models");
/**
 * 
 * Ensure that this middleware only comes 
 */
const userRoleMiddleware = async (req, res, next) => {
  const account = await Account.findOne({
    where: { id: req.user.id },
    include: [
      { model: Admin, as: "adminProfile", attributes: ["id"] },
      { model: Teacher, as: "teacherProfile", attributes: ["id"] },
      { model: Student, as: "studentProfile", attributes: ["id"] },
      { model: Parent, as: "parentProfile", attributes: ["id"] },
    ],
  });

  let userRoleId;
  if (account.adminProfile) {
    userRoleId = account.adminProfile.id;
  } else if (account.teacherProfile) {
    userRoleId = account.teacherProfile.id;
  } else if (account.studentProfile) {
    userRoleId = account.studentProfile.id;
  } else if (account.parentProfile) {
    userRoleId = account.parentProfile.id;
  }

  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }
  req.userRoleId = userRoleId;

  next();
};

module.exports = {
  userRoleMiddleware,
};
