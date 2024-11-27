require("dotenv").config();
const { tryCatch } = require("../../utils/handlers/tryCatch");
const {
  Account,
  Student,
  Attendance,
  MedicalRecord,
  Award,
  Address,
  StudentExamScore,
  ExamSubject,
  Exam,
  Subject,
} = require("../../models");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Interest } = require("../../models/core");
const { calculateTotalPages } = require("../../utils/handlers");
const { Sequelize, Op } = require("sequelize");
const ENV = process.env;
const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const studentList = tryCatch(async (req, res, next) => {
  const { page = 1, size: limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const { count, rows: data } = await Account.findAndCountAll({
    page,
    offset,
    where: { userRole: "student", tenantId: req.tenant.id },
    include: {
      model: Student,
      as: "studentProfile",
      attributes: ["profilePicture", "bio", "bloodGroup", "classId"],
    },
    attributes: [
      "id",
      "fullName",
      "firstName",
      "lastName",
      "email",
      "username",
      "phoneNumber",
      "dateOfBirth",
    ],
  });
  return res.status(200).json({
    data,
    totalRecords: count,
    totalPages: calculateTotalPages(count, limit),
    currentPage: page,
    size: limit,
  });
});

const studentCreate = tryCatch(async (req, res, next) => {
  const data = await Account.create({
    ...req.validatedData,
    userRole: "student",
    tenantId: req.tenant.id,
  });
  return res
    .status(201)
    .json({ message: "Student created successfully", data });
});

const studentView = tryCatch(async (req, res, next) => {
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

const studentUpdate = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Account.findOne({
    where: {
      id,
      userRole: "student",
    },
    include: [
      {
        model: Student,
        as: "students",
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

const studentDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const student = await Account.findOne({
    where: { id, userRole: "student", tenantId: req.tenant.id },
  });
  if (!student) return res.status(404).json({ message: "Student not found" });
  await student.destroy();
  return res.status(200).json({ message: "Student deleted successfully" });
});

const addressList = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const student = await Student.findOne({
    where: { accountId: id, tenantId: req.tenant.id },
    attributes: ["accountId"],
  });
  const data = await Address.findAll({
    where: { accountId: student.accountId, tenantId: req.tenant.id },
    attributes: [
      "id",
      "city",
      "state",
      "pincode",
      "streetAddress",
      "country",
      "phoneNumber",
      "addressType",
    ],
  });
  return res.status(200).json({
    data,
    message: "Address Fetched Successfully",
  });
});

const attendanceList = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const student = await Student.findOne({
    where: { accountId: id, tenantId: req.tenant.id },
    attributes: ["id", "accountId"],
  });
  if (!student)
    return res.status(404).json({ message: "Requested student not found.!" });
  const {
    page = 1,
    size: limit = 100,
    startDate = new Date("2024-01-01"),
    endDate = new Date("2025-01-01"),
  } = req.query;
  const offset = (page - 1) * limit;
  const { rows: data, count } = await Attendance.findAndCountAll({
    page,
    offset,
    where: {
      studentId: student.id,
      tenantId: req.tenant.id,
      attendanceDate: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
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

const attendanceCreate = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const student = await Student.findOne({
    where: { accountId: id, tenantId: req.tenant.id },
    attributes: ["id", "accountId"],
  });
  if (!student)
    return res.status(404).json({ message: "Requested student not found.!" });
  const data = await Attendance.create({
    studentId: student.id,
    ...req.validatedData,
    tenantId: req.tenant.id,
  });
  return res
    .status(201)
    .json({ data, message: "Attendance Created Successfully" });
});

const attendanceUpdate = tryCatch(async (req, res, next) => {
  const { id, studentId } = req.params;
  const student = await Student.findOne({
    where: { accountId: studentId, tenantId: req.tenant.id },
    attributes: ["id", "accountId"],
  });
  if (!student)
    return res.status(404).json({ message: "Requested student not found.!" });
  const data = await Attendance.findOne({
    where: { id, tenantId: req.tenant.id, studentId: student.id },
    attributes: ["id", "attendanceDate", "status"],
  });
  if (!data)
    return res.status(404).json({ message: "Attendance not Found.!!" });
  data.updateFormData(req.validatedData);
  return res
    .status(200)
    .json({ data, message: "Attendance Updated Successfully.!!" });
});

const attendanceDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Attendance.findOne({
    where: { id, tenantId: req.tenant.id },
    attributes: ["id", "date", "status"],
  });
  if (!data)
    return res.status(404).json({ message: "Attendance not Found.!!" });
  await data.destroy();
  return res
    .status(200)
    .json({ data, message: "Attendance Deleted Successfully.!!" });
});

const interestList = tryCatch(async (req, res, next) => {
  const { studentId } = req.params;
  const student = await Student.findOne({
    where: { id: studentId, tenantId: req.tenant.id },
    include: [
      {
        model: Interest,
        through: { attributes: [] },
      },
    ],
  });
  if (!student) return res.status(404).json({ message: "Student not Found.!" });
  const interests = student.Interests;
  return res.status(200).json({
    message: "Interests fetched successfully.",
    data: interests,
  });
});

const interestAdd = tryCatch(async (req, res, next) => {
  const { studentId } = req.params;
  const student = await Student.findOne({
    where: { id, tenantId: req.tenant.id, studentId },
  });
  if (!student) return res.status(404).json({ message: "Student Not Found.!" });
  const interests = await Promise.all(
    req.validatedData.interests.map(async (name) => {
      const [interest, created] = await Interest.findOrCreate({
        where: { name: name },
      });
      return interest;
    })
  );
  const interestIds = interests.map((interest) => interest.id);
  await student.addInterest(interestIds);
  return res
    .status(201)
    .json({ message: "Interest Added Successfully", data: interests });
});

const interestRemove = tryCatch(async (req, res, next) => {
  const { studentId } = req.params;
  const { interestIds } = req.body;

  const student = await Student.findOne({
    where: { id: studentId, tenantId: req.tenant.id },
  });

  if (!student) {
    return res.status(404).json({ message: "Student not Found." });
  }

  const interests = await Interest.findAll({
    where: {
      id: interestIds,
    },
  });

  if (!interests)
    return res
      .status(404)
      .json({ message: "No interests found with the provided IDs." });

  await student.removeInterests(interests);

  return res.status(200).json({
    message: "Interests removed successfully.",
    data: interests,
  });
});

const medicalRecordList = tryCatch(async (req, res, next) => {
  const { studentId } = req.params;
  const { page = 1, size = 10 } = req.query;
  const offset = (page - 1) * size;
  const { rows: data, count } = await MedicalRecord.findAndCountAll({
    page,
    offset,
    where: { studentId, tenantId: req.tenant.id },
    attributes: {
      exclude: ["deletedAt"],
    },
  });
  return res.status(200).json({
    data,
    total: count,
    currentPage: page,
    totalPages: calculateTotalPages(count, limit),
    size: size,
    message: "Medical Record Fetched Successfully",
  });
});

const medicalRecordCreate = tryCatch(async (req, res, next) => {
  const { studentId } = req.params;
  const data = await MedicalRecord.create({
    studentId,
    tenantId: req.tenant.id,
    ...req.validatedData,
  });
  return res
    .status(201)
    .json({ message: "Medical Record Created Successfully.!", data });
});

const medicalRecordView = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await MedicalRecord.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!data)
    return res.status(404).json({ message: "Medical Record not Found.!" });
  return res
    .status(200)
    .json({ data, message: "Medical Record Fetched Successfully.!!" });
});

