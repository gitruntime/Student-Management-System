const { Class, ClassTeacher, Teacher, Subject } = require("../../models");
const { Assignment } = require("../../models/classes/class.model");
const { tryCatch, calculateTotalPages } = require("../../utils/handlers");

const classList = tryCatch(async (req, res) => {
  const teacher = await Teacher.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
  });
  if (!teacher)
    return res.status(404).json({ message: "Teacher Profile not found" });

  const { rows: data } = await Class.findAndCountAll({
    include: {
      model: ClassTeacher,
      where: { teacherId: teacher.id },
      attributes: ["id"],
      include: {
        model: Subject,
      },
    },
    attributes: ["id", "name", "createdAt", "updatedAt"],
  });
  return res
    .status(200)
    .json({ data, message: "Class fetched successfully.!" });
});
const classView = tryCatch(async (req, res) => {});

const AssignmentList = tryCatch(async (req, res, next) => {
  const { page = 1, size: limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  // Find the teacher instance associated with the logg ed-in user
  const teacherInstance = await Teacher.findOne({
    where: { accountId: req.user.id },
  });
  if (!teacherInstance) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  // Fetch all classes assigned to the teacher
  const classList = await ClassTeacher.findAll({
    where: { teacherId: teacherInstance.id },
  });
  console.log(classList, "class list");

  const classIds = classList.map((cls) => cls.classId); // Extract class IDs
  console.log(classIds);

  // Paginated assignment fetch
  const { count, rows: data } = await Assignment.findAndCountAll({
    offset,
    limit,
    where: {
      tenantId: req.tenant.id,
      classId: classIds, // Filter by class IDs
    },
  });
  // const { count, rows: data } = await Assignment.findAndCountAll();

  // Response
  return res.status(200).json({
    data,
    totalRecords: count,
    totalPages: calculateTotalPages(count, limit),
    currentPage: page,
    size: limit,
  });
});

const AssignmentCreate = tryCatch(async (req, res, next) => {
  const classInstance = await Class.findOne({
    where: { id: req.validatedData.classId, tenantId: req.tenant.id },
  });
  console.log(classInstance);

  if (!classInstance)
    return res.status(404).json({ message: "Selected class is not found" });
  const subjectInstance = await Subject.findOne({
    where: { id: req.validatedData.subjectId },
  });
  if (!subjectInstance)
    return res.status(404).json({ message: "Selected subject not found" });

  const data = await Assignment.create({
    ...req.validatedData,
    tenantId: req.tenant.id,
    accountId: req.user.id,
  });
  return res
    .status(201)
    .json({ message: "Assignment created successfully", data });
});

const AssignmentUpdate = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Assignment.findOne({
    where: {
      id,
      tenantId: req.tenant.id,
    },
  });
  if (!data) return res.status(404).json({ message: "Student not found" });
  const { bloodGroup, bio, profilePicture, ...rest } = req.validatedData;
  data.updateFormData(rest);
  await data.save();
  data.studentProfile.updateFormData({ bloodGroup, bio, profilePicture });
  return res
    .status(200)
    .json({ message: "Student data updated successfully", data });
});

const AssignmentDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const student = await Account.findOne({
    where: { id, userRole: "student", tenantId: req.tenant.id },
  });
  if (!student) return res.status(404).json({ message: "Student not found" });
  await student.destroy();
  return res.status(200).json({ message: "Student deleted successfully" });
});

module.exports = {
  classList,
  classView,
  AssignmentList,
  AssignmentCreate,
  AssignmentUpdate,
  AssignmentDelete,
};
