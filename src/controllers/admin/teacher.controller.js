const { Op } = require("sequelize");
const {
  Account,
  Teacher,
  Experience,
  Certificate,
  Address,
  BankDetail,
} = require("../../models/associates/associate.model");
const { Response } = require("../../utils/handlers/response");
const { HTTP_200_OK } = require("../../utils/handlers/status");
const tryCatch = require("../../utils/handlers/tryCatch");

const teacherList = tryCatch(async (req, res, next) => {
  const { page, size } = req.query;
  const offset = (page - 1) * size;
  let responseData;
  let options = {
    paranoid: false,
    where: { user_role: "teacher" },
    include: {
      model: Teacher,
      as: "teachers",
    },
  };
  if (page && size) {
    (options.page = page), (options.offset = offset);
    const { rows, count } = await Account.findAndCountAll(options);
    responseData = {
      teachers: rows,
      totalCount: count,
      currentPage: page,
      totalPages: Math.ceil(count / size),
      size: size,
    };
    return new Response(responseData, HTTP_200_OK, res);
  }
  responseData = (await Account.findAndCountAll(options)).rows;
  return new Response(responseData, HTTP_200_OK, res);
});

const teacherCreate = tryCatch(async (req, res, next) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    user_role,
    password,
    date_of_birth,
    is_active,
    is_staff,
  } = req.validatedData;
  const data = await Account.create({
    first_name,
    last_name,
    email,
    phone_number,
    user_role,
    password,
    date_of_birth,
    is_active,
    is_staff,
  });
  return res
    .status(201)
    .json({ message: "Teacher created successfully", data });
});

const teacherView = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Account.findOne({
    where: {
      [Op.and]: [{ id }, { user_role: "teacher" }],
    },
    include: [
      {
        model: Teacher,
        as: "teachers",
      },
    ],
  });
  if (!data) return res.status(404).json({ message: "Teacher not found" });
  return res.status(200).json(data);
});

const teacherUpdate = tryCatch(async (req, res, next) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    user_role,
    date_of_birth,
    is_active,
    is_staff,
    bio,
  } = req.validatedData;
  const { id } = req.params;
  const data = await Account.findOne({
    where: {
      [Op.and]: [{ id }, { user_role: "teacher" }],
    },
    include: [
      {
        model: Teacher,
        as: "teachers",
      },
    ],
  });
  if (!data) return res.status(404).json({ message: "Teacher not found" });
  await data.update({
    first_name,
    last_name,
    email,
    phone_number,
    user_role,
    date_of_birth,
    is_active,
    is_staff,
  });
  await data.teachers.update({ bio });
  return res
    .status(200)
    .json({ message: "Teacher data updated successfully", data });
});

const teacherDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const rowDeleted = await Account.destroy({ where: { id } });
  if (rowDeleted === 0)
    return res.status(404).json({ message: "Teacher not found" });
  return res.status(200).json({ message: "Teacher deleted successfully" });
});

const experienceList = tryCatch(async (req, res, next) => {
  const { teacherId } = req.params;
  const data = await Experience.findAll({
    paranoid: false,
    where: { teacher_id: teacherId },
  });
  return res.status(200).json(data);
});

const experienceCreate = tryCatch(async (req, res, next) => {
  const { teacherId } = req.params;
  const { department, designation, date_joined } = req.validatedData;
  const data = await Experience.create({
    department,
    designation,
    date_joined,
    teacher_id: teacherId,
  });
  return res
    .status(201)
    .json({ message: "Experience created successfully.", data });
});

const experienceView = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = Experience.findByPk(id, { paranoid: false });
  if (!data) return res.status(404).json({ message: "Experience not found" });
  return res.status(200).json(data);
});

const experienceUpdate = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { department, designation, date_joined } = req.validatedData;
  const experience = await Experience.findByPk(id);
  if (!experience)
    return res.status(404).json({ message: "Experience not found" });
  await experience.update({
    department,
    designation,
    date_joined,
  });
  return res
    .status(200)
    .json({ message: "Experience updated successfully", experience });
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
  const { teacherId } = req.params;
  const certificates = await Certificate.findAll({
    where: {
      teacher_id: teacherId,
    },
    paranoid: false,
  });
  return res.status(200).json({ certificates });
});