const medicalRecordUpdate = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await MedicalRecord.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!data)
    return res.status(404).json({ message: "Medical Record not Found" });
  data.updateFormData(req.validatedData);
  await data.save();
  return res
    .status(200)
    .json({ message: "Medical Record Fetched Successfully.!!", data });
});

const medicalRecordDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await MedicalRecord.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!data)
    return res
      .status(404)
      .json({ data, message: "Medical Record not Found.!" });
  await data.destroy();
  return res
    .status(200)
    .json({ message: "Medical Record Deleted Successfully.!!" });
});

const AwardList = tryCatch(async (req, res, next) => {
  const { studentId } = req.params;
  const { page = 1, size = 10 } = req.query;
  const offset = (page - 1) * size;
  const { rows: data, count } = await Award.findAndCountAll({
    page,
    offset,
    where: { studentId, tenantId: req.tenant.id },
    attributes: {
      exclude: ["deletedAt"],
    },
  });
  return res.status(200).json({
    data,
    total: count,
    currentPage: page,
    totalPages: calculateTotalPages(count, limit),
    size: size,
    message: "Medical Record Fetched Successfully",
  });
});

const AwardCreate = tryCatch(async (req, res, next) => {
  const { studentId } = req.params;
  const data = await Award.create({
    tenantId: req.tenant.id,
    studentId,
    ...req.validatedData,
  });
  return res.status(201).json({
    data,
    message: "Award created successfully",
  });
});
const AwardView = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Award.findOne({ where: { id, tenantId: req.tenant.id } });
  if (!data) return res.status(404).json({ message: "Award not found" });
  return res.status(200).json({ data, message: "Award fetched successfully" });
});

