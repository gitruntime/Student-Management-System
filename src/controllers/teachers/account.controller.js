const {
  Account,
  Teacher,
  Address,
  Experience,
  Certificate,
  Education,
} = require("../../models/index");

const { tryCatch, calculateTotalPages } = require("../../utils/handlers");

const TeacherView = tryCatch(async (req, res, next) => {
  const data = await Account.findOne({
    where: { id: req.user.id, tenantId: req.tenant.id },
    include: {
      model: Teacher,
      as: "teacherProfile",
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt",
          "deletedAt",
          "accountId",
          "tenantId",
        ],
      },
    },
    attributes: {
      exclude: ["deletedAt", "isSuperuser", "isAdmin", "tenantId"],
    },
  });
  if (!data) return res.status(404).json({ message: "Teacher not Found.!!" });
  return res
    .status(200)
    .json({ data, message: "Teacher Data Fetched Successfully.!" });
});

const TeacherUpdate = tryCatch(async (req, res, next) => {
  const data = await Account.findOne({
    where: { id: req.user.id, tenantId: req.tenant.id },
    include: {
      model: Teacher,
      as: "teacherProfile",
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
      },
    },
    attributes: {
      exclude: ["deletedAt", "isSuperuser", "isAdmin"],
    },
  });
  if (!data)
    return res.status(404).json({ message: "Teacher Data not Found.!!" });
  const { bio, bloodGroup, ...rest } = req.validatedData;
  data.updateFormData(rest);
  data.save();
  data.teacherProfile.updateFormData({ bio, bloodGroup });
  data.teacherProfile.save();
  return res.status(200).json({ message: "Data Updated Successfully", data });
});

const AddressList = tryCatch(async (req, res) => {
  const { page = 1, size: limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const { rows: data, count } = await Address.findAndCountAll({
    page,
    offset,
    where: { accountId: req.user.id, tenantId: req.tenant.id },
    attributes: {
      exclude: ["deletedAt", "tenantId", "accountId"],
    },
  });
  return res.status(200).json({
    data,
    total: count,
    currentPage: page,
    totalPages: calculateTotalPages(count, limit),
    size: limit,
    message: "Address Fetched Successfully",
  });
});

const AddressCreate = tryCatch(async (req, res) => {
  const data = await Address.create({
    ...req.validatedData,
    accountId: req.user.id,
    tenantId: req.tenant.id,
  });
  return res
    .status(201)
    .json({ data, message: "Address created successfully." });
});

const AddressView = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = await Address.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id, id },
    attributes: { exclude: ["deletedAt", "tenantId", "accountId"] },
  });
  if (!data) return res.status(404).json({ message: "Address not found" });
  return res
    .status(200)
    .json({ data, message: "Address fetched Successfully" });
});

const AddressUpdate = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = await Address.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id, id },
    attributes: { exclude: ["deletedAt", "tenantId", "accountId"] },
  });
  if (!data) return res.status(404).json({ message: "Address not found" });
  data.updateFormData(req.validatedData);
  await data.save();
  return res
    .status(200)
    .json({ data, message: "Address updated Successfully" });
});

const AddressDelete = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = await Address.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id, id },
    attributes: { exclude: ["deletedAt", "tenantId", "accountId"] },
  });
  if (!data)
    return res.status(404).json({ data, message: "Address not found" });
  await data.destroy();
  return res
    .status(200)
    .json({ data, message: "Address deleted Successfully" });
});

const ExperienceList = tryCatch(async (req, res, next) => {
  const { size: limit = 10, page = 1 } = req.query;
  const { rows: data, count } = await Experience.findAndCountAll({
    include: {
      model: Teacher,
      as: "teacherProfile",
      where: { accountId: req.user.id, tenantId: req.tenant.id },
      attributes: [],
    },
    limit,
    offset: (page - 1) * limit,
    attributes: { exclude: ["deletedAt", "tenantId", "teacherId"] },
  });

  return res.status(200).json({
    data,
    totalCount: count,
    currentPage: page,
    totalPages: calculateTotalPages(count, limit),
    size: limit,
  });
});

const ExperienceCreate = tryCatch(async (req, res, next) => {
  const teacher = await Teacher.findOne({
    where: { accountId: req.user.id },
    attributes: ["id"],
  });

  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found." });
  }

  const data = await Experience.create({
    ...req.validatedData,
    teacherId: teacher.id,
    tenantId: req.tenant.id,
  });
  return res
    .status(201)
    .json({ message: "Experience created successfully.", data });
});

const ExperienceView = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Experience.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!data) return res.status(404).json({ message: "Experience not found" });
  return res
    .status(200)
    .json({ data, message: "Experience fetched successfully" });
});