const certificateCreate = tryCatch(async (req, res, next) => {
  const { teacherId } = req.params;
  const { title, link } = req.validatedData;
  const data = await Certificate.create({
    title,
    link,
    teacher_id: teacherId,
  });
  return res
    .status(201)
    .json({ message: "Certificate created successfully.", data });
});

const certificateView = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Certificate.findByPk(id, { paranoid: false });
  if (!data) return res.status(404).json({ message: "Certificate not found" });
  return res.status(200).json(data);
});

const certificateUpdate = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { title, link } = req.validatedData;
  const certificate = await Certificate.findByPk(id);
  if (!certificate)
    return res.status(404).json({ message: "Certificate not found" });
  await certificate.update({
    title,
    link,
  });
  return res
    .status(200)
    .json({ message: "Certificate Updated Successfully", certificate });
});

const certificateDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const certificate = await Certificate.findByPk(id);
  if (!certificate)
    return res.status(404).json({ message: "Certificate not found" });
  await certificate.destroy();
  return res.status(200).json({ message: "Certificate deleted Successfully" });
});

const addressList = tryCatch(async (req, res, next) => {
  const { teacherId } = req.params;
  const address = await Address.findAll({
    where: { teacher_id: teacherId },
    paranoid: false,
  });
  return res.status(200).json({ address });
});

const addressCreate = tryCatch(async (req, res, next) => {
  const { teacherId } = req.params;
  const { city, state, pincode, street_address, country, phone_number } =
    req.validatedData;
  const address = await Address.create({
    city,
    state,
    pincode,
    street_address,
    country,
    phone_number,
    account_id: teacherId, // account_id and teacher_id are same
  });
  return res
    .status(201)
    .json({ message: "Address created successfully", address });
});

const addressView = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const address = await Address.findByPk(id, { paranoid: false });
  if (!address) return res.status(404).json({ message: "Address not found" });
  return res.status(200).json(address);
});

const addressUpdate = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { city, state, pincode, street_address, country, phone_number } = req.validatedData
  const address = await Address.findByPk(id, { paranoid: false });
  if (!address) return res.status(404).json({ message: "Address not found" });
  await address.update({
    city,
    state,
    pincode,
    street_address,
    country,
    phone_number,
  });
  return res.status(200).json(address);
});

const addressDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const address = await Address.findByPk(id);
  if (!address) return res.status(404).json({ message: "Address not found" });
  await address.destroy();
  return res.status(200).json({ message: "Addresss Deleted Successfully" });
});

const bankDetailCreate = tryCatch(async (req, res, next) => {
  const { teacherId } = req.params;
  const {
    name,
    address,
    holder_name,
    account_number,
    ifsc_code,
    account_type,
  } = req.validatedData;
  const data = await BankDetail.create({
    name,
    address,
    holder_name,
    account_number,
    ifsc_code,
    account_type,
    teacher_id: teacherId,
  });
  return res
    .status(201)
    .json({ message: "BankDetail created successfully.", data });
});

const bankDetailView = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const bankDetail = await BankDetail.findByPk(id, { paranoid: false });
  if (!bankDetail)
    return res.status(404).json({ message: "Bank Detail not found" });
  return res.status(200).json(bankDetail);
});

const bankDetailUpdate = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    address,
    holder_name,
    account_number,
    ifsc_code,
    account_type,
  } = req.validatedData;
  const bankDetail = await BankDetail.findByPk(id, { paranoid: false });
  if (!bankDetail)
    return res.status(404).json({ message: "Address not found" });
  await bankDetail.update({
    name,
    address,
    holder_name,
    account_number,
    ifsc_code,
    account_type,
  });
  return res.status(200).json(bankDetail);
});

const bankDetailDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const bankDetail = await BankDetail.findByPk(id);
  if (!bankDetail)
    return res.status(404).json({ message: "Bank Detail not found" });
  await bankDetail.destroy();
  return res.status(200).json({ message: "Bank Detail Deleted Successfully" });
});

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
  bankDetailCreate,
  bankDetailView,
  bankDetailUpdate,
  bankDetailDelete,
};
