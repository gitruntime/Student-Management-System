const { Class, ClassTeacher, Teacher } = require("../../models");
const { tryCatch } = require("../../utils/handlers");

const classList = tryCatch(async (req, res) => {
  const teacher = await Teacher.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
  });
  if (!teacher)
    return res.status(404).json({ message: "Teacher Profile not found" });
  const data = await Class.findAndCountAll({
    include: {
      model: ClassTeacher,
      where: { teacherId: teacher.id },
      attributes: [],
    },
    attributes: ["id", "name", "createdAt", "updatedAt"],
  });
  return res
    .status(200)
    .json({ data, message: "Class fetched successfully.!" });
});
const classView = tryCatch(async (req, res) => {});

module.exports = {
  classList,
  classView,
};