const AwardUpdate = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Award.findOne({ where: { id, tenantId: req.tenant.id } });
  if (!data) return res.status(404).json({ message: "Award not found" });
  data.updateFormData(req.validatedData);
  await data.save();
  return res
    .status(200)
    .json({ data, message: "Award Updated Successfully.!!" });
});
const AwardDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Award.findOne({ where: { id, tenantId: req.tenant.id } });
  if (!data) return res.status(404).json({ message: "Award not found" });
  await data.destroy();
  return res.status(200).json({ message: "Award Deleted Successfully.!!" });
});

const aiDashboard = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const student = await Student.findOne({
    where: { accountId: id, tenantId: req.tenant.id },
    attributes: ["id", "accountId"],
  });
  const [studentData, attendanceData, interestData, examScoreData] =
    await Promise.all([
      Account.findOne({
        where: { id, tenantId: req.tenant.id },
        include: {
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
        attributes: ["fullName", "firstName", "lastName", "dateOfBirth"],
      }),
      Attendance.findAll({
        where: { studentId: student.id, tenantId: req.tenant.id },
        attributes: ["id", "attendanceDate", "status"],
      }),
      Account.findOne({
        where: { id },
        include: [
          {
            model: Interest,
            through: { attributes: [] },
          },
        ],
        attributes: ["id"],
      }),
      StudentExamScore.findAll({
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
      }),
      // MedicalRecord.findAll({
      //   where: { studentId: id, tenantId: req.tenant.id },
      //   attributes: {
      //     exclude: ["createdAt", "deletedAt", "updatedAt", "tenantId"],
      //   },
      // }),
      // Interest.findAll({
      //   include: {
      //     model: Account,
      //     where: { id },
      //     attributes: [],
      //     through: { attributes: [] },
      //   },
      //   attributes: ["id", "name"],
      // }),
      // Award.findAll({
      //   where: { studentId: id, tenantId: req.tenant.id },
      //   attributes: {
      //     exclude: ["createdAt", "deletedAt", "updatedAt", "tenantId"],
      //   },
      // }),
    ]);

  const plainStudentData = studentData
    ? studentData.get({ plain: true })
    : null;
  const plainAttendanceData = attendanceData
    ? attendanceData.map((item) => item.get({ plain: true }))
    : null;
  const plainExamScoreData = examScoreData
    ? examScoreData.map((item) => item.get({ plain: true }))
    : null;
  const plainInterestData = interestData
    ? interestData?.Interests.map((item) => item.get({ plain: true }))
    : null;

  // const plainAwardData = awardData
  //   ? awardData.map((item) => item.get({ plain: true }))
  //   : null;

  console.log(plainStudentData, "studentData");
  console.log(plainAttendanceData, "attendanceData");
  console.log(plainExamScoreData, "examScoreData");
  console.log(plainInterestData, "interestData");
  // console.log(plainAwardData, "interestData");

  // const promptResult1 = await model.generateContent(
  //   `${JSON.stringify({ ...plainStudentData, ...plainAttendanceData, ...plainInterestData })} Analyze his profile, considering his academic performance, extracurricular activities, and stated interests. Assess his aptitude, logical thinking, creativity, analytical skills, collaboration, technical skills, and curiosity. Provide a percentage-based rating for each skill. Additionally, suggest 5 potential career paths based on his strengths and interests.`
  // );
  const promptResult2 = await model.generateContent(
    `${JSON.stringify({ ...plainStudentData, ...plainAttendanceData, ...plainInterestData })} Generate chart data in JSON format for Analyze his profile, considering his academic performance, extracurricular activities, and stated interests. Assess his aptitude, logical thinking, creativity, analytical skills, collaboration, technical skills, and curiosity. Provide a percentage-based rating for each skill. Additionally, suggest 5 potential career paths based on his strengths and interests.
    Give me the output based on the below structure with tailwind color.
          const chartData = [  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },  { browser: "other", visitors: 190, fill: "var(--color-other)" },]
    `
  );
  // const promptResult3 = await model.generateContent(
  //   `${JSON.stringify({ ...plainStudentData, ...plainAttendanceData, ...plainInterestData })} What is a realistic timeline to become an AI/ML engineer? Please outline the key steps, including essential skills, certifications, and practical experience. What are the potential challenges and strategies to overcome them?`
  // );
  return res.status(200).json({
    message: "Data Fetched Successfully",
    data: [
      // {
      //   id: 1,
      //   prompt:
      //     "Analyze his profile, considering his academic performance, extracurricular activities, and stated interests. Assess his aptitude, logical thinking, creativity, analytical skills, collaboration, technical skills, and curiosity. Provide a percentage-based rating for each skill. Additionally, suggest 5 potential career paths based on his strengths and interests.",
      //   result: promptResult1.response.text(),
      // },
      {
        id: 2,
        prompt: `Analyze his profile, considering his academic performance, extracurricular activities, and stated interests. Assess his aptitude, logical thinking, creativity, analytical skills, collaboration, technical skills, and curiosity. Provide a percentage-based rating for each skill. Additionally, suggest 5 potential career paths based on his strengths and interests.
          
          
          `,
        result: promptResult2.response.text(),
      },
      // {
      //   id: 3,
      //   prompt:
      //     "What is a realistic timeline to become an AI/ML engineer? Please outline the key steps, including essential skills, certifications, and practical experience. What are the potential challenges and strategies to overcome them?",
      //   result: promptResult3.response.text(),
      // },
    ],
  });
});

