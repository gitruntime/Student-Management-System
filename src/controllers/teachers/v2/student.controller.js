const { SchemaType } = require("@google/generative-ai");
const {
  Teacher,
  ClassTeacher,
  Account,
  Student,
  Class,
  Attendance,
} = require("../../../models");
const { Interest } = require("../../../models/core");
const { Goal } = require("../../../models/students/academic.model");
const { tryCatch, calculateTotalPages } = require("../../../utils/handlers");
const { getCompleteStudentData } = require("../../admin/v2/student.controller");
const { ai } = require("../../../configs/ai.config");

const StudentList = tryCatch(async (req, res, next) => {
  const { page = 1, size: limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const teacher = await Teacher.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
  });

  const classIdInstance = await ClassTeacher.findAll({
    where: { teacherId: teacher.id },
    attributes: ["classId", "teacherId"],
  });

  const classIds = classIdInstance.map((item) => item.classId);

  const { count, rows: data } = await Account.findAndCountAll({
    page,
    offset,
    where: { userRole: "student", tenantId: req.tenant.id },
    include: {
      model: Student,
      as: "studentProfile",
      where: { tenantId: req.tenant.id, classId: classIds },
      attributes: ["profilePicture", "bio", "bloodGroup"],
      include: [
        {
          model: Class,
          as: "classDetails",
          attributes: ["name", "section"],
        },
      ],
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

const StudentView = tryCatch(async (req, res, next) => {
  const { id } = req.params;

  const teacher = await Teacher.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
  });

  const classIdInstance = await ClassTeacher.findAll({
    where: { teacherId: teacher.id },
    attributes: ["classId", "teacherId"],
  });

  const classIds = classIdInstance.map((item) => item.classId);

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
          exclude: ["tenantId", "id", "deletedAt", "createdAt", "updatedAt"],
        },
        where: { classId: classIds },
        required: true, // inner join - validation : - to prevent fetching the students that is not assigned to this particular request teacher
        include: [
          {
            model: Class,
            as: "classDetails",
            attributes: ["id", "name", "section"],
          },
        ],
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
  if (!data)
    return res
      .status(404)
      .json({ message: "Student not found", version: "v2" });
  return res
    .status(200)
    .json({ message: "Student Fetched Successfully.", data, version: "v2" });
});

// !tested
const StudentUpdate = tryCatch(async (req, res, next) => {
  const { id } = req.params;

  const teacher = await Teacher.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
  });

  const classIdInstance = await ClassTeacher.findAll({
    where: { teacherId: teacher.id },
    attributes: ["classId", "teacherId"],
  });

  const classIds = classIdInstance.map((item) => item.classId);

  const data = await Account.findOne({
    where: {
      id,
      userRole: "student",
    },
    include: [
      {
        model: Student,
        as: "studentProfile",
        required: true, // inner join - validation : - to prevent fetching the students that is not assigned to this particular request teacher
        where: { classId: classIds },
        include: [
          {
            model: Class,
            as: "classDetails",
            attributes: ["id", "name", "section"],
          },
        ],
      },
    ],
  });
  if (!data) return res.status(404).json({ message: "Student not found" });
  const { bloodGroup, bio, ...rest } = req.validatedData;
  data.updateFormData(rest);
  await data.save();
  data.studentProfile.updateFormData({ bloodGroup, bio });
  return res.status(200).json({
    message: "Student data updated successfully",
    data,
    version: "v2",
  });
});

// const StudentDelete = tryCatch(async (req, res, next) => {
//   const { id } = req.params;
//   const student = await Account.findOne({
//     where: { id, userRole: "student", tenantId: req.tenant.id },
//   });
//   if (!student) return res.status(404).json({ message: "Student not found" });
//   await student.destroy();
//   return res.status(200).json({ message: "Student deleted successfully" });
// });

// const addressList = tryCatch(async (req, res, next) => {
//   const { id } = req.params;
//   const student = await Student.findOne({
//     where: { accountId: id, tenantId: req.tenant.id },
//     attributes: ["accountId"],
//   });
//   const data = await Address.findAll({
//     where: { accountId: student.accountId, tenantId: req.tenant.id },
//     attributes: [
//       "id",
//       "city",
//       "state",
//       "pincode",
//       "streetAddress",
//       "country",
//       "phoneNumber",
//       "addressType",
//     ],
//   });
//   return res.status(200).json({
//     data,
//     message: "Address Fetched Successfully",
//   });
// });

