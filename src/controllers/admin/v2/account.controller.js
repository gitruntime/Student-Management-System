const { Op, Sequelize, fn, col } = require("sequelize");
const {
  Account,
  Attendance,
  StudentExamScore,
  ExamSubject,
} = require("../../../models");
const { Event, Subject } = require("../../../models/classes");
const { tryCatch } = require("../../../utils/handlers");
const { db: sequelize } = require("../../../configs/db.config");

const calculateGrowth = (current, previous) => {
  if (!previous || previous === 0) {
    return "N/A"; // Prevent division by zero
  }
  return (((current - previous) / previous) * 100).toFixed(1); // Growth percentage
};

const getLastMonthRange = () => {
  const now = new Date();
  const firstDayOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfLastMonth = new Date(firstDayOfThisMonth - 1);
  const firstDayOfLastMonth = new Date(
    lastDayOfLastMonth.getFullYear(),
    lastDayOfLastMonth.getMonth(),
    1
  );

  return [firstDayOfLastMonth, lastDayOfLastMonth];
};

const Dashboard = tryCatch(async (req, res, next) => {
  const totalStudents = await Account.count({
    where: { userRole: "student", tenantId: req.tenant.id },
  });

  const lastMonthRange = getLastMonthRange();

  const lastMonthStudents = await Account.count({
    where: {
      userRole: "student",
      tenantId: req.tenant.id,
      createdAt: {
        [Op.between]: lastMonthRange,
      },
    },
  });

  const totalTeachers = await Account.count({
    where: {
      userRole: "teacher",
      tenantId: req.tenant.id,
    },
  });

  const newTeachersThisMonth = await Account.count({
    where: {
      userRole: "teacher",
      tenantId: req.tenant.id,
      createdAt: {
        [Op.between]: [
          new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          new Date(),
        ],
      },
    },
  });

  const totalClasses = await Attendance.count({
    where: { tenantId: req.tenant.id },
  });

  const attendedClasses = await Attendance.count({
    where: { tenantId: req.tenant.id, status: "present" },
  });

  const averageAttendance = (attendedClasses / totalClasses) * 100;

  // Attendance growth from last week
  const lastWeekAttendance = await Attendance.count({
    where: {
      tenantId: req.tenant.id,
      status: "present",
      attendanceDate: {
        [Op.between]: [
          new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
          new Date(),
        ],
      },
    },
  });

  const upcomingEvents = await Event.count({
    where: {
      tenantId: req.tenant.id,
      date: {
        [Op.gt]: new Date(),
      },
    },
  });

  const nextEvent = await Event.findOne({
    where: {
      tenantId: req.tenant.id,
      date: {
        [Op.gt]: new Date(),
      },
    },
    order: [["date", "ASC"]],
  });

  const nextEventInDays = nextEvent
    ? Math.ceil((new Date(nextEvent.date) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  const academicPerformanceData = await StudentExamScore.findAll({
    attributes: [
      [sequelize.fn("AVG", sequelize.col("marks_obtained")), "averageMarks"],
      "examSubjects.id",
      "examSubjects.tenant_id",
      "examSubjects.exam_date",
      "examSubjects.start_time",
      "examSubjects.end_time",
      "examSubjects.max_score",
    ],
    include: [
      {
        model: ExamSubject,
        as: "examSubjects", // Alias should match the defined alias
        attributes: [
          "id",
          "tenantId",
          "examDate",
          "startTime",
          "endTime",
          "maxScore",
        ],
        include: [
          {
            model: Subject,
            attributes: ["id", "name", "code"],
          },
        ],
      },
    ],
    group: [
      "examSubjects.id",
      "examSubjects.tenant_id",
      "examSubjects.exam_date",
      "examSubjects.start_time",
      "examSubjects.end_time",
      "examSubjects.max_score",
      "examSubjects->Subject.id",
      "examSubjects->Subject.name",
      "examSubjects->Subject.code",
    ],
    raw: true,
  });

  const attendanceOverview = await Attendance.findAll({
    attributes: [
      [fn("DATE_TRUNC", "month", col("attendance_date")), "month"],
      [
        Sequelize.literal(`
          ROUND(
            (SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) * 100.0) / COUNT(status), 2
          )
        `),
        "attendance_percentage",
      ],
    ],
    where: {
      tenantId: req.tenant.id,
    },
    group: [fn("DATE_TRUNC", "month", col("attendance_date"))],
    order: [[fn("DATE_TRUNC", "month", col("attendance_date")), "ASC"]],
  });

  const attendanceData = attendanceOverview.map((entry) => ({
    month: entry.getDataValue("month"),
    userType: entry.getDataValue("user_type"),
    attendancePercentage: entry.getDataValue("attendance_percentage"),
  }));

  const data = {
    totalStudents: {
      count: totalStudents,
      growth: calculateGrowth(totalStudents, lastMonthStudents),
    },
    totalTeachers: {
      count: totalTeachers,
      newThisMonth: newTeachersThisMonth,
    },
    averageAttendance: {
      percentage: averageAttendance.toFixed(1),
      growth: calculateGrowth(averageAttendance, lastWeekAttendance),
    },
    upcomingEvents: {
      count: upcomingEvents,
      nextInDays: nextEventInDays,
    },
    academicPerformance: academicPerformanceData.map((record) => ({
      averageMarks: parseFloat(record["averageMarks"]).toFixed(2),
      subject: record["examSubjects.Subject.name"],
      code: record["examSubjects.Subject.code"],
    })),
    attendanceData,
  };

  return res.status(200).json({
    message: "Dashboard fetched successfully.!",
    data,
  });
});

module.exports = {
  Dashboard,
};
