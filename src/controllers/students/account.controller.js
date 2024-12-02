const { Sequelize } = require("sequelize");
const {
  Account,
  Student,
  Address,
  ClassTeacher,
  StudentExamScore,
  Subject,
  ClassSubject,
  Exam,
  ExamSubject,
} = require("../../models");
const { Interest } = require("../../models/core");
const { Goal, Volunteer } = require("../../models/students/academic.model");
const { tryCatch } = require("../../utils/handlers");

const ViewProfileData = tryCatch(async (req, res, next) => {
  const data = await Account.findOne({
    where: { id: req.user.id, tenantId: req.tenant.id },
    include: [
      {
        model: Student,
        as: "studentProfile",
        attributes: ["bio", "profilePicture", "bio", "bloodGroup"],
      },
    ],
    attributes: [
      "id",
      "firstName",
      "lastName",
      "fullName",
      "username",
      "email",
      "dateOfBirth",
    ],
  });
  if (!data)
    return res.status(404).json({
      message:
        "User not found please contact with your school admin/school teacher",
    });

  return res.status(200).json({ message: "Data fetched Successfully", data });
});

const UpdateProfileData = tryCatch(async (req, res, next) => {
  const data = await Account.findOne({
    where: { id: req.user.id, tenantId: req.tenant.id },
    include: [
      {
        model: Student,
        as: "studentProfile",
      },
    ],
  });
  if (!data)
    return res.status(404).json({
      message:
        "User not found please contact with your school admin/school teacher",
    });
  const { bio, bloodGroup, ...accountDetails } = req.validatedData;
  data.updateFormData(accountDetails);
  data.save();
  data.studentProfile.updateFormData({ bio, bloodGroup });
  data.studentProfile.save();
  return res
    .status(200)
    .json({ message: "Profile Data updated Succcessfully", data });
});

const AddressList = tryCatch(async (req, res, next) => {
  const data = await Address.findAll({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
  });
  return res.status(200).json({
    data,
    message: "Subject data fetched Successfully",
  });
});

const AddressCreate = tryCatch(async (req, res, next) => {
  const data = await Address.create({
    ...req.validatedData,
    tenantId: req.tenant.id,
    accountId: req.user.id,
  });
  return res
    .status(201)
    .json({ message: "Address created successfully", data });
});

const AddressUpdate = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Address.findOne({
    where: { id, tenantId: req.tenant.id, accountId: req.user.id },
  });
  if (!data) return res.status(404).json({ message: "Address not found" });
  data.updateFormData(req.validatedData);
  await data.save();
  return res
    .status(200)
    .json({ message: "Address updated successfully", data });
});
const AddressDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Address.findOne({
    where: { id, accountId: req.user.id, tenantId: req.tenant.id },
  });
  if (!data) return res.status(404).json({ message: "Address not found" });
  await data.destroy();
  return res.status(200).json({ message: "Address deleted Successfully" });
});

const InterestList = tryCatch(async (req, res, next) => {
  const user = await Account.findOne({
    where: { id: req.user.id, tenantId: req.tenant.id },
    include: [
      {
        model: Interest,
        through: { attributes: [] },
      },
    ],
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  return res
    .status(200)
    .json({ message: "Interest fetched successfully", data: user.Interests });
});

const InterestCreate = tryCatch(async (req, res, next) => {
  const user = await Account.findOne({
    where: { id: req.user.id, tenantId: req.tenant.id },
  });

  if (!user) return res.status(404).json({ message: "User not found.!!" });

  const { interests } = req.validatedData;

  const interestInstances = await Promise.all(
    interests.map((interest) =>
      Interest.findOrCreate({
        where: { name: interest, tenantId: req.tenant.id },
      })
    )
  );

  await user.addInterests(interestInstances.map(([interest]) => interest));
  return res.status(201).json({ message: "Interest created Successfully" });
});

const InterestDelete = tryCatch(async (req, res, next) => {
  const user = await Account.findOne({
    where: { id: req.user.id, tenantId: req.tenant.id },
  });

  if (!user) return res.status(404).json({ message: "User not found.!!" });

  const { interests } = req.validatedData;

  console.log(interests);

  const interestInstances = await Interest.findAll({
    where: { id: interests, tenantId: req.tenant.id },
  });

  await user.removeInterests(interestInstances);
  return res.status(201).json({ message: "Interest created Successfully" });
});

const GoalList = tryCatch(async (req, res, next) => {
  const user = await Student.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
  });
  if (!user) return res.status(404).json({ message: "User not found.!" });
  const data = await Goal.findAll({
    where: { studentId: user.id, tenantId: req.tenant.id },
  });
  return res.status(200).json({ message: "Goal fetched successfully", data });
});

const GoalCreate = tryCatch(async (req, res, next) => {
  const user = await Student.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
  });
  if (!user) return res.status(404).json({ message: "User not found.!" });
  const data = await Goal.create({
    ...req.validatedData,
    tenantId: req.tenant.id,
    studentId: user.id,
  });
  return res.status(200).json({ message: "Goal created Successfully", data });
});

const GoalUpdate = tryCatch(async (req, res, next) => {
  const user = await Student.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
  });
  if (!user) return res.status(404).json({ message: "User not found.!" });
  const { id } = req.params;
  const data = await Goal.findOne({
    where: { id, tenantId: req.tenant.id, studentId: user.id },
  });
  if (!data) return res.status(404).json({ message: "Goal not found" });
  data.updateFormData(req.validatedData);
  return res.status(200).json({ message: "Goal updated Successfully" });
});