const ExperienceUpdate = tryCatch(async (req, res, next) => {
  const data = await Experience.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!data) return res.status(404).json({ message: "Experience not found" });
  data.updateFormData(req.validatedData);
  await data.save();
  return res
    .status(200)
    .json({ message: "Experience updated successfully", data });
});

const ExperienceDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Experience.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!data) return res.status(404).json({ message: "Experience not found" });
  await data.destroy();
  return res.status(200).json({ message: "Experience deleted Successfully." });
});

const CertificateList = tryCatch(async (req, res, next) => {
  const { size: limit = 10, page = 1 } = req.query;
  const { rows: data, count } = await Certificate.findAndCountAll({
    limit,
    offset: (page - 1) * limit,
    where: { accountId: req.user.id, tenantId: req.tenant.id },
    attributes: { exclude: ["deletedAt"] },
  });
  return res.status(200).json({
    data,
    totalCount: count,
    currentPage: page,
    totalPages: calculateTotalPages(count, limit),
    size: limit,
  });
});

const CertificateCreate = tryCatch(async (req, res, next) => {
  const data = await Certificate.create({
    ...req.validatedData,
    tenantId: req.tenant.id,
    accountId: req.user.id,
  });
  return res
    .status(201)
    .json({ message: "Certificate created successfully.", data });
});

const CertificateView = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = await Certificate.findOne({
    where: { id, tenantId: req.tenant.id },
    attributes: { exclude: ["accountId", "deletedAt", "tenantId"] },
  });
  if (!data) return res.status(404).json({ message: "Certificate not found" });
  return res
    .status(200)
    .json({ data, message: "Certificate fetched successfully" });
});

const CertificateUpdate = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = await Certificate.findOne({
    where: { id, tenantId: req.tenant.id },
    attributes: { exclude: ["tenantId", "accountId", "deletedAt"] },
  });
  if (!data) return res.status(404).json({ message: "Certificate not found" });
  data.updateFormData(req.validatedData);
  await data.save();
  return res
    .status(200)
    .json({ message: "Certificate Updated Successfully", data });
});

const CertificateDelete = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = await Certificate.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!data) return res.status(404).json({ message: "Certificate not found" });
  await data.destroy();
  return res.status(200).json({ message: "Certificate deleted Successfully" });
});

// ======================================================================================================>
const EducationList = tryCatch(async (req, res) => {
  const teacher = await Teacher.findOne({
    where: { accountId: req.user.id },
    attributes: ["id"],
  });

  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found." });
  }

  const { size: limit = 10, page = 1 } = req.query;
  const { rows: data, count } = await Education.findAndCountAll({
    limit,
    offset: (page - 1) * limit,
    where: { teacherId: teacher.id, tenantId: req.tenant.id },
    attributes: { exclude: ["teacherId", "deletedAt", "tenantId"] },
  });
  return res.status(200).json({
    data,
    totalCount: count,
    currentPage: page,
    totalPages: calculateTotalPages(count, limit),
    size: limit,
  });
});

const EducationCreate = tryCatch(async (req, res) => {
  const teacher = await Teacher.findOne({
    where: { accountId: req.user.id },
    attributes: ["id"],
  });

  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found." });
  }

  const data = await Education.create({
    ...req.validatedData,
    teacherId: teacher.id,
    tenantId: req.tenant.id,
  });
  return res
    .status(201)
    .json({ message: "Education created successfully.", data });
});

const EducationView = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = await Education.findOne({
    where: { id, tenantId: req.tenant.id },
    attributes: { exclude: ["tenantId", ""] },
  });
  if (!data) return res.status(404).json({ message: "Education not found" });
  return res.status(200).json({ data });
});

const EducationUpdate = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = await Education.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!data) return res.status(404).json({ message: "Education not found" });
  Object.assign(data, req.validatedData);
  await data.save();
  return res.status(200).json({ data });
});

const EducationDelete = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = await Education.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!data) return res.status(404).json({ message: "Education not found" });
  await data.destroy();
  return res.status(200).json({ message: "Education Deleted Successfully.!" });
});

module.exports = {
  TeacherView,
  TeacherUpdate,
  AddressList,
  AddressCreate,
  AddressView,
  AddressUpdate,
  AddressDelete,
  ExperienceList,
  ExperienceCreate,
  ExperienceView,
  ExperienceUpdate,
  ExperienceDelete,
  CertificateList,
  CertificateCreate,
  CertificateView,
  CertificateUpdate,
  CertificateDelete,
  EducationList,
  EducationCreate,
  EducationView,
  EducationUpdate,
  EducationDelete,
};
