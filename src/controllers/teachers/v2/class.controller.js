const {
  Class,
  ClassTeacher,
  Teacher,
  Subject,
  Exam,
  ExamSubject,
} = require("../../../models");
const { Assignment } = require("../../../models/classes/class.model");
const { tryCatch, calculateTotalPages } = require("../../../utils/handlers");

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
      attributes: ["id", "teacherRole"],
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

const classView = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Class.findOne({
    where: { tenantId: req.tenant.id, id },
    attributes: ["id", "name", "section"],
    include: [
      {
        model: Subject,
        as: "Subjects",
        attributes: ["id", "name", "code"],
        through: {
          attributes: [],
        },
      },
    ],
    group: ["Class.id", "Subjects.id"],
  });
  if (!data) return res.status(404).json({ message: "Class not found" });
  return res.status(200).json({
    data,
    version: 2,
    message: "Class data fetched Successfully",
  });
});

const AssignmentList = tryCatch(async (req, res, next) => {
  const { page = 1, size: limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  // Find the teacher instance associated with the logged-in user
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

  const classIds = classList.map((cls) => cls.classId); // Extract class IDs

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
  if (!data) return res.status(404).json({ message: "Assignment not found" });
  data.updateFormData(req.validatedData);
  await data.save();
  return res
    .status(200)
    .json({ message: "Assignment data updated successfully", data });
});

const AssignmentDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const assignment = await Assignment.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!assignment)
    return res.status(404).json({ message: "Assignment not found" });
  await assignment.destroy();
  return res.status(200).json({ message: "Assignment deleted successfully" });
});

const ExamList = tryCatch(async (req, res, next) => {
  const { page = 1, size: limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const { rows: data, count } = await Exam.findAndCountAll({
    page,
    offset,
    where: { createdBy: req.user.id, tenantId: req.tenant.id },
    include: {
      model: ExamSubject,
      as: "examSubjects",
    },
  });
  return res
    .status(200)
    .json({ message: "Exam fetched Successfully", data, totalCount: count });
});

const ExamCreate = tryCatch(async (req, res, next) => {
  const data = await Exam.create({
    ...req.validatedData,
    tenantId: req.tenant.id,
    assignedBy: req.user.id,
  });
  return res.status(201).json({ message: "Exam created Successfully", data });
});

const ExamUpdate = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const examInstance = await Exam.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!examInstance)
    return res.status(404).json({ message: "Exam not found.!!" });
  if (examInstance.isPublished)
    return res
      .status(400)
      .json({ message: "Exam already published you cant edit" });

  examInstance.updateFormData(req.validatedData);
  return res.status(200).json({ message: "Exam updated Successfully" });
});

const ExamDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const examInstance = await Exam.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!examInstance)
    return res.status(404).json({ message: "Exam not found.!!" });
  if (examInstance.isPublished) {
    return res
      .status(400)
      .json({ message: "Exam already published.! Cant delete" });
  }
  await examInstance.destroy();
  return res.status(200).json({ message: "Wxam deleted Successfully" });
});

const ExamSubjectCreate = tryCatch(async (req, res, next) => {
  // Exam id
  const { id } = req.params;
  const examInstance = await Exam.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!examInstance)
    return res.status(404).json({ message: "Exam not found.!" });
  const { isPublished, ...examSubject } = req.validatedData;
  const data = await ExamSubject.create({
    examSubject,
    tenantId: req.tenant.id,
    examId: examInstance.id,
  });
  examInstance.isPublished = isPublished;
  examInstance.save();
  return res
    .status(201)
    .json({ message: "Exam subject created Successfully.!" }, data);
});

const getClassStudents = () => {};

module.exports = {
  classList,
  classView,
  AssignmentList,
  AssignmentCreate,
  AssignmentUpdate,
  AssignmentDelete,
  ExamList,
  ExamCreate,
  ExamUpdate,
  ExamDelete,
  ExamSubjectCreate,
};
