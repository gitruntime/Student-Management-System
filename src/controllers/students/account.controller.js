const { Account, Student } = require("../../models");
const { tryCatch } = require("../../utils/handlers");

const ViewProfileData = tryCatch(async (req, res, next) => {
  const data = await Account.findOne({
    where: { id: req.user.id, tenantId: req.tenant.id },
    include: [
      {
        model: Student,
        as: "studentProfile",
      },
    ],
  });
  if (!data)
    return res.status(404).json({
      message: "User not found please contact with your school admin",
    });

  return res.status(200).json({ message: "Data fetched Successfully", data });
});

module.exports = {
  ViewProfileData,
};
