const { db: sequelize } = require("../../configs/db.config");
const { Account, Tenant, Teacher, Student } = require("../../models");
const { tryCatch } = require("../../utils/handlers");

const SchoolList = tryCatch(async (req, res) => {
  const data = await Account.findAll({
    where: { userRole: "admin", isSuperuser: false },
  });

  return res.status(200).json({
    message: "School fetched Successfully",
    data,
  });
});

const SchoolCreate = tryCatch(async (req, res) => {
  const { subdomainPrefix, organisationName, establishedYear, ...rest } =
    req.validatedData;

  const transaction = await sequelize.transaction();
  try {
    const tenantExist = await Tenant.findOne({ where: { subdomainPrefix } });
    if (tenantExist) {
      await transaction.rollback();
      return res.status(400).json({ message: "Subdomain already exists" });
    }

    const tenant = await Tenant.create(
      {
        name: organisationName,
        subdomainPrefix,
      },
      { transaction }
    );

    const account = await Account.create(
      {
        tenantId: tenant.id,
        dateOfBirth: establishedYear,
        firstName: organisationName,
        password: "Password@123",
        ...rest,
      },
      { transaction }
    );

    await transaction.commit();
    return res
      .status(201)
      .json({ message: "School created successfully!", data: account });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ message: "Error creating school", error });
  }
});

const SchoolUpdate = tryCatch(async (req, res) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();

  try {
    const school = await Account.findOne(
      { where: { id, userRole: "admin" } },
      { transaction }
    );

    if (!school) {
      await transaction.rollback();
      return res.status(404).json({ message: "School not found" });
    }

    const tenant = await Tenant.findOne(
      { where: { id: school.tenantId } },
      { transaction }
    );

    if (!tenant) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "School subdomain prefix not found in the database" });
    }

    const {
      subdomainPrefix,
      organisationName,
      establishedYear,
      email,
      phoneNumber,
    } = req.validatedData;

    tenant.subdomainPrefix = subdomainPrefix;
    tenant.name = organisationName;
    await tenant.save({ transaction });

    school.firstName = organisationName;
    school.dateOfBirth = establishedYear;
    school.email = email;
    school.phoneNumber = phoneNumber;
    await school.save({ transaction });

    await transaction.commit();

    return res.status(200).json({ message: "School updated successfully" });
  } catch (error) {
    await transaction.rollback();
    return res
      .status(500)
      .json({ message: "Error updating school", error: error.message });
  }
});

const TeacherList = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const school = await Account.findOne({ where: { id, userRole: "admin" } });
  if (!school) return res.status(404).json({ message: "School not found" });
  const teachers = await Account.findAll({
    where: { tenantId: school.tenantId, userRole: "teacher" },
    include: [
      {
        model: Teacher,
        as: "teacherProfile",
      },
    ],
  });
  return res
    .status(200)
    .json({ message: "Teacher fetched successfully", data: teachers });
});

const StudentList = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const school = await Account.findOne({ where: { id, userRole: "admin" } });
  if (!school) return res.status(404).json({ message: "School not found" });
  const students = await Account.findAll({
    where: { tenantId: school.tenantId, userRole: "student" },
    include: [
      {
        model: Student,
        as: "studentProfile",
      },
    ],
  });
  return res
    .status(200)
    .json({ message: "Student fetched Successfully", data: students });
});

module.exports = {
  SchoolList,
  SchoolCreate,
  SchoolUpdate,
  TeacherList,
  StudentList,
};
