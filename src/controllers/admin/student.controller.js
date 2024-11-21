require("dotenv").config();
const { tryCatch } = require("../../utils/handlers/tryCatch");
const {
  Account,
  Student,
  Attendance,
  MedicalRecord,
  Award,
} = require("../../models");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Interest } = require("../../models/core");
const { calculateTotalPages } = require("../../utils/handlers");
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
      attributes: ["profilePicture", "bio", "bloodGroup"],
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

const attendanceList = tryCatch(async (req, res, next) => {
  const { studentId } = req.params;
  const { page = 1, size = 10 } = req.query;
  const offset = (page - 1) * size;
  const { rows: data, count } = await Attendance.findAndCountAll({
    page,
    offset,
    where: { studentId, tenantId: req.tenant.id },
    attributes: ["id", "date", "status"],
  });
  return res.status(200).json({
    data,
    total: count,
    currentPage: page,
    totalPages: calculateTotalPages(count, limit),
    size: size,
    message: "Attendance Fetched Successfully",
  });
});

const attendanceCreate = tryCatch(async (req, res, next) => {
  const { studentId } = req.params;
  const data = await Attendance.create({
    studentId,
    ...req.validatedData,
    tenantId: req.tenant.id,
  });
  return res
    .status(201)
    .json({ data, message: "Attendance Created Successfully" });
});

const attendanceView = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Attendance.findOne({
    id,
    tenantId: req.tenant.id,
    attributes: ["id", "date", "status"],
  });
  if (!data) return res.status(404).json({ message: "Attendance not Found.!" });
  return res
    .status(200)
    .json({ data, message: "Attendance Fetched Successfully.!" });
});

const attendanceUpdate = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Attendance.findOne({
    where: { id, tenantId: req.tenant.id },
    attributes: ["id", "date", "status"],
  });
  if (!data)
    return res.status(404).json({ message: "Attendance not Found.!!" });
  data.updateFormData(req.validatedData);
  await data.save();
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
        through: { attributes: [] }, // Exclude join table attributes
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
  const [studentData, attendanceData, medicalData, interestData, awardData] =
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
        attributes: [
          "fullName",
          "firstName",
          "lastName",
          "email",
          "username",
          "phoneNumber",
          "dateOfBirth",
        ],
      }),
      Attendance.findAll({
        where: { studentId: id, tenantId: req.tenant.id },
        attributes: ["id", "date", "status"],
      }),
      MedicalRecord.findAll({
        where: { studentId: id, tenantId: req.tenant.id },
        attributes: {
          exclude: ["createdAt", "deletedAt", "updatedAt", "tenantId"],
        },
      }),
      Interest.findAll({
        include: {
          model: Student,
          where: { id },
          attributes: [],
          through: { attributes: [] },
        },
        attributes: ["id", "name"],
      }),
      Award.findAll({
        where: { studentId: id, tenantId: req.tenant.id },
        attributes: {
          exclude: ["createdAt", "deletedAt", "updatedAt", "tenantId"],
        },
      }),
    ]);

  const plainStudentData = studentData
    ? studentData.get({ plain: true })
    : null;
  const plainAttendanceData = attendanceData
    ? attendanceData.map((item) => item.get({ plain: true }))
    : null;
  const plainMedicalData = medicalData
    ? medicalData.map((item) => item.get({ plain: true }))
    : null;
  const plainInterestData = interestData
    ? interestData.map((item) => item.get({ plain: true }))
    : null;

  const plainAwardData = awardData
    ? awardData.map((item) => item.get({ plain: true }))
    : null;

  console.log(plainStudentData, "studentData");
  console.log(plainAttendanceData, "attendanceData");
  console.log(plainMedicalData, "medicalData");
  console.log(plainInterestData, "interestData");
  console.log(plainAwardData, "interestData");

  const promptResult1 = await model.generateContent(
    `${JSON.stringify({ ...plainStudentData, ...plainAttendanceData, ...plainMedicalData, ...plainInterestData, ...plainAwardData })} Based on the student's interests and outstanding academic performance, what potential career paths could lead to success?`
  );
  const promptResult2 = await model.generateContent(
    `${JSON.stringify({ ...plainStudentData, ...plainAttendanceData, ...plainMedicalData, ...plainInterestData, ...plainAwardData })} Based on the student's physical strength what are the sports career that he can choose.`
  );
  const promptResult3 = await model.generateContent(
    `${JSON.stringify({ ...plainStudentData, ...plainAttendanceData, ...plainMedicalData, ...plainInterestData, ...plainAwardData })} Based on the student's medical record and his interest is he fit for the olympics championship`
  );
  return res.status(200).json({
    message: "Data Fetched Successfully",
    data: [
      {
        id: 1,
        prompt:
          "Based on the student's interests and outstanding academic performance, what potential career paths could lead to success?",
        result: promptResult1,
      },
      {
        id: 2,
        prompt:
          "Based on the student's physical strength what are the sports career that he can choose.",
        promptResult2,
      },
      {
        id: 3,
        prompt: "",
        result: promptResult3,
      },
    ],
  });
});

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
  attendanceView,
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
};
