const { Op, Sequelize } = require("sequelize");
const {
  Class,
  Subject,
  Teacher,
  ClassTeacher,
  Account,
} = require("../../models");
const { calculateTotalPages } = require("../../utils/handlers");
const { tryCatch } = require("../../utils/handlers/tryCatch");

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

// const examList = tryCatch(async (req, res, next) => {});
const examCreate = tryCatch(async (req, res, next) => {});
// const examView = tryCatch(async (req, res, next) => {});
// const examUpdate = tryCatch(async (req, res, next) => {});
// const examDelete = tryCatch(async (req, res, next) => {});

// const eventList = tryCatch(async (req, res, next) => {});
// const eventCreate = tryCatch(async (req, res, next) => {});
// const eventView = tryCatch(async (req, res, next) => {});
// const eventUpdate = tryCatch(async (req, res, next) => {});
// const eventDelete = tryCatch(async (req, res, next) => {});

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
  removeTeacherFromClass
};
