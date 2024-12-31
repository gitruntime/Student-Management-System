const { Account, Parent, Student } = require("../../../models");
const { tryCatch } = require("../../../utils/handlers/tryCatch");
const { db: sequelize } = require("../../../configs/db.config");
const { Op, ValidationError: SeqValidationError } = require("sequelize");
const { calculateTotalPages } = require("../../../utils/handlers");

const parentList = tryCatch(async (req, res, next) => {
  const { page = 1, size: limit = 10, search = "" } = req.query;

  const offset = (page - 1) * limit;

  const searchFilter = search
    ? {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
        ],
      }
    : {};

  const { count, rows: data } = await Account.findAndCountAll({
    limit,
    offset,
    where: { userRole: "parent", tenantId: req.tenant.id, ...searchFilter },
    include: {
      model: Parent,
      as: "parentProfile",
      attributes: ["accountId", "profilePicture"],
    },
    attributes: ["id", "fullName", "firstName", "lastName", "email"],
  });
  return res.status(200).json({
    data,
    totalRecords: count,
    totalPages: calculateTotalPages(count, limit),
    currentPage: page,
    size: limit,
    version: "v2",
    message: "Parent fetched successfully.!",
  });
});

const parentCreate = tryCatch(async (req, res, next) => {
  const { students, profilePicture, bio, bloodGroup, sex, ...accountDetails } =
    req.validatedData;
  const transaction = await sequelize.transaction();

  try {
    const existingEmail = await Account.findOne({
      where: { email: accountDetails.email, tenantId: req.tenant.id },
    });
    if (existingEmail) {
      return res.status(400).json({
        message: "Validation Error",
        error: { email: "Email is already exist" },
      });
    }

    const parent = await Account.create(
      {
        ...accountDetails,
        userRole: "parent",
        tenantId: req.tenant.id,
      },
      { transaction, version: true }
    );

    const parentProfile = await Parent.create(
      {
        accountId: parent.id,
        tenantId: req.tenant.id,
        profilePicture,
        bio,
        bloodGroup,
        sex,
      },
      {
        transaction,
      }
    );

    const studentInstance = await Student.findAll(
      {
        where: { accountId: students },
      },
      { transaction }
    );

    if (studentInstance.length !== students.length) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Some students does not exist",
        error: { subjects: "Clear the students and select again" },
      });
    }

    await parentProfile.addStudents(studentInstance, { transaction });
    await transaction.commit();
    const responseData = {
      message: "Parent created successfully",
      version: "v2",
    };
    if (process.env.NODE_ENV === "development") {
      responseData["data"] = {
        ...parent.get({ plain: true }),
        ...parentProfile.get({ plain: true }),
      };
    }
    return res.status(201).json(responseData);
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    if (error instanceof SeqValidationError) return next(error);
    return res.status(400).json({
      message: "Failed during saving the parent.Please try again",
    });
  }
});

const parentView = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Account.findOne({
    where: {
      [Op.and]: [{ id }, { userRole: "parent" }],
    },
    include: [
      {
        model: Parent,
        as: "parents",
      },
    ],
  });
  if (!data) return res.status(404).json({ message: "Parent not found" });
  return res.status(200).json(data);
});

const parentUpdate = tryCatch(async (req, res, next) => {
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
  const data = await Account.findOne({
    where: {
      [Op.and]: [{ id }, { user_role: "parent" }],
    },
    include: [
      {
        model: Parent,
        as: "parents",
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
  return res
    .status(200)
    .json({ message: "Parent data updated successfully", data });
});

const parentDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const parent = await Account.findOne({
    where: { id, user_role: "parent" },
  });
  if (!parent) return res.status(404).json({ message: "Parent not found" });
  await parent.destroy();
  return res.status(200).json({ message: "Parent deleted successfully" });
});

module.exports = {
  parentList,
  parentCreate,
  parentView,
  parentUpdate,
  parentDelete,
};