const attendanceList = tryCatch(async (req, res, next) => {
  const { id } = req.params;

  const teacher = await Teacher.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
  });

  const classIdInstance = await ClassTeacher.findAll({
    where: { teacherId: teacher.id },
    attributes: ["classId", "teacherId"],
  });

  const classIds = classIdInstance.map((item) => item.classId);

  const student = await Student.findOne({
    where: { accountId: id, tenantId: req.tenant.id, classId: classIds },
    attributes: ["id", "accountId"],
    include: [
      {
        model: Class,
        as: "classDetails",
        attributes: ["id", "name", "section"],
      },
    ],
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
      // [Sequelize.fn("COUNT", Sequelize.col("status")), "count"],
      "status",
    ],
    // group: ["status", "attendanceDate", "checkIn", "checkOut", "id"],
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
    version: "v2",
    data,
    total: count,
    currentPage: page,
    totalPages: calculateTotalPages(count, limit),
    size: limit,
    stats: attendanceData,
    message: "Attendance Fetched Successfully",
  });
});

// !Developed & !Tested
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

// !Developed & !Tested
// const attendanceUpdate = tryCatch(async (req, res, next) => {
//   const { id, studentId } = req.params;
//   const student = await Student.findOne({
//     where: { accountId: studentId, tenantId: req.tenant.id },
//     attributes: ["id", "accountId"],
//   });
//   if (!student)
//     return res.status(404).json({ message: "Requested student not found.!" });
//   const data = await Attendance.findOne({
//     where: { id, tenantId: req.tenant.id, studentId: student.id },
//     attributes: ["id", "attendanceDate", "status"],
//   });
//   if (!data)
//     return res.status(404).json({ message: "Attendance not Found.!!" });
//   data.updateFormData(req.validatedData);
//   return res
//     .status(200)
//     .json({ data, message: "Attendance Updated Successfully.!!" });
// });

// !Developed & !Tested
// const attendanceDelete = tryCatch(async (req, res, next) => {
//   const { id } = req.params;
//   const data = await Attendance.findOne({
//     where: { id, tenantId: req.tenant.id },
//     attributes: ["id", "date", "status"],
//   });
//   if (!data)
//     return res.status(404).json({ message: "Attendance not Found.!!" });
//   await data.destroy();
//   return res
//     .status(200)
//     .json({ data, message: "Attendance Deleted Successfully.!!" });
// });