const ListMarks = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const student = await Student.findOne({
    where: { accountId: id, tenantId: req.tenant.id },
  });
  console.log(student);

  if (!student)
    return res.status(404).json({ message: "Requested student not found" });
  const data = await StudentExamScore.findAll({
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
  return res.status(200).json({ message: "Marks fetched Successfully", data });
});

const CreateMarks = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const student = await Student.findOne({
    where: { accountId: id, tenantId: req.tenant.id },
  });
  if (!student)
    return res.status(404).json({ message: "Requested student not found" });

  const data = await StudentExamScore.create({
    ...req.validatedData,
    studentId: student.id,
    tenantId: req.tenant.id,
  });

  return res.status(201).json({ message: "Mark created successfully.", data });
});

const UpdateMarks = tryCatch(async (req, res, next) => {
  const student = await Student.findOne({
    where: { accountId: id, tenantId: req.tenant.id },
  });
  if (!student)
    return res.status(404).json({ message: "Requested student not found" });

  const data = await StudentExamScore.findOne;

  return res.status(201).json({ message: "Mark created successfully.", data });
});

const InterestList = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const user = await Account.findOne({
    where: { id, tenantId: req.tenant.id },
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

const ListAward = tryCatch(async (req, res, next) => {});
const CreateAward = tryCatch(async (req, res, next) => {});
const UpdateAward = tryCatch(async (req, res, next) => {});
const DeleteAward = tryCatch(async (req, res, next) => {});

module.exports = {
  studentList,
  studentCreate,
  studentView,
  studentUpdate,
  studentDelete,
  interestList,
  interestAdd,
  interestRemove,
  attendanceList,
  attendanceCreate,
  addressList,
  attendanceUpdate,
  attendanceDelete,
  medicalRecordList,
  medicalRecordCreate,
  medicalRecordView,
  medicalRecordUpdate,
  medicalRecordDelete,
  AwardList,
  AwardCreate,
  AwardView,
  AwardUpdate,
  AwardDelete,
  aiDashboard,
  ListMarks,
  CreateMarks,
  InterestList,
};
