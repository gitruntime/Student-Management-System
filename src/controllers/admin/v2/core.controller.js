const { Interest } = require("../../models/core");
const { tryCatch } = require("../../utils/handlers");

const InterestList = tryCatch(async (req, res, next) => {
  const { page = 1, size = 10 } = req.query;
  const offset = (page - 1) * size;
  const { rows: data, count } = await Interest.findAndCountAll({
    page,
    offset,
    where: { studentId, tenantId: req.tenant.id },
    attributes: {
      exclude: ["deletedAt"],
    },
  });
  return res.status(200).json({
    data,
    total: count,
    currentPage: page,
    totalPages: calculateTotalPages(count, limit),
    size: size,
    message: "Interest Fetched Successfully",
  });
});

const InterestCreate = tryCatch(async (req, res, next) => {
  const data = await Interest.create({
    tenantId: req.tenant.id,
    ...req.validatedData,
  });
  return res
    .status(201)
    .json({ data, message: "Interest Created Successfully" });
});

const InterestView = tryCatch(async (req, res, next) => {
  const data = await Interest.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!data) return res.status(404).json({ message: "Interest not Found.!" });
  return res.status(200).json({ message: "Interest Fetched Successfully" });
});

const InterestUpdate = tryCatch(async (req, res, next) => {
  const data = await Interest.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!data) return res.status(404).json({ message: "Interest not Found.!" });
  data.updateFormData(req.validatedData);
  await data.save();
  return res.status(200).json({ message: "Interest Updated Successfully.!!" });
});

const InterestDelete = tryCatch(async (req, res, next) => {
  const data = await Interest.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!data) return res.status(404).json({ message: "Interest not Found.!" });
  await data.destroy();
  return res.status(200).json({ message: "Interest Deleted Successfully" });
});

module.exports = {
  InterestList,
  InterestCreate,
  InterestView,
  InterestUpdate,
  InterestDelete,
};
