const { Response } = require("../../utils/handlers/response");
const { HTTP_200_OK } = require("../../utils/handlers/status");
const { tryCatch } = require("../../utils/handlers/tryCatch");
const {
  Teacher,
  Account,
  Experience,
  Certificate,
  Address,
  Education,
} = require("../../models");

const teacherList = tryCatch(async (req, res) => {
  const { size: limit = 10, page = 1 } = req.query;
  const { rows: data, count } = await Account.findAndCountAll({
    limit,
    offset: (page - 1) * limit,
    where: { userRole: "teacher", tenantId: req.tenant.id },
    include: {
      model: Teacher,
      as: "teacherProfile",
    },
  });
  return new Response(
    {
      data,
      totalCount: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      size: limit,
    },
    HTTP_200_OK,
    res
  );
});

const teacherCreate = tryCatch(async (req, res) => {
  const data = await Account.create({
    ...req.validatedData,
    tenantId: req.tenant.id,
  });
  return res
    .status(201)
    .json({ message: "Teacher created successfully", data });
});

const teacherView = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = await Account.findOne({
    where: {
      id,
      userRole: "teacher",
      tenantId: req.tenant.id,
    },
    include: [
      {
        model: Teacher,
        as: "teacherProfile",
      },
    ],
  });
  if (!data) return res.status(404).json({ message: "Teacher not found" });
  return res.status(200).json(data);
});

const teacherUpdate = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Account.findOne({
    where: {
      id,
      userRole: "teacher",
      tenantId: req.tenant.id,
    },
    include: [
      {
        model: Teacher,
        as: "teacherProfile",
      },
    ],
  });
  if (!data) return res.status(404).json({ message: "Teacher not found" });
  const { bio, ...accountDetails } = req.validatedData;
  Object.assign(data, accountDetails);
  await data.save();
  await data.teacherProfile.update({ bio });
  return res
    .status(200)
    .json({ message: "Teacher data updated successfully", data });
});

const teacherDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const teacher = await Account.findByPk(id);
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });
  await teacher.destroy();
  return res.status(200).json({ message: "Teacher deleted successfully" });
});

const experienceList = tryCatch(async (req, res, next) => {
  const { size: limit = 10, page = 1 } = req.query;
  const { teacherId } = req.params;
  const { rows: data, count } = await Experience.findAndCountAll({
    limit,
    offset: (page - 1) * limit,
    where: { teacherId: teacherId, tenantId: req.tenant.id },
  });
  return res.status(200).json({
    data,
    totalCount: count,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
    size: limit,
  });
});

const experienceCreate = tryCatch(async (req, res, next) => {
  const { teacherId } = req.params;
  const data = await Experience.create({
    ...req.validatedData,
    teacherId: teacherId,
    tenantId: req.tenant.id,
  });
  return res
    .status(201)
    .json({ message: "Experience created successfully.", data });
});

const experienceView = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Experience.findByPk(id);
  if (!data) return res.status(404).json({ message: "Experience not found" });
  return res.status(200).json({ data });
});

const experienceUpdate = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Experience.findByPk(id);
  if (!data) return res.status(404).json({ message: "Experience not found" });
  Object.assign(data, req.validatedData);
  await data.save();
  return res
    .status(200)
    .json({ message: "Experience updated successfully", data });
});

const experienceDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const experience = await Experience.findByPk(id);
  if (!experience)
    return res.status(404).json({ message: "Experience not found" });
  await experience.destroy();
  return res.status(200).json({ message: "Experience Deleted Successfully." });
});

const certificateList = tryCatch(async (req, res, next) => {
  const { size: limit = 10, page = 1 } = req.query;
  const { teacherId } = req.params;
  const { rows: data, count } = await Certificate.findAndCountAll({
    limit,
    offset: (page - 1) * limit,
    where: { teacherId: teacherId, tenantId: req.tenant.id },
  });
  return res.status(200).json({
    data,
    totalCount: count,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
    size: limit,
  });
});

const certificateCreate = tryCatch(async (req, res, next) => {
  const { teacherId } = req.params;
  const data = await Certificate.create({
    ...req.validatedData,
    tenantId: req.tenant.id,
    teacherId: teacherId,
  });
  return res
    .status(201)
    .json({ message: "Certificate created successfully.", data });
});

const certificateView = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = await Certificate.findByPk(id);
  if (!data) return res.status(404).json({ message: "Certificate not found" });
  return res.status(200).json({ data });
});

const certificateUpdate = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = await Certificate.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!data) return res.status(404).json({ message: "Certificate not found" });
  Object.assign(data, req.validatedData);
  await data.save();
  return res
    .status(200)
    .json({ message: "Certificate Updated Successfully", data });
});

const certificateDelete = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = await Certificate.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!data) return res.status(404).json({ message: "Certificate not found" });
  await data.destroy();
  return res.status(200).json({ message: "Certificate deleted Successfully" });
});