const GoalDelete = tryCatch(async (req, res, next) => {
  const user = await Student.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
  });
  if (!user) return res.status(404).json({ message: "User not found.!" });
  const { id } = req.params;
  const data = await Goal.findOne({
    where: { id, tenantId: req.tenant.id, studentId: user.id },
  });
  if (!data) return res.status(404).json({ message: "Goal not found" });
  await data.destroy();
  return res.status(200).json({ message: "Goal deleted Successfully.!" });
});

const VolunteerList = tryCatch(async (req, res, next) => {
  const user = await Student.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
  });
  if (!user) return res.status(404).json({ message: "User not found.!" });
  const data = await Volunteer.findAll({
    where: { studentId: user.id, tenantId: req.tenant.id },
  });
  return res
    .status(200)
    .json({ message: "Volunteer fetched successfully", data });
});

const VolunteerCreate = tryCatch(async (req, res, next) => {
  const user = await Student.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
  });
  if (!user) return res.status(404).json({ message: "User not found.!" });
  const data = await Volunteer.create({
    ...req.validatedData,
    tenantId: req.tenant.id,
    studentId: user.id,
  });
  return res
    .status(200)
    .json({ message: "Volunteer created Successfully", data });
});

const VolunteerUpdate = tryCatch(async (req, res, next) => {
  const user = await Student.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
  });
  if (!user) return res.status(404).json({ message: "User not found.!" });
  const { id } = req.params;
  const data = await Volunteer.findOne({
    where: { id, tenantId: req.tenant.id, studentId: user.id },
  });
  if (!data) return res.status(404).json({ message: "Volunteer not found" });
  data.updateFormData(req.validatedData);
  return res
    .status(200)
    .json({ message: "Volunteer updated Successfully", data });
});

const VolunteerDelete = tryCatch(async (req, res, next) => {
  const user = await Student.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
  });
  if (!user) return res.status(404).json({ message: "User not found.!" });
  const { id } = req.params;
  const data = await Volunteer.findOne({
    where: { id, tenantId: req.tenant.id, studentId: user.id },
  });
  if (!data) return res.status(404).json({ message: "Volunteer not found" });
  await data.destroy();
  return res.status(200).json({ message: "Volunteer deleted Successfully.!" });
});

const Dashboard = tryCatch(async (req, res, next) => {
  const student = await Student.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
  });

  const teacher = await ClassTeacher.findAll({
    where: { classId: student.classId },
  });

  const averageMarks = await StudentExamScore.findOne({
    where: { studentId: student.id },
    attributes: [
      [Sequelize.fn("AVG", Sequelize.col("marks_obtained")), "averageMarks"],
    ],
  });

  const subjectCount = await ClassSubject.count({
    where: {
      classId: student.classId, // Filter by the specific class ID
    },
  });

  const exams = await Exam.findAll({
    attributes: ["id", "startDate"],
    include: [
      {
        model: ExamSubject,
        as: "examSubjects",
        include: [
          {
            model: Subject,
            attributes: ["name"],
          },
          {
            model: StudentExamScore,
            as: "examScores",
            where: { studentId: student.id },
            attributes: ["marksObtained"],
          },
        ],
      },
    ],
  });
  
  const performanceData = {};

  exams.forEach((exam) => {
    const month = new Date(exam.startDate).toLocaleString("default", {
      month: "short",
    });

    if (!performanceData[month]) {
      performanceData[month] = {};
    }

    exam.examSubjects.forEach((examSubject) => {
      const subjectName = examSubject.Subject.name;

      if (!performanceData[month][subjectName]) {
        performanceData[month][subjectName] = { totalMarks: 0, count: 0 };
      }

      examSubject.examScores.forEach((score) => {
        performanceData[month][subjectName].totalMarks += parseFloat(
          score.marksObtained
        );
        performanceData[month][subjectName].count += 1;
      });
    });
  });

  const ScorePerformance = Object.entries(performanceData).map(
    ([month, subjects]) => {
      const entry = { month };
      for (const [subject, { totalMarks, count }] of Object.entries(subjects)) {
        entry[subject] = (totalMarks / count).toFixed(2);
      }
      return entry;
    }
  );

  const calendarMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const subjects = [
    ...new Set(
      ScorePerformance.flatMap((item) =>
        Object.keys(item).filter((key) => key !== "month")
      )
    ),
  ];

  const ScorePerformanceStructuredData = calendarMonths.map((month) => {
    const monthData = { month };
    subjects.forEach((subject) => {
      const dataForMonth = ScorePerformance.find(
        (item) => item.month === month
      );
      monthData[subject] =
        dataForMonth && dataForMonth[subject] !== undefined
          ? Number(dataForMonth[subject])
          : 0;
    });

    return monthData;
  });

  const data = {
    teacherCount: teacher.length,
    averageMarks: averageMarks ? averageMarks.get("averageMarks") : "N/A",
    subjectCount,
    ScorePerformance: ScorePerformanceStructuredData,
    exams,
  };

  return res
    .status(200)
    .json({ message: "Dashboard fetched successfully.!", data });
});
module.exports = {
  ViewProfileData,
  UpdateProfileData,
  AddressList,
  AddressCreate,
  AddressUpdate,
  AddressUpdate,
  AddressDelete,
  InterestList,
  InterestCreate,
  InterestDelete,
  GoalList,
  GoalCreate,
  GoalUpdate,
  GoalDelete,
  VolunteerList,
  VolunteerCreate,
  VolunteerUpdate,
  VolunteerDelete,
  Dashboard,
};
