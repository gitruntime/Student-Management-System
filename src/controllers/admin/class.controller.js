const { Op, Sequelize } = require("sequelize");
const {
  Class,
  Subject,
  Teacher,
  ClassTeacher,
  Account,
  Exam,
  ExamSubject,
  Student,
} = require("../../models");
const { calculateTotalPages } = require("../../utils/handlers");
const { tryCatch } = require("../../utils/handlers/tryCatch");
const { db: sequelize } = require("../../configs/db.config");

const classList = tryCatch(async (req, res, next) => {
  const {
    size: limit = 10,
    page = 1,
    sortBy = "id",
    sortOrder = "ASC",
  } = req.query;
  const { rows: data, count } = await Class.findAndCountAll({
    limit,
    offset: (page - 1) * limit,
    where: { tenantId: req.tenant.id },
    attributes: ["id", "name", "section"],
    order: [[sortBy, sortOrder]],
  });
  return res.status(200).json({
    data,
    totalCount: count,
    currentPage: page,
    totalPages: calculateTotalPages(count, limit),
    size: limit,
    message: "Class data fetched Successfully",
  });
});

const classCreate = tryCatch(async (req, res, next) => {
  let data = await Class.findAll({
    where: { ...req.validatedData },
  });
  if (data.length)
    return res.status(400).json({ message: "Data already exists" }); // Avoid duplication
  data = await Class.create({
    ...req.validatedData,
    tenantId: req.tenant.id,
  });
  return res.status(200).json({ data, message: "Class created Successfully" });
});

const classUpdate = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const existData = await Class.findAll({
    where: { ...req.validatedData, [Op.not]: [{ id }] }, // Cond :- 1 if the same data present Cond :- 2 validation if the user updating the same data again & again (the entire data needs to exclude)
  });
  if (existData.length)
    return res.status(400).json({ message: "Data already exists" }); // Avoid duplication
  const data = await Class.findOne({ where: { id, tenantId: req.tenant.id } });
  if (!data) return res.status(404).json({ message: "Class not found" });
  data.updateFormData(req.validatedData);
  await data.save();
  return res.status(200).json({ data, message: "Class updated Successfully" });
});

const classDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Class.findOne({ where: { id, tenantId: req.tenant.id } });
  if (!data) return res.status(404).json({ message: "Class not found" });
  await data.destroy();
  return res.status(200).json({ message: "Class Deleted Successfully" });
});

const subjectList = tryCatch(async (req, res, next) => {
  const {
    size: limit = 10,
    page = 1,
    sortBy = "id",
    sortOrder = "ASC",
  } = req.query;
  const { rows: data, count } = await Subject.findAndCountAll({
    limit,
    offset: (page - 1) * limit,
    where: { tenantId: req.tenant.id },
    attributes: ["id", "name", "code"],
    order: [[sortBy, sortOrder]],
  });
  return res.status(200).json({
    data,
    totalCount: count,
    currentPage: page,
    totalPages: calculateTotalPages(count, limit),
    size: limit,
    message: "Subject data fetched Successfully",
  });
});

const subjectCreate = tryCatch(async (req, res, next) => {
  let data = await Subject.findAll({
    where: { ...req.validatedData },
  });
  if (data.length)
    return res.status(400).json({ message: "Data already exists" }); // Avoid duplication
  data = await Subject.create({
    ...req.validatedData,
    tenantId: req.tenant.id,
  });
  return res
    .status(200)
    .json({ data, message: "Subject created Successfully" });
});

const subjectUpdate = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const existData = await Subject.findAll({
    where: { ...req.validatedData, [Op.not]: [{ id }] }, // Cond :- 1 if the same data present Cond :- 2 validation if the user updating the same data again & again (the entire data needs to exclude)
  });
  if (existData.length)
    return res.status(400).json({ message: "Data already exists" }); // Avoid duplication
  const data = await Subject.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!data) return res.status(404).json({ message: "Subject not found" });
  data.updateFormData(req.validatedData);
  await data.save();
  return res
    .status(200)
    .json({ data, message: "Subject updated Successfully" });
});

const subjectDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Subject.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!data) return res.status(404).json({ message: "Subject not found" });
  await data.destroy();
  return res.status(200).json({ message: "Subject Deleted Successfully" });
});

const getSubjectsFromClass = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const classInstance = await Class.findOne({
    where: { id, tenantId: req.tenant.id },
  });

  if (!classInstance)
    return res.status(404).json({ subjectIds: [], message: "Class not Found" });

  const subjectInstances = await classInstance.getSubjects({
    attributes: ["id"],
    where: {
      tenantId: req.tenant.id,
    },
  });

  const subjectIds = subjectInstances.map((subject) => subject.id);

  return res.status(200).json({
    message: "Subjects added successfully to the class",
    subjectIds,
  });
});

