const { Permission } = require("../../models");
const { tryCatch } = require("../../utils/handlers/tryCatch");

const permissionList = tryCatch(async (req, res) => {
  const { size: limit = 10, page = 1 } = req.query;
  const { rows: data, count } = await Permission.findAndCountAll({
    limit,
    offset: (page - 1) * limit,
  });

  return res.status(200).json({
    data,
    size: limit,
    currentPage: page,
    totalCount: count,
    totalPage: Math.ceil(count / limit),
  });
});

const permissionCreate = tryCatch(async (req, res) => {
  const data = await Permission.create({ ...req.validatedData });
  return res
    .status(201)
    .json({ message: "Permission Created Successfully.!", data });
});

const permissionView = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = await Permission.findOne({
    where: {
      id,
    },
  });
  if (!data) return res.status(404).json({ message: "Permission not found!!" });
  return res.status(200).json({ data });
});

const permissionUpdate = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = await Permission.findByPk(id);

  if (!data) return res.status(404).json({ message: "Permission not Found" });
  await data.update(req.validatedData);
  return res
    .status(200)
    .json({ message: "Permission Updated Successfully.!", data });
});

const permissionDelete = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = await Permission.findByPk(id);
  await data.destroy();
  return res.status(200).json({ message: "Permission deleted Successfully" });
});

module.exports = {
  permissionController: {
    permissionList,
    permissionCreate,
    permissionView,
    permissionUpdate,
    permissionDelete,
  },
  groupController: {
    // Here we list out group controller
  },
};