const educationList = tryCatch(async (req, res) => {
  const { size: limit = 10, page = 1 } = req.query;
  const { teacherId } = req.params;
  const { rows: data, count } = await Education.findAndCountAll({
    limit,
    offset: (page - 1) * limit,
    where: { teacherId: teacherId, tenantId: req.tenant.id },
  });
  return res.status(200).json({
    data,
    totalCount: count,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
    size: limit,
  });
});

const educationCreate = tryCatch(async (req, res) => {
  const { teacherId } = req.params;
  const data = await Education.create({
    ...req.validatedData,
    teacherId: teacherId,
    tenantId: req.tenant.id,
  });
  return res
    .status(201)
    .json({ message: "Education created successfully.", data });
});

const educationView = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = await Education.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!data) return res.status(404).json({ message: "Education not found" });
  return res.status(200).json({ data });
});

const educationUpdate = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = await Education.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!data) return res.status(404).json({ message: "Education not found" });
  Object.assign(data, req.validatedData);
  await data.save();
  return res.status(200).json({ data });
});

const educationDelete = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = await Education.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!data) return res.status(404).json({ message: "Education not found" });
  await data.destroy();
  return res.status(200).json({ message: "Education Deleted Successfully.!" });
});

const addressList = tryCatch(async (req, res, next) => {
  const { size: limit = 10, page = 1 } = req.query;
  const { teacherId: accountId } = req.params;
  const { rows: data, count } = await Address.findAndCountAll({
    limit,
    offset: (page - 1) * limit,
    where: { accountId, tenantId: req.tenant.id },
  });
  return res.status(200).json({
    data,
    totalCount: count,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
    size: limit,
  });
});

const addressCreate = tryCatch(async (req, res, next) => {
  const { teacherId: accountId } = req.params;
  const data = await Address.create({
    ...req.validatedData,
    accountId,
    tenantId: req.tenant.id,
  });
  return res
    .status(201)
    .json({ message: "Address created successfully", data });
});

const addressView = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = await Address.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!data) return res.status(404).json({ message: "Address not found" });
  return res.status(200).json({ data });
});

const addressUpdate = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = await Address.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!data) return res.status(404).json({ message: "Address not found" });
  Object.assign(data, req.validatedData);
  await data.save();
  return res.status(200).json({ data });
});

const addressDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Address.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!data) return res.status(404).json({ message: "Address not found" });
  await data.destroy();
  return res.status(200).json({ message: "Addresss Deleted Successfully" });
});

// const bankDetailCreate = tryCatch(async (req, res, next) => {
//   const { teacherId } = req.params;
//   const {
//     name,
//     address,
//     holder_name,
//     account_number,
//     ifsc_code,
//     account_type,
//   } = req.validatedData;
//   const data = await BankDetail.create({
//     name,
//     address,
//     holder_name,
//     account_number,
//     ifsc_code,
//     account_type,
//     teacher_id: teacherId,
//   });
//   return res
//     .status(201)
//     .json({ message: "BankDetail created successfully.", data });
// });

// const bankDetailView = tryCatch(async (req, res, next) => {
//   const { id } = req.params;
//   const bankDetail = await BankDetail.findByPk(id, { paranoid: false });
//   if (!bankDetail)
//     return res.status(404).json({ message: "Bank Detail not found" });
//   return res.status(200).json(bankDetail);
// });

// const bankDetailUpdate = tryCatch(async (req, res, next) => {
//   const { id } = req.params;
//   const {
//     name,
//     address,
//     holder_name,
//     account_number,
//     ifsc_code,
//     account_type,
//   } = req.validatedData;
//   const bankDetail = await BankDetail.findByPk(id, { paranoid: false });
//   if (!bankDetail)
//     return res.status(404).json({ message: "Address not found" });
//   await bankDetail.update({
//     name,
//     address,
//     holder_name,
//     account_number,
//     ifsc_code,
//     account_type,
//   });
//   return res.status(200).json(bankDetail);
// });

// const bankDetailDelete = tryCatch(async (req, res, next) => {
//   const { id } = req.params;
//   const bankDetail = await BankDetail.findByPk(id);
//   if (!bankDetail)
//     return res.status(404).json({ message: "Bank Detail not found" });
//   await bankDetail.destroy();
//   return res.status(200).json({ message: "Bank Detail Deleted Successfully" });
// });

module.exports = {
  teacherList,
  teacherCreate,
  teacherView,
  teacherUpdate,
  teacherDelete,
  experienceList,
  experienceCreate,
  experienceView,
  experienceUpdate,
  experienceDelete,
  educationList,
  educationCreate,
  educationView,
  educationUpdate,
  educationDelete,
  certificateList,
  certificateCreate,
  certificateView,
  certificateUpdate,
  certificateDelete,
  addressList,
  addressCreate,
  addressView,
  addressUpdate,
  addressDelete,
  // bankDetailCreate,
  // bankDetailView,
  // bankDetailUpdate,
  // bankDetailDelete,
};