const interestList = tryCatch(async (req, res, next) => {
  const { id } = req.params;

  const teacher = await Teacher.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
  });

  const classIdInstance = await ClassTeacher.findAll({
    where: { teacherId: teacher.id },
    attributes: ["classId", "teacherId"],
  });

  const classIds = classIdInstance.map((item) => item.classId);

  const student = await Account.findOne({
    where: { id, tenantId: req.tenant.id },
    include: [
      {
        model: Interest,
        through: { attributes: [] },
      },
      {
        model: Student,
        as: "studentProfile",
        where: { tenantId: req.tenant.id, classId: classIds },
        attributes: ["profilePicture", "bio", "bloodGroup"],
        required: true,
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

const GoalList = tryCatch(async (req, res) => {
  const { id } = req.params;

  const teacher = await Teacher.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
  });

  const classIdInstance = await ClassTeacher.findAll({
    where: { teacherId: teacher.id },
    attributes: ["classId", "teacherId"],
  });

  const classIds = classIdInstance.map((item) => item.classId);

  const student = await Student.findOne({
    where: { accountId: id, tenantId: req.tenant.id, classId: classIds },
    attributes: [],
    include: [
      {
        model: Goal,
        as: "goals",
        attributes: ["id", "name", "description", "type"],
      },
    ],
  });

  if (!student) return res.status(404).json({ message: "User not found" });

  return res
    .status(200)
    .json({ message: "Goals fetched successfully", data: student.goals });
});

const aiAstrological = tryCatch(async (req, res, next) => {
  const { id } = req.params;

  const teacher = await Teacher.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
  });

  const classIdInstance = await ClassTeacher.findAll({
    where: { teacherId: teacher.id },
    attributes: ["classId", "teacherId"],
  });

  const classIds = classIdInstance.map((item) => item.classId);

  const student = await Student.findOne({
    where: { accountId: id, tenantId: req.tenant.id, classId: classIds },
    attributes: ["id", "accountId"],
    include: [
      {
        model: Account,
        as: "accounts",
        attributes: ["id", "dateOfBirth"],
      },
    ],
  });

  if (!student) return res.status(404).json({ message: "Student not found" });

  if (!student.accounts.dateOfBirth)
    return res.status(400).json({ message: "Date of birth not found.!" });

  const schema = {
    description: "Astrological data based on a given date of birth",
    type: SchemaType.OBJECT,
    properties: {
      zodiacSign: {
        type: SchemaType.STRING,
        description: "The zodiac sign associated with the date of birth",
        nullable: false,
      },
      element: {
        type: SchemaType.STRING,
        description:
          "The element associated with the zodiac sign (e.g., Fire, Water, Air, Earth)",
        nullable: false,
      },
      rulingPlanet: {
        type: SchemaType.STRING,
        description: "The ruling planet of the zodiac sign",
        nullable: false,
      },
      traits: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.STRING,
          description:
            "List of personality traits associated with the zodiac sign",
          nullable: false,
        },
      },
      strengths: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.STRING,
          description: "List of strengths associated with the zodiac sign",
          nullable: false,
        },
      },
      weaknesses: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.STRING,
          description: "List of weaknesses associated with the zodiac sign",
          nullable: false,
        },
      },
      compatibility: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.STRING,
          description: "Zodiac signs most compatible with the given sign",
          nullable: false,
        },
      },
      dailyHoroscope: {
        type: SchemaType.STRING,
        description: "A short horoscope prediction for the day",
        nullable: false,
      },
    },
    required: [
      "zodiacSign",
      "element",
      "rulingPlanet",
      "traits",
      "strengths",
      "weaknesses",
      "compatibility",
      "dailyHoroscope",
    ],
  };

  const model = ai(schema);

  const result = await model.generateContent(
    `Based on the date of birth ${student.accounts.dateOfBirth}, provide astrological data including:
    
    - Zodiac sign
    - Element (Fire, Water, Air, Earth)
    - Ruling planet
    - Personality traits
    - Strengths
    - Weaknesses
    - Compatible zodiac signs
    - A short daily horoscope prediction.
    
    Ensure the data is accurate and aligns with traditional astrological principles.`
  );

  if (!result.response.text())
    return res.status(404).json({ message: "Astrological data not found" });
  return res.status(200).json({
    message: "Data fetched succcesssfully.! ",
    data: JSON.parse(result.response.text()),
  });
});

const aiOverview = tryCatch(async (req, res, next) => {
  const { id } = req.params;

  const teacher = await Teacher.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
  });

  const classIdInstance = await ClassTeacher.findAll({
    where: { teacherId: teacher.id },
    attributes: ["classId", "teacherId"],
  });

  const classIds = classIdInstance.map((item) => item.classId);

  const student = await Student.findOne({
    where: { accountId: id, tenantId: req.tenant.id, classId: classIds },
    attributes: ["id", "accountId"],
  });

  if (!student) return res.status(404).json({ message: "Student not found" });
  let studentData;
  try {
    studentData = await getCompleteStudentData(id, student, req.tenant.id);
  } catch (error) {
    console.error(error);
  }

  const schema = {
    description:
      "Student profile analysis based on academic performance, extracurricular activities, goals and stated interests.",
    type: SchemaType.OBJECT,
    properties: {
      skillAssessment: {
        type: SchemaType.ARRAY,
        description:
          "Assessment of the student's skills with percentage ratings and evidence.",
        items: {
          type: SchemaType.OBJECT,
          properties: {
            skill: {
              type: SchemaType.STRING,
              description: "The name of the skill being assessed.",
              nullable: false,
            },
            value: {
              type: SchemaType.NUMBER,
              description: "Percentage rating of the skill.",
              nullable: false,
            },
            fill: {
              type: SchemaType.STRING,
              description:
                "Color code associated with the skill rating visualization.",
              nullable: false,
            },
            evidence: {
              type: SchemaType.STRING,
              description: "Specific evidence supporting the skill rating.",
              nullable: true,
            },
          },
          required: ["skill", "value", "fill"],
        },
      },
      careerRecommendations: {
        type: SchemaType.ARRAY,
        description:
          "Potential career paths based on the student's skills and interests.",
        items: {
          type: SchemaType.OBJECT,
          properties: {
            role: {
              type: SchemaType.STRING,
              description: "Suggested career path or role.",
              nullable: false,
            },
            description: {
              type: SchemaType.STRING,
              description:
                "Explanation of why this role is suitable for the student.",
              nullable: false,
            },
          },
          required: ["role", "description"],
        },
      },
    },
    required: ["skillAssessment", "careerRecommendations"],
  };

  const model = ai(schema);

  const result = await model.generateContent(
    `Analyze the student's profile based on the following data:
  
    **Input Data:**
    ${studentData}
  
    **Tasks:**
    - Skill Assessment:
      Assess the student's **aptitude, logical thinking, creativity, analytical skills, collaboration, technical skills, and curiosity**.
      - Provide a **percentage-based rating** for each skill, supported by evidence from the student's profile.
      - If no data is available for a skill, assign **0%** and note insufficient information.
  
    - Career Recommendations:
      Suggest **5 potential career paths** aligned with the student's skills and interests.
      - Include a brief description explaining the suitability of each recommendation.
  
    **Output Format:**
    - **Skill Assessment:** An array of objects with skill name, value (percentage), fill color, and evidence.
    - **Career Recommendations:** An array of objects with role name and description.
  
    Ensure all outputs are grounded in the provided data. For missing information, explicitly use fallback values as specified.`
  );

  return res.status(200).json({
    message: "Data fetched Successfully",
    data: JSON.parse(result.response.text()),
  });
});

