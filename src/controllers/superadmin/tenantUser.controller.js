const { Tenant, Account } = require("../../models");
const { tryCatch } = require("../../utils/handlers/tryCatch");

const tenantUserList = tryCatch(async (req, res) => {
  const { size: limit = 10, page = 1 } = req.query;
  const { rows: data, count } = await Account.findAndCountAll({
    limit,
    offset: (page - 1) * limit,
    where: { userRole: "admin" },
    include: [
      {
        model: Tenant,
        as: "tenantDetails",
        attributes: ["name", "subdomainPrefix"],
      },
    ],
  });

  return res.status(200).json({
    data,
    size: limit,
    currentPage: page,
    totalCount: count,
    totalPage: Math.ceil(count / limit),
  });
});

const tenantUserCreate = tryCatch(async (req, res) => {
  const tenant = await Tenant.findByPk(req.validatedData.tenantId);
  if (!tenant) return res.status(404).json({ message: "Tenant Not Found.!" });
  const data = await Account.create({ ...req.validatedData });
  return res
    .status(201)
    .json({ message: "Tenant User Created Successfully.!", data });
});

const tenantUserView = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = await Account.findOne({
    where: {
      id,
      userRole: "admin",
    },
    include: [
      {
        model: Tenant,
        as: "tenantDetails",
        attributes: ["name", "subdomainPrefix"],
      },
    ],
  });
  if (!data)
    return res.status(404).json({ message: "Tenant User not found!!" });
  return res.status(200).json({ data });
});

const tenantUserUpdate = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = await Account.findOne({ where: { id, userRole: "admin" } });

  if (!data) return res.status(404).json({ message: "Tenant not Found" });
  await data.update(req.validatedData);
  return res
    .status(200)
    .json({ message: "Tenant User Updated Successfully.!", data });
});

const tenantUserDelete = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = await Account.findOne({ where: { id, userRole: "admin" } });
  if (!data) return res.status(404).json({ message: "Tenant not Found" });
  await data.destroy();
  return res.status(200).json({ message: "Tenant User deleted Successfully" });
});

module.exports = {
  tenantUserList,
  tenantUserCreate,
  tenantUserView,
  tenantUserUpdate,
  tenantUserDelete,
};
