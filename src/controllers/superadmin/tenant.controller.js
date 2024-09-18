const { Tenant } = require("../../models");
const { tryCatch } = require("../../utils/handlers/tryCatch");

const tenantList = tryCatch(async (req, res) => {
  const { size: limit = 10, page = 1 } = req.query;
  const { rows: data, count } = await Tenant.findAndCountAll({
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

const tenantCreate = tryCatch(async (req, res) => {
  const data = await Tenant.create({ ...req.validatedData });
  return res
    .status(201)
    .json({ message: "Tenant Created Successfully.!", data });
});

const tenantView = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = await Tenant.findOne({
    where: {
      id,
    },
  });
  if (!data) return res.status(404).json({ message: "Tenant not found!!" });
  return res.status(200).json({ data });
});

const tenantUpdate = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = await Tenant.findByPk(id);

  if (!data) return res.status(404).json({ message: "Tenant not Found" });
  await data.update(req.validatedData);
  return res
    .status(200)
    .json({ message: "Tenant Updated Successfully.!", data });
});

const tenantDelete = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = await Tenant.findByPk(id);
  await data.destroy();
  return res.status(200).json({ message: "Tenant deleted Successfully" });
});

module.exports = {
  tenantList,
  tenantCreate,
  tenantView,
  tenantUpdate,
  tenantDelete,
};