const aiCareer = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.query;

  const teacher = await Teacher.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
  });

  const classIdInstance = await ClassTeacher.findAll({
    where: { teacherId: teacher.id },
    attributes: ["classId", "teacherId"],
  });

  const classIds = classIdInstance.map((item) => item.classId);

  const student = await Student.findOne({
    where: { accountId: id, tenantId: req.tenant.id, classId: classIds },
    attributes: ["id", "accountId"],
  });

  if (!student) return res.status(404).json({ message: "Student not found" });

  const studentData = getCompleteStudentData(id, student, req.tenant.id);

  const schema = {
    description:
      "Roadmap generation for a student's career development based on their profile and interests.",
    type: SchemaType.OBJECT,
    properties: {
      roadmap: {
        type: SchemaType.OBJECT,
        description:
          "Detailed roadmap for achieving the target career, including title, subtitle, timeline, key steps, challenges, and strategies.",
        properties: {
          title: {
            type: SchemaType.STRING,
            description: "The title of the roadmap.",
            nullable: false,
          },
          subtitle: {
            type: SchemaType.STRING,
            description:
              "The subtitle of the roadmap providing additional context.",
            nullable: false,
          },
          timeline: {
            type: SchemaType.STRING,
            description:
              "A realistic timeline for achieving the target career goal.",
            nullable: false,
          },
          keySteps: {
            type: SchemaType.ARRAY,
            description: "Step-by-step guide to achieve the career goal.",
            items: {
              type: SchemaType.OBJECT,
              properties: {
                step: {
                  type: SchemaType.STRING,
                  description: "Description of the specific step.",
                  nullable: false,
                },
                icon: {
                  type: SchemaType.STRING,
                  description:
                    "Icon representation for the step, provided as the name of the component (e.g., 'IconBuilding') from the lucid-react library.",

                  nullable: false,
                },
                skills: {
                  type: SchemaType.ARRAY,
                  description: "List of essential skills for the step.",
                  items: {
                    type: SchemaType.STRING,
                  },
                  nullable: false,
                },
                timeframe: {
                  type: SchemaType.STRING,
                  description: "Time required to complete this step.",
                  nullable: false,
                },
              },
              required: ["step", "icon", "skills", "timeframe"],
            },
          },
          potentialChallenges: {
            type: SchemaType.ARRAY,
            description:
              "Potential challenges during the career development process and strategies to overcome them.",
            items: {
              type: SchemaType.OBJECT,
              properties: {
                challenge: {
                  type: SchemaType.STRING,
                  description: "Description of the challenge.",
                  nullable: false,
                },
                strategy: {
                  type: SchemaType.STRING,
                  description: "Strategy to address the challenge.",
                  nullable: false,
                },
              },
              required: ["challenge", "strategy"],
            },
          },
        },
        required: [
          "title",
          "subtitle",
          "timeline",
          "keySteps",
          "potentialChallenges",
        ],
      },
    },
    required: ["roadmap"],
  };

  const model = ai(schema);

  const result = await model.generateContent(
    `Based on the student data ${studentData}, What is a realistic timeline to become an ${role} Please outline the key steps, including essential skills, certifications, and practical experience. What are the potential challenges and strategies to overcome them?`
  );

  console.log(result.response.text());

  return res.status(200).json({
    message: "Data fetched Successfully",
    data: JSON.parse(result.response.text()),
  });
});

