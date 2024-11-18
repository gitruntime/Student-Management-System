const { Account, Student, Attendance } = require("../../models");

const { tryCatch, calculateTotalPages } = require("../../utils/handlers");
const {
  attendanceUpdate,
  attendanceDelete,
} = require("../admin/student.controller");

const StudentList = tryCatch(async (req, res, next) => {
  const { page = 1, size: limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const { count, rows: data } = await Account.findAndCountAll({
    page,
    offset,
    where: { userRole: "student", tenantId: req.tenant.id },
    include: {
      model: Student,
      as: "studentProfile",
      attributes: {
        exclude: ["tenantId", "id", "deletedAt", "classId"],
      },
    },
    attributes: {
      include: [
        "fullName",
        "firstName",
        "lastName",
        "email",
        "username",
        "phoneNumber",
        "dateOfBirth",
      ],
    },
  });
  return res.status(200).json({
    data,
    totalRecords: count,
    totalPages: calculateTotalPages(count, limit),
    currentPage: page,
    size: limit,
  });
});
const StudentCreate = tryCatch(async (req, res, next) => {
  const data = await Account.create({
    ...req.validatedData,
    userRole: "student",
    tenantId: req.tenant.id,
  });
  return res
    .status(201)
    .json({ message: "Student created successfully", data });
});
const StudentView = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Account.findOne({
    where: {
      id,
      userRole: "student",
      tenantId: req.tenant.id,
    },
    include: [
      {
        model: Student,
        as: "studentProfile",
        attributes: {
          exclude: [
            "tenantId",
            "id",
            "deletedAt",
            "classId",
            "createdAt",
            "updatedAt",
          ],
        },
      },
    ],
    attributes: [
      "id",
      "fullName",
      "firstName",
      "lastName",
      "email",
      "username",
      "phoneNumber",
      "dateOfBirth",
      "createdAt",
      "updatedAt",
    ],
  });
  if (!data) return res.status(404).json({ message: "Student not found" });
  return res
    .status(200)
    .json({ message: "Student Fetched Successfully.", data });
});
const StudentUpdate = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Account.findOne({
    where: {
      id,
      userRole: "student",
    },
    include: [
      {
        model: Student,
        as: "studentProfile",
      },
    ],
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

const StudentDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const student = await Account.findOne({
    where: { id, userRole: "student", tenantId: req.tenant.id },
  });
  if (!student) return res.status(404).json({ message: "Student not found" });
  await student.destroy();
  return res.status(200).json({ message: "Student deleted successfully" });
});

const AttendanceList = tryCatch(async (req, res, next) => {
  const { studentId } = req.params;
  const { page = 1, size: limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const studentInstance = await Student.findOne({
    page,
    offset,
    where: { accountId: studentId, tenantId: req.tenant.id },
  });
  if (!studentInstance) {
    return res.status(404).json({ message: "Student not found" });
  }
  const { rows: data, count } = await Attendance.findAndCountAll({
    where: { studentId: studentInstance.id, tenantId: req.tenant.id },
  });
  return res.status(200).json({
    data,
    total: count,
    currentPage: page,
    totalPages: calculateTotalPages(count, limit),
    size: limit,
    message: "Attendance Fetched Successfully",
  });
});
const AttendanceCreate = tryCatch(async (req, res, next) => {
  const { studentId } = req.params;
  const studentInstance = await Student.findOne({
    where: { accountId: studentId, tenantId: req.tenant.id },
  });
  if (!studentInstance) {
    return res.status(404).json({ message: "Student not found" });
  }
  const data = await Attendance.create({
    ...req.validatedData,
    studentId: studentInstance.id,
    tenantId: req.tenant.id,
  });
  return res
    .status(201)
    .json({ message: "Attendance created successfully", data });
});
const AttendanceUpdate = tryCatch(async (req, res, next) => {
  const { studentId, id } = req.params;
  console.log(id, studentId);

  const studentInstance = await Student.findOne({
    where: { accountId: studentId, tenantId: req.tenant.id },
  });
  if (!studentInstance) {
    return res.status(404).json({ message: "Student not found" });
  }
  const data = await Attendance.findOne({
    where: { id, studentId: studentInstance.id, tenantId: req.tenant.id },
  });
  if (!data) return res.status(404).json({ message: "Attendance not found" });
  data.updateFormData(req.validatedData);
  data.save();
  return res
    .status(200)
    .json({ message: "Attendance updated Successfully", data });
});
const AttendanceDelete = tryCatch(async (req, res, next) => {
  const { studentId, id } = req.params;
  const studentInstance = await Student.findOne({
    where: { accountId: studentId, tenantId: req.tenant.id },
  });
  if (!studentInstance) {
    return res.status(404).json({ message: "Student not found" });
  }
  const data = await Attendance.findOne({
    where: { id, studentId: studentInstance.id, tenantId: req.tenant.id },
  });
  if (!data) return res.status(404).json({ message: "Attendance not found" });
  data.destroy();
  return res.status(200).json({ message: "Attendance deleted Successfully" });
});

module.exports = {
  StudentList,
  StudentCreate,
  StudentView,
  StudentUpdate,
  StudentDelete,
  AttendanceList,
  AttendanceCreate,
  AttendanceUpdate,
  AttendanceDelete,
};
