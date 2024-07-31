const { Op } = require("sequelize");
const { Account, Student } = require("../../models/associates/associate.model");

/**
 * Here we list all the Student's if page and size are not present in request
 * or else it will be paginated
 */
const studentList = async (req, res, next) => {
  try {
    const { page, size } = req.query;
    const offset = (page - 1) * size;
    let students;
    if (page) {
      students = await Account.findAndCountAll({
        page,
        offset,
        paranoid: false,
        where: { user_role: "student" },
        include: {
          model: Student,
          as: "students",
        },
      });
      return res.status(200).json({
        results: students.rows,
        total: students.count,
        currentPage: page,
        size: size,
      });
    }
    students = await Account.findAll({
      paranoid: false,
      where: { user_role: "student" },
      include: {
        model: Student,
        as: "students",
      },
    });
    return res.status(200).json(students);
  } catch (error) {
    next(error);
  }
};
const studentCreate = async (req, res, next) => {
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
      .json({ message: "Student created successfully", data });
  } catch (error) {
    next(error);
  }
};
const studentView = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await Account.findOne({
      where: {
        [Op.and]: [{ id }, { user_role: "student" }],
      },
      include: [
        {
          model: Student,
          as: "students",
        },
      ],
    });
    if (!data) return res.status(404).json({ message: "Student not found" });
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
const studentUpdate = async (req, res, next) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    user_role,
    date_of_birth,
    is_active,
    is_staff,
  } = req.body;
  const { id } = req.params;
  try {
    const data = await Account.findOne({
      where: {
        [Op.and]: [{ id }, { user_role: "student" }],
      },
      include: [
        {
          model: Student,
          as: "students",
        },
      ],
    });
    if (!data) return res.status(404).json({ message: "Student not found" });
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
    return res
      .status(200)
      .json({ message: "Student data updated successfully", data });
  } catch (error) {
    next(error);
  }
};

const studentDelete = async (req, res, next) => {
  const { id } = req.params;
  try {
    const student = await Account.findOne({
      where: { id, user_role: "student" },
    });
    if (!student) return res.status(404).json({ message: "Student not found" });
    await student.destroy();
    return res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  studentList,
  studentCreate,
  studentView,
  studentUpdate,
  studentDelete,
};