// const medicalRecordList = tryCatch(async (req, res, next) => {
//   const { studentId } = req.params;
//   const { page = 1, size = 10 } = req.query;
//   const offset = (page - 1) * size;
//   const { rows: data, count } = await MedicalRecord.findAndCountAll({
//     page,
//     offset,
//     where: { studentId, tenantId: req.tenant.id },
//     attributes: {
//       exclude: ["deletedAt"],
//     },
//   });
//   return res.status(200).json({
//     data,
//     total: count,
//     currentPage: page,
//     totalPages: calculateTotalPages(count, limit),
//     size: size,
//     message: "Medical Record Fetched Successfully",
//   });
// });

// const medicalRecordCreate = tryCatch(async (req, res, next) => {
//   const { studentId } = req.params;
//   const data = await MedicalRecord.create({
//     studentId,
//     tenantId: req.tenant.id,
//     ...req.validatedData,
//   });
//   return res
//     .status(201)
//     .json({ message: "Medical Record Created Successfully.!", data });
// });

// const medicalRecordView = tryCatch(async (req, res, next) => {
//   const { id } = req.params;
//   const data = await MedicalRecord.findOne({
//     where: { id, tenantId: req.tenant.id },
//   });
//   if (!data)
//     return res.status(404).json({ message: "Medical Record not Found.!" });
//   return res
//     .status(200)
//     .json({ data, message: "Medical Record Fetched Successfully.!!" });
// });

// const medicalRecordUpdate = tryCatch(async (req, res, next) => {
//   const { id } = req.params;
//   const data = await MedicalRecord.findOne({
//     where: { id, tenantId: req.tenant.id },
//   });
//   if (!data)
//     return res.status(404).json({ message: "Medical Record not Found" });
//   data.updateFormData(req.validatedData);
//   await data.save();
//   return res
//     .status(200)
//     .json({ message: "Medical Record Fetched Successfully.!!", data });
// });

// const medicalRecordDelete = tryCatch(async (req, res, next) => {
//   const { id } = req.params;
//   const data = await MedicalRecord.findOne({
//     where: { id, tenantId: req.tenant.id },
//   });
//   if (!data)
//     return res
//       .status(404)
//       .json({ data, message: "Medical Record not Found.!" });
//   await data.destroy();
//   return res
//     .status(200)
//     .json({ message: "Medical Record Deleted Successfully.!!" });
// });

// const AwardList = tryCatch(async (req, res, next) => {
//   const { studentId } = req.params;
//   const { page = 1, size = 10 } = req.query;
//   const offset = (page - 1) * size;
//   const { rows: data, count } = await Award.findAndCountAll({
//     page,
//     offset,
//     where: { studentId, tenantId: req.tenant.id },
//     attributes: {
//       exclude: ["deletedAt"],
//     },
//   });
//   return res.status(200).json({
//     data,
//     total: count,
//     currentPage: page,
//     totalPages: calculateTotalPages(count, limit),
//     size: size,
//     message: "Medical Record Fetched Successfully",
//   });
// });

// const AwardCreate = tryCatch(async (req, res, next) => {
//   const { studentId } = req.params;
//   const data = await Award.create({
//     tenantId: req.tenant.id,
//     studentId,
//     ...req.validatedData,
//   });
//   return res.status(201).json({
//     data,
//     message: "Award created successfully",
//   });
// });
// const AwardView = tryCatch(async (req, res, next) => {
//   const { id } = req.params;
//   const data = await Award.findOne({ where: { id, tenantId: req.tenant.id } });
//   if (!data) return res.status(404).json({ message: "Award not found" });
//   return res.status(200).json({ data, message: "Award fetched successfully" });
// });

// const AwardUpdate = tryCatch(async (req, res, next) => {
//   const { id } = req.params;
//   const data = await Award.findOne({ where: { id, tenantId: req.tenant.id } });
//   if (!data) return res.status(404).json({ message: "Award not found" });
//   data.updateFormData(req.validatedData);
//   await data.save();
//   return res
//     .status(200)
//     .json({ data, message: "Award Updated Successfully.!!" });
// });
// const AwardDelete = tryCatch(async (req, res, next) => {
//   const { id } = req.params;
//   const data = await Award.findOne({ where: { id, tenantId: req.tenant.id } });
//   if (!data) return res.status(404).json({ message: "Award not found" });
//   await data.destroy();
//   return res.status(200).json({ message: "Award Deleted Successfully.!!" });
// });

