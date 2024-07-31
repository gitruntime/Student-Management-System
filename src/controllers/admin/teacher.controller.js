const { Op } = require("sequelize");
const {
  Account,
  Teacher,
  Experience,
  Certificate,
  Address,
  BankDetail,
} = require("../../models/associates/associate.model");

const teacherList = async (req, res, next) => {
  try {
    const { page, size } = req.query;
    const offset = (page - 1) * size;
    let teachers;
    if (page) {
      teachers = await Account.findAll({
        page,
        offset,
        paranoid: false,
        where: { user_role: "teacher" },
        include: {
          model: Teacher,
          as: "teachers",
        },
      });
      return res.status(200).json({
        results: teachers,
        total: Teacher.count(),
        currentPage: page,
        size: size,
      });
    }
    teachers = await Account.findAll({
      paranoid: false,
      where: { user_role: "teacher" },
      include: {
        model: Teacher,
        as: "teachers",
      },
    });
    return res.status(200).json(teachers);
  } catch (error) {
    next(error);
  }
};

const teacherCreate = async (req, res, next) => {
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
  } = req.body;

  try {
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
  } catch (error) {
    next(error);
  }
};

const teacherView = async (req, res, next) => {
  const { id } = req.params;
  try {
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
  } catch (error) {
    next(error);
  }
};

const teacherUpdate = async (req, res, next) => {
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
  } = req.body;
  const { id } = req.params;
  try {
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
  } catch (error) {
    next(error);
  }
};

const teacherDelete = async (req, res, next) => {
  const { id } = req.params;
  try {
    const rowDeleted = await Account.destroy({ where: { id } });
    if (rowDeleted === 0)
      return res.status(404).json({ message: "Teacher not found" });
    return res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const experienceList = async (req, res, next) => {
  const { teacherId } = req.params;
  try {
    const data = await Experience.findAll({
      paranoid: false,
      where: { teacher_id: teacherId },
    });
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const experienceCreate = async (req, res, next) => {
  const { teacherId } = req.params;
  const { department, designation, date_joined } = req.body;
  try {
    const data = await Experience.create({
      department,
      designation,
      date_joined,
      teacher_id: teacherId,
    });
    return res
      .status(201)
      .json({ message: "Experience created successfully.", data });
  } catch (error) {
    next(error);
  }
};

const experienceView = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = Experience.findByPk(id, { paranoid: false });
    if (!data) return res.status(404).json({ message: "Experience not found" });
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const experienceUpdate = async (req, res, next) => {
  const { id } = req.params;
  const { department, designation, date_joined } = req.body;
  try {
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
  } catch (error) {
    next(error);
  }
};

const experienceDelete = async (req, res, next) => {
  const { id } = req.params;
  try {
    const experience = await Experience.findByPk(id);
    if (!experience)
      return res.status(404).json({ message: "Experience not found" });
    await experience.destroy();
    return res
      .status(200)
      .json({ message: "Experience Deleted Successfully." });
  } catch (error) {
    next(error);
  }
};

const certificateList = async (req, res, next) => {
  const { teacherId } = req.params;
  try {
    const certificates = await Certificate.findAll({
      where: {
        teacher_id: teacherId,
      },
      paranoid: false,
    });
    return res.status(200).json({ certificates });
  } catch (error) {
    next(error);
  }
};

const certificateCreate = async (req, res, next) => {
  const { teacherId } = req.params;
  const { title, link } = req.body;
  try {
    const data = await Certificate.create({
      title,
      link,
      teacher_id: teacherId,
    });
    return res
      .status(201)
      .json({ message: "Certificate created successfully.", data });
  } catch (error) {
    next(error);
  }
};

const certificateView = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await Certificate.findByPk(id, { paranoid: false });
    if (!data)
      return res.status(404).json({ message: "Certificate not found" });
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const certificateUpdate = async (req, res, next) => {
  const { id } = req.params;
  const { title, link } = req.body;
  try {
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
  } catch (error) {
    next(error);
  }
};
const certificateDelete = async (req, res, next) => {
  const { id } = req.params;
  try {
    const certificate = await Certificate.findByPk(id);
    if (!certificate)
      return res.status(404).json({ message: "Certificate not found" });
    await certificate.destroy();
  } catch (error) {
    next(error);
  }
};

const addressList = async (req, res, next) => {
  const { teacherId } = req.params;
  try {
    const address = await Address.findAll({
      where: { teacher_id: teacherId },
      paranoid: false,
    });
    return res.status(200).json({ address });
  } catch (error) {
    next(error);
  }
};
const addressCreate = async (req, res, next) => {
  const { teacherId } = req.params;
  const { city, state, pincode, street_address, country, phone_number } =
    req.body;
  try {
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
  } catch (error) {
    next(error);
  }
};
const addressView = async (req, res, next) => {
  const { id } = req.params;
  try {
    const address = await Address.findByPk(id, { paranoid: false });
    if (!address) return res.status(404).json({ message: "Address not found" });
    return res.status(200).json(address);
  } catch (error) {
    next(error);
  }
};
const addressUpdate = async (req, res, next) => {
  const { id } = req.params;
  try {
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
  } catch (error) {
    next(error);
  }
};
const addressDelete = async (req, res, next) => {
  const { id } = req.params;
  try {
    const address = await Address.findByPk(id);
    if (!address) return res.status(404).json({ message: "Address not found" });
    await address.destroy();
    return res.status(200).json({ message: "Addresss Deleted Successfully" });
  } catch (error) {
    next(error);
  }
};

const bankDetailCreate = async (req, res, next) => {
  const { teacherId } = req.params;
  const {
    name,
    address,
    holder_name,
    account_number,
    ifsc_code,
    account_type,
  } = req.body;
  try {
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
  } catch (error) {
    next(error);
  }
};
const bankDetailView = async (req, res, next) => {
  const { id } = req.params;
  try {
    const bankDetail = await BankDetail.findByPk(id, { paranoid: false });
    if (!bankDetail)
      return res.status(404).json({ message: "Bank Detail not found" });
    return res.status(200).json(bankDetail);
  } catch (error) {
    next(error);
  }
};
const bankDetailUpdate = async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    address,
    holder_name,
    account_number,
    ifsc_code,
    account_type,
  } = req.body;
  try {
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
  } catch (error) {
    next(error);
  }
};
const bankDetailDelete = async (req, res, next) => {
  const { id } = req.params;
  try {
    const bankDetail = await BankDetail.findByPk(id);
    if (!bankDetail)
      return res.status(404).json({ message: "Bank Detail not found" });
    await bankDetail.destroy();
    return res
      .status(200)
      .json({ message: "Bank Detail Deleted Successfully" });
  } catch (error) {
    next(error);
  }
};

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
  bankDetailList,
  bankDetailCreate,
  bankDetailView,
  bankDetailUpdate,
  bankDetailDelete,
};