const addSubjectstoClass = tryCatch(async (req, res, next) => {
  // class Id
  const { id } = req.params;
  const classInstance = await Class.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!classInstance)
    return res.status(404).json({ message: "Class not found" });
  const { subjectIds } = req.validatedData;
  const subjectInstances = await Subject.findAll({
    where: { id: subjectIds },
    attributes: ["id"],
  });
  classInstance.setSubjects(subjectInstances, {
    through: {
      tenantId: req.tenant.id,
    },
  });
  return res
    .status(200)
    .json({ message: "Subjects added successfully to the classes" });
});

const getTeachersFromClass = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await ClassTeacher.findAll({
    where: { classId: id },
    include: [
      {
        model: Teacher,
        attributes: ["accountId"], // Direct fields in Teacher table
        include: [
          {
            model: Account,
            as: "accountDetails", // Use the correct alias from the association
            attributes: ["id", "fullName", "firstName", "lastName"], // Fields from Account table
          },
        ],
      },
      {
        model: Subject,
        as: "Subject", // Alias defined in the association
        attributes: ["id", "name", "code"], // Fields from Subject table
      },
    ],
    attributes: ["id", "teacherRole", "classId", "teacherId", "subjectId"], // Fields from ClassTeacher table
  });

  return res.status(200).json({
    message: "Teachers fetched successfully",
    data,
  });
});

const addTeacherstoClass = tryCatch(async (req, res, next) => {
  // class Id
  const { id } = req.params;
  const teacherInstance = await Teacher.findOne({
    where: { accountId: req.validatedData.teacherId },
    attributes: ["accountId", "id"],
  });

  if (!teacherInstance) {
    return res.status(404).json({
      message: `Teacher with accountId ${req.validatedData.teacherId} not found.`,
    });
  }

  const data = await ClassTeacher.findOne({
    where: { classId: id, teacherId: teacherInstance.id },
  });

  if (data) {
    data.update({
      subjectId: req.validatedData.subjectId,
      teacherRole: req.validatedData.teacherRole,
      teacherId: teacherInstance.id,
    });
  } else {
    await ClassTeacher.create({
      subjectId: req.validatedData.subjectId,
      classId: id,
      teacherId: teacherInstance.id,
    });
  }

  return res
    .status(200)
    .json({ message: "Teacher added to the class Successfully" });
});

const removeTeacherFromClass = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await ClassTeacher.findOne({
    where: { id: id },
  });
  if (!data) return res.status(404).json({ message: "Data not Found" });
  await data.destroy();
  return res.status(200).json({ message: "Data removed successfully" });
});

const addStudentToClass = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const classInstance = await Class.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!classInstance)
    return res.status(404).json({ message: "Class not found" });
  const { studentIds } = req.validatedData;
  const students = await Account.findAll({
    where: { id: studentIds, tenantId: req.tenant.id, userRole: "student" },
    include: [
      {
        model: Student,
        as: "studentProfile",
      },
    ],
  });

  if (students.length !== studentIds.length) {
    return res.status(400).json({
      message: "Some students were not found or are not valid student accounts",
    });
  }

  try {
    await Promise.all(
      students.map(async (student) => {
        await student.studentProfile.update({ classId: id });
      })
    );

    return res.status(200).json({
      message: "Students added to class successfully",
      // data: updatedClass,
    });
  } catch (error) {
    await Promise.all(
      students.map(async (student) => {
        if (student.studentProfile) {
          await student.studentProfile.update({ classId: null });
        }
      })
    );

    return res.status(400).json({ message: error });
  }
});

const fetchClassStudents = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Account.findAll({
    where: { tenantId: req.tenant.id, userRole: "student" },
    include: [
      {
        model: Student,
        as: "studentProfile",
        where: { classId: id },
      },
    ],
  });
  return res
    .status(200)
    .json({ message: "Student data fetched Successfully.!", data });
});

// Repeated API
const getSubjectDataUsingClass = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Subject.findAll({
    include: [
      {
        model: Class,
        through: { attributes: [] },
        where: { id },
      },
    ],
  });

  return res
    .status(200)
    .json({ data, message: "Subject Data Fetched successfully" });
});

module.exports = {
  classList,
  classCreate,
  classUpdate,
  classDelete,
  subjectList,
  subjectCreate,
  subjectUpdate,
  subjectDelete,
  addSubjectstoClass,
  getSubjectsFromClass,
  addTeacherstoClass,
  getTeachersFromClass,
  getSubjectsFromClass,
  removeTeacherFromClass,
  addStudentToClass,
  fetchClassStudents,
  getSubjectDataUsingClass,
};