// const ListMarks = tryCatch(async (req, res, next) => {
//   const { id } = req.params;
//   const student = await Student.findOne({
//     where: { accountId: id, tenantId: req.tenant.id },
//   });
//   console.log(student);

//   if (!student)
//     return res.status(404).json({ message: "Requested student not found" });
//   const data = await StudentExamScore.findAll({
//     where: { studentId: student.id },
//     include: [
//       {
//         model: ExamSubject,
//         as: "examSubjects",
//         include: [
//           {
//             model: Exam,
//             as: "exam",
//           },
//           {
//             model: Subject,
//           },
//         ],
//       },
//     ],
//   });
//   return res.status(200).json({ message: "Marks fetched Successfully", data });
// });

// const CreateMarks = tryCatch(async (req, res, next) => {
//   const { id } = req.params;
//   const student = await Student.findOne({
//     where: { accountId: id, tenantId: req.tenant.id },
//   });
//   if (!student)
//     return res.status(404).json({ message: "Requested student not found" });

//   const data = await StudentExamScore.create({
//     ...req.validatedData,
//     studentId: student.id,
//     tenantId: req.tenant.id,
//   });

//   return res.status(201).json({ message: "Mark created successfully.", data });
// });

// const UpdateMarks = tryCatch(async (req, res, next) => {
//   const student = await Student.findOne({
//     where: { accountId: id, tenantId: req.tenant.id },
//   });
//   if (!student)
//     return res.status(404).json({ message: "Requested student not found" });

//   const data = await StudentExamScore.findOne;

//   return res.status(201).json({ message: "Mark created successfully.", data });
// });

// const InterestList = tryCatch(async (req, res, next) => {
//   const { id } = req.params;
//   const user = await Account.findOne({
//     where: { id, tenantId: req.tenant.id },
//     include: [
//       {
//         model: Interest,
//         through: { attributes: [] },
//       },
//     ],
//   });

//   if (!user) return res.status(404).json({ message: "User not found" });

//   return res
//     .status(200)
//     .json({ message: "Interest fetched successfully", data: user.Interests });
// });

// const GoalList = tryCatch(async (req, res) => {
//   const { id } = req.params;
//   const user = await Student.findOne({
//     where: { accountId: id, tenantId: req.tenant.id },
//     attributes: [],
//     include: [
//       {
//         model: Goal,
//         as: "goals",
//         attributes: ["id", "name", "description", "type"],
//       },
//     ],
//   });

//   if (!user) return res.status(404).json({ message: "User not found" });

//   return res
//     .status(200)
//     .json({ message: "Goals fetched successfully", data: user.goals });
// });

// const VolunteerList = tryCatch(async (req, res) => {
//   const { id } = req.params;
//   const user = await Student.findOne({
//     where: { accountId: id, tenantId: req.tenant.id },
//     attributes: [],
//     include: [
//       {
//         model: Volunteer,
//         as: "volunteerings",
//         attributes: ["id", "organisationName", "role", "duration"],
//       },
//     ],
//   });

//   if (!user) return res.status(404).json({ message: "User not found" });

//   return res.status(200).json({
//     message: "Volunteers fetched successfully",
//     data: user.volunteerings,
//   });
// });

// const getAttendanceCountByMonth = (data) => {
//   // Initialize attendance count for all months with 0
//   const monthOrder = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];
//   const attendanceCount = monthOrder.reduce((acc, month) => {
//     acc[month] = 0; // Initialize to 0 for all months
//     return acc;
//   }, {});

//   // Count attendance for present and late statuses
//   data.forEach((item) => {
//     const date = new Date(item.attendanceDate);
//     const month = date.toLocaleString("default", { month: "long" });

//     if (item.status === "present" || item.status === "late") {
//       // Only count present or late statuses
//       attendanceCount[month]++;
//     }
//   });

//   // Convert the attendance count object to the desired array format
//   const result = monthOrder.map((month) => ({
//     month,
//     attendanceCount: attendanceCount[month],
//   }));

//   return result;
// };

