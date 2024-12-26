const { Sequelize } = require("sequelize");
const {
  ClassTeacher,
  Teacher,
  Student,
  Account,
  Class,
  Subject,
  Attendance,
  StudentExamScore,
  ExamSubject,
  Exam,
} = require("../../../models");
const { tryCatch, calculateTotalPages } = require("../../../utils/handlers");
const { Assignment } = require("../../../models/classes/class.model");

const TeacherList = tryCatch(async (req, res, next) => {
  const user = await Student.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
  });
  if (!user) return res.status(404).json({ message: "User not found.!" });
  const classTeachers = await ClassTeacher.findAll({
    where: { classId: user.classId },
    include: [
      {
        model: Teacher,
        include: [
          {
            model: Account,
            as: "accountDetails",
          },
        ],
      },
      {
        model: Class,
        attributes: ["name"],
      },
      {
        model: Subject,
        attributes: ["name"],
      },
    ],
  });

  const teacherData = classTeachers.map((classTeacher) => {
    const teacher = classTeacher.Teacher;
    const account = teacher.accountDetails;
    return {
      id: account.id,
      teacherName: account.fullName,
      bloodGroup: teacher.bloodGroup,
      profilePicture: teacher.profilePicture,
      teacherRole: classTeacher.teacherRole,
      email: account ? account.email : null,
      subjectName: classTeacher.Subject ? classTeacher.Subject.name : null,
      className: classTeacher.Class ? classTeacher.Class.name : null,
    };
  });
  return res.status(200).json({
    message: "Teacher fetched successfully",
    data: teacherData,
    version: "v2",
  });
});

const ClassmatesList = tryCatch(async (req, res, next) => {
  const user = await Student.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
  });
  if (!user) return res.status(404).json({ message: "User not found.!" });
  const data = await Student.findAll({
    where: { classId: user.classId, tenantId: req.tenant.id },
    include: [
      {
        model: Account,
        as: "accounts",
        attributes: [
          "firstName",
          "lastName",
          "fullName",
          "username",
          "email",
          "phoneNumber",
          "dateOfBirth",
        ],
      },
    ],
    attributes: ["id", "profilePicture", "bio", "bloodGroup"],
  });
  return res.status(200).json({ message: "Student listed successfully", data });
});

const AttendanceList = tryCatch(async (req, res, next) => {
  const student = await Student.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
    attributes: ["id", "accountId"],
  });
  if (!student)
    return res.status(404).json({ message: "Requested student not found.!" });
  const { page = 1, size: limit = 100 } = req.query;
  const offset = (page - 1) * limit;
  const { rows: data, count } = await Attendance.findAndCountAll({
    page,
    offset,
    where: {
      studentId: student.id,
      tenantId: req.tenant.id,
    },
    attributes: [
      "id",
      "attendanceDate",
      "status",
      "checkIn",
      "checkOut",
      [Sequelize.fn("COUNT", Sequelize.col("status")), "count"],
      "status",
    ],
    group: ["status", "attendanceDate", "checkIn", "checkOut", "id"],
  });

  const attendanceData = {
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
  };

  data.forEach((record) => {
    if (record.status === "present") {
      attendanceData.present++;
    } else if (record.status === "absent") {
      attendanceData.absent++;
    } else if (record.status === "excused") {
      attendanceData.excused++;
    } else if (record.status === "late") {
      attendanceData.late++;
    }
  });

  return res.status(200).json({
    data,
    total: count,
    currentPage: page,
    totalPages: calculateTotalPages(count, limit),
    size: limit,
    stats: attendanceData,
    message: "Attendance Fetched Successfully",
  });
});

const MarksList = tryCatch(async (req, res, next) => {
  const student = await Student.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
  });

  if (!student)
    return res.status(404).json({ message: "Requested student not found" });
  const score = await StudentExamScore.findAll({
    where: { studentId: student.id },
    include: [
      {
        model: ExamSubject,
        as: "examSubjects",
        include: [
          {
            model: Exam,
            as: "exam",
          },
          {
            model: Subject,
          },
        ],
      },
    ],
  });

  const data = score.map((entry) => {
    const examSubject = entry.examSubjects;
    const exam = examSubject.exam;
    const subject = examSubject.Subject;

    return {
      id: entry.id,
      marksObtained: entry.marksObtained,
      grade: entry.grade,
      examName: exam.name,
      examDate: examSubject.examDate,
      subjectName: subject.name,
      subjectCode: subject.code,
      startTime: examSubject.startTime,
      endTime: examSubject.endTime,
      maxScore: examSubject.maxScore,
    };
  });
  return res.status(200).json({ message: "Marks fetched Successfully", data });
});

const ExamList = tryCatch(async (req, res, next) => {
  const student = await Student.findOne({
    where: {
      accountId: req.user.id,
      tenantId: req.tenant.id,
    },
  });
  if (!student) return res.status(200).json({ message: "Student not found" });
  const data = await Exam.findAll({
    where: {
      classId: student.classId,
    },
  });
  return res
    .status(200)
    .json({ message: "Exam's fetched successfully.!", data });
});

const AssignmentList = tryCatch(async (req, res, next) => {
  const student = await Student.findOne({
    where: {
      accountId: req.user.id,
      tenantId: req.tenant.id,
    },
  });
  if (!student) return res.status(200).json({ message: "Student not found" });
  const data = await Assignment.findAll({
    where: {
      classId: student.classId,
    },
  });
  return res
    .status(200)
    .json({ message: "Assignment's fetched successfully.!", data });
});
module.exports = {
  TeacherList,
  ClassmatesList,
  AttendanceList,
  MarksList,
  ExamList,
  AssignmentList,
};