// const PerformanceData = tryCatch(async (req, res, next) => {
//   const { id } = req.params;
//   console.log(id);

//   const student = await Student.findOne({
//     where: { accountId: id, tenantId: req.tenant.id },
//     include: [
//       {
//         model: Attendance,
//         as: "attendances",
//         attributes: ["id", "attendanceDate", "status", "checkIn", "checkOut"],
//       },
//     ],
//   });
//   if (!student) {
//     return res.status(200).json({ message: "Student not found" });
//   }
//   // const performanceData = await StudentExamScore.findAll({
//   //   where: { studentId: student.id },
//   //   include: [
//   //     {
//   //       model: ExamSubject,
//   //       as: "examSubjects",
//   //       attributes: ["subjectId"],
//   //     },
//   //   ],
//   //   attributes: [
//   //     "studentId",
//   //     [sequelize.fn("SUM", sequelize.col("marks_obtained")), "totalMarks"],
//   //     [sequelize.fn("COUNT", sequelize.col("exam_subject_id")), "examCount"],
//   //   ],
//   //   group: [
//   //     "student_id",
//   //     "exam_subject_id",
//   //     "examSubjects.id",
//   //     "examSubjects.subject_id",
//   //   ],
//   // });
//   const exams = await Exam.findAll({
//     attributes: ["id", "startDate"],
//     include: [
//       {
//         model: ExamSubject,
//         as: "examSubjects",
//         include: [
//           {
//             model: Subject,
//             attributes: ["name"],
//           },
//           {
//             model: StudentExamScore,
//             as: "examScores",
//             where: { studentId: student.id },
//             attributes: ["marksObtained"],
//           },
//         ],
//       },
//     ],
//   });

//   const performanceData = {};

//   exams.forEach((exam) => {
//     const month = new Date(exam.startDate).toLocaleString("default", {
//       month: "short",
//     });

//     if (!performanceData[month]) {
//       performanceData[month] = {};
//     }

//     exam.examSubjects.forEach((examSubject) => {
//       const subjectName = examSubject.Subject.name;

//       if (!performanceData[month][subjectName]) {
//         performanceData[month][subjectName] = { totalMarks: 0, count: 0 };
//       }

//       examSubject.examScores.forEach((score) => {
//         performanceData[month][subjectName].totalMarks += parseFloat(
//           score.marksObtained
//         );
//         performanceData[month][subjectName].count += 1;
//       });
//     });
//   });

//   const ScorePerformance = Object.entries(performanceData).map(
//     ([month, subjects]) => {
//       const entry = { month };
//       for (const [subject, { totalMarks, count }] of Object.entries(subjects)) {
//         entry[subject] = (totalMarks / count).toFixed(2);
//       }
//       return entry;
//     }
//   );

//   const calendarMonths = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];

//   const subjects = [
//     ...new Set(
//       ScorePerformance.flatMap((item) =>
//         Object.keys(item).filter((key) => key !== "month")
//       )
//     ),
//   ];

//   const ScorePerformanceStructuredData = calendarMonths.map((month) => {
//     const monthData = { month };
//     subjects.forEach((subject) => {
//       const dataForMonth = ScorePerformance.find(
//         (item) => item.month === month
//       );
//       monthData[subject] =
//         dataForMonth && dataForMonth[subject] !== undefined
//           ? Number(dataForMonth[subject])
//           : 0;
//     });

//     return monthData;
//   });

//   return res.status(200).json({
//     message: "Performance fetched Successfully",
//     marks: ScorePerformanceStructuredData,
//     attendances: getAttendanceCountByMonth(student.attendances),
//   });
// });

module.exports = {
  StudentList,
  aiCareer,
  aiOverview,
  aiAstrological,
  // StudentCreate,
  StudentView,
  StudentUpdate,
  // StudentDelete,
  // interestList,
  // interestAdd,
  // interestRemove,
  attendanceList,
  attendanceCreate,
  // addressList,
  // attendanceUpdate,
  // attendanceDelete,
  // medicalRecordList,
  // medicalRecordCreate,
  // medicalRecordView,
  // medicalRecordUpdate,
  // medicalRecordDelete,
  // AwardList,
  // AwardCreate,
  // AwardView,
  // AwardUpdate,
  // AwardDelete,
  // aiDashboard,
  // ListMarks,
  // CreateMarks,
  interestList,
  // PerformanceData,
  GoalList,
  // VolunteerList,
};
