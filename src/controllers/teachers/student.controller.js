const {
  Account,
  Student,
  Attendance,
  ClassTeacher,
  Teacher,
  Class,
  Address,
} = require("../../models");
const { Interest } = require("../../models/core");
const { Volunteer, Goal } = require("../../models/students/academic.model");

const { tryCatch, calculateTotalPages } = require("../../utils/handlers");

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

  console.log(classIdInstance, "classIdInstance");

  const classIds = classIdInstance.map((item) => item.classId);
  console.log(classIds, "classIds");

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

const extractReason = (data) => {
  const regex = new RegExp(
    `\\*\\*Aptitude.*?:([\\s\\S]*?)\\*\\*Curiosity`,
    "g"
  );
  const match = regex.exec(data);

  return match ? match[1].trim() : "";
};

const extractCareer = (data) => {
  console.log("Starting to extract career path recommendations...");

  if (data.includes("**Career Path Recommendations:**")) {
    console.log("Career Path Recommendations section found!");

    const regex = /```json\s*\[\s*(.*?)\s*\]\s*```/gs;
    const matches = [];
    let match;

    // Use the regex to find all the JSON blocks in the string
    while ((match = regex.exec(data)) !== null) {
      matches.push(match[0]);
    }

    if (matches.length >= 2) {
      console.log("Found multiple JSON blocks. Skipping the first one.");

      let cleanedData = matches[1].replace(/```json|```/g, "").trim();
      console.log(
        "Cleaned JSON data (removed code block markers):",
        cleanedData
      );

      cleanedData = cleanedData.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, ""); // Remove comments
      console.log("Removed comments:", cleanedData);

      cleanedData = cleanedData.replace(/(\w+):/g, '"$1":'); // Ensure keys are quoted properly
      console.log("Ensured proper quoting of keys:", cleanedData);

      cleanedData = cleanedData.replace(/,\s*}/g, "}"); // Remove trailing commas
      cleanedData = cleanedData.replace(/,\s*\]/g, "]"); // Remove trailing commas
      console.log("Removed trailing commas:", cleanedData);

      try {
        const careerRecommendations = JSON.parse(cleanedData);
        console.log(
          "Successfully parsed career recommendations:",
          careerRecommendations
        );
        return [true, careerRecommendations]; // Return parsed career path recommendations
      } catch (error) {
        console.error("Error parsing career recommendation data:", error);
        return [false, "Error parsing career recommendation data."];
      }
    } else {
      console.warn("Not enough JSON data blocks found.");
      return [false, "Career recommendation data not found or invalid format."];
    }
  } else {
    console.warn("No career path section found in the data.");
    return [false, "No career recommendation data found."];
  }
};

const extractChart = (data) => {
  if (data.includes("**Skill Assessment:**")) {
    // Match the JSON data inside the ```json code block
    const regex = /```json\s*\[\s*(.*?)\s*\]\s*```/gs;
    const match = data.match(regex);

    if (match && match[0]) {
      let cleanedData = match[0].replace(/```json|```/g, "").trim(); // Remove code block markers
      console.log("Raw Cleaned Data (Skill Assessment):", cleanedData); // Debug log

      // Clean up the JSON string by ensuring it's in the correct format
      cleanedData = cleanedData.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, ""); // Remove comments
      cleanedData = cleanedData.replace(/(\w+):/g, '"$1":'); // Ensure keys are quoted properly
      cleanedData = cleanedData.replace(/,\s*}/g, "}"); // Remove trailing commas before closing braces
      cleanedData = cleanedData.replace(/,\s*\]/g, "]"); // Remove trailing commas before closing brackets

      console.log("Cleaned Data (Skill Assessment):", cleanedData); // Debug log

      try {
        const skillAssessment = JSON.parse(cleanedData); // Parse the cleaned-up data
        return [true, skillAssessment]; // Return parsed data if successful
      } catch (error) {
        console.error("Error parsing skill assessment data:", error);
        return [false, "Error parsing skill assessment data."];
      }
    } else {
      return [false, "Skill assessment data not found or invalid format."];
    }
  } else {
    return [false, "No skill assessment data found."];
  }
};

const extractImportantNote = (data) => {
  const noteRegex = new RegExp(
    `\\*\\*Important Note:\\*\\*([\\s\\S]*?)(?=\\n\\*\\*|$)`, // Capture everything after **Important Note:** until next ** or end
    "g"
  );
  const noteMatch = noteRegex.exec(data);

  const importantNote = noteMatch
    ? noteMatch[1].trim().replace(/\n+/g, " ") // Replace multiple newlines with a space
    : "";

  return importantNote;
};

const extractRoadmap = (data) => {
  const jsObjectString = data.replace(/```json|```/g, "").trim();
  return [true, JSON.parse(jsObjectString)];
};

const aiDashboard = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const student = await Student.findOne({
    where: { accountId: id, tenantId: req.tenant.id },
    attributes: ["id", "accountId"],
  });
  const [studentData, attendanceData, interestData, examScoreData, goalData] =
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
      Goal.findAll({
        where: { studentId: student.id, tenantId: req.tenant.id },
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

  const plainGoalData = goalData
    ? goalData.map((item) => item.get({ plain: true }))
    : null;

  // const plainAwardData = awardData
  //   ? awardData.map((item) => item.get({ plain: true }))
  //   : null;

  // console.log(plainAwardData, "interestData");

  // const promptResult1 = await model.generateContent(
  //   `${JSON.stringify({ ...plainStudentData, ...plainAttendanceData, ...plainInterestData })} Analyze his profile, considering his academic performance, extracurricular activities, and stated interests. Assess his aptitude, logical thinking, creativity, analytical skills, collaboration, technical skills, and curiosity. Provide a percentage-based rating for each skill. Additionally, suggest 5 potential career paths based on his strengths and interests.`
  // );
  const promptResult2 = await model.generateContent(
    `${JSON.stringify({ ...plainStudentData, ...plainAttendanceData, ...plainInterestData, ...plainExamScoreData, ...plainGoalData })}
  
  **Prompt:**
  
  Analyze the student's profile, focusing on their academic performance, extracurricular activities, and stated interests. 
  
  **Task 1: Skill Assessment**
  Assess the student's **aptitude, logical thinking, creativity, analytical skills, collaboration, technical skills, and curiosity**. 
  - If sufficient data is available, provide a **percentage-based rating** for each skill, **grounded in specific examples** from the student's profile.
  - If no relevant data is available for a skill, assign a **value of 0%** for that skill and note that it is due to insufficient information.
  
  **Task 2: Career Path Recommendations**
  Based on the skill assessment, suggest **5 potential career paths** that align with the student's strengths and interests. 
  - If sufficient data is available, provide a **brief description** and explain how the student's skills and interests make them a good fit.
  - If the data is insufficient to recommend career paths, indicate that career recommendations could not be generated due to lack of information.

  **Output Format:**
  
  **Skill Assessment:**
  [
    { skill: "Aptitude", value: <>, fill: "var(--color-chrome)", evidence: "<>" },
    { skill: "Logical thinking", value: <>, fill: "var(--color-safari)", evidence: "<>" },
    // ... other skills
  ]
  
  **Career Path Recommendations:**
  [
    { role: "No recommendations available", description: "Insufficient data to suggest potential career paths." }
  ]
  
  **Note:** Ensure that all assessments and recommendations are **directly supported by evidence** from the student's profile. For missing data, explicitly provide fallback values as specified. Avoid speculative claims or assumptions beyond the provided data.`
  );

  const promptResultText2 = promptResult2.response.text();

  console.log(
    "=================================",
    promptResultText2,
    "==================================="
  );

  const [responded, chartData] = extractChart(promptResultText2);
  const reason = extractReason(promptResultText2);
  const note = extractImportantNote(promptResultText2);
  const [careerResponded, careerData] = extractCareer(promptResultText2);

  console.log(careerData[0].role);

  let roadmapData = {};
  let haveRoadmap = false;
  if (
    careerData[0].role &&
    careerData[0].role !== "No recommendations available"
  ) {
    const promptResult3 = await model.generateContent(
      `${JSON.stringify({ ...plainStudentData, ...plainAttendanceData, ...plainInterestData })} What is a realistic timeline to become an ${careerData[0].role}? Please outline the key steps, including essential skills, certifications, and practical experience. What are the potential challenges and strategies to overcome them?
      
      Give me the output based on the below structure.
      const Roadmap = {
      "title":"<>",
      "subtitle":"<>",
      "timeline": "<>",
      "key_steps": [
          {
              "step": "<>",
              "icon" : "<lucid-react> (Component) Eg:- <AlertCircle className="h-4 w-4" />"
              "skills": [<>,<>,<>],
              "timeframe": "<>"
          },
          ....
      ],
      "potential_challenges": [
          {
              "challenge": "<>",
              "strategy": "<>"
          },
          .....
      ]
      }
      `
    );
    [haveRoadmap, roadmapData] = extractRoadmap(promptResult3.response.text());
  }

  let responseData = {
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
        prompt: `Analyze his profile, considering his academic performance, extracurricular activities, and stated interests. Assess his aptitude, logical thinking, creativity, analytical skills, collaboration, technical skills, and curiosity. Provide a percentage-based rating for each skill. Additionally, suggest 5 potential career paths based on his strengths and interests.`,
        result: {
          chartData: { haveData: responded, chart: chartData },
          careerData: { haveData: careerResponded, career: careerData },
        },
        response: promptResultText2,
      },
      {
        id: 3,
        prompt:
          "What is a realistic timeline to become an AI/ML engineer? Please outline the key steps, including essential skills, certifications, and practical experience. What are the potential challenges and strategies to overcome them?",
        result: {
          roadmapData: { haveData: haveRoadmap, roadmap: roadmapData },
        },
      },
    ],
  };

  return res.status(200).json(responseData);
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

const GoalList = tryCatch(async (req, res) => {
  const { id } = req.params;
  const user = await Student.findOne({
    where: { accountId: id, tenantId: req.tenant.id },
    attributes: [],
    include: [
      {
        model: Goal,
        as: "goals",
        attributes: ["id", "name", "description", "type"],
      },
    ],
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  return res
    .status(200)
    .json({ message: "Goals fetched successfully", data: user.goals });
});

const VolunteerList = tryCatch(async (req, res) => {
  const { id } = req.params;
  const user = await Student.findOne({
    where: { accountId: id, tenantId: req.tenant.id },
    attributes: [],
    include: [
      {
        model: Volunteer,
        as: "volunteerings",
        attributes: ["id", "organisationName", "role", "duration"],
      },
    ],
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  return res.status(200).json({
    message: "Volunteers fetched successfully",
    data: user.volunteerings,
  });
});

const ListAward = tryCatch(async (req, res, next) => {});
const CreateAward = tryCatch(async (req, res, next) => {});
const UpdateAward = tryCatch(async (req, res, next) => {});
const DeleteAward = tryCatch(async (req, res, next) => {});

const getAttendanceCountByMonth = (data) => {
  // Initialize attendance count for all months with 0
  const monthOrder = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const attendanceCount = monthOrder.reduce((acc, month) => {
    acc[month] = 0; // Initialize to 0 for all months
    return acc;
  }, {});

  // Count attendance for present and late statuses
  data.forEach((item) => {
    const date = new Date(item.attendanceDate);
    const month = date.toLocaleString("default", { month: "long" });

    if (item.status === "present" || item.status === "late") {
      // Only count present or late statuses
      attendanceCount[month]++;
    }
  });

  // Convert the attendance count object to the desired array format
  const result = monthOrder.map((month) => ({
    month,
    attendanceCount: attendanceCount[month],
  }));

  return result;
};

const PerformanceData = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);

  const student = await Student.findOne({
    where: { accountId: id, tenantId: req.tenant.id },
    include: [
      {
        model: Attendance,
        as: "attendances",
        attributes: ["id", "attendanceDate", "status", "checkIn", "checkOut"],
      },
    ],
  });
  if (!student) {
    return res.status(200).json({ message: "Student not found" });
  }
  // const performanceData = await StudentExamScore.findAll({
  //   where: { studentId: student.id },
  //   include: [
  //     {
  //       model: ExamSubject,
  //       as: "examSubjects",
  //       attributes: ["subjectId"],
  //     },
  //   ],
  //   attributes: [
  //     "studentId",
  //     [sequelize.fn("SUM", sequelize.col("marks_obtained")), "totalMarks"],
  //     [sequelize.fn("COUNT", sequelize.col("exam_subject_id")), "examCount"],
  //   ],
  //   group: [
  //     "student_id",
  //     "exam_subject_id",
  //     "examSubjects.id",
  //     "examSubjects.subject_id",
  //   ],
  // });
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

  return res.status(200).json({
    message: "Performance fetched Successfully",
    marks: ScorePerformanceStructuredData,
    attendances: getAttendanceCountByMonth(student.attendances),
  });
});

module.exports = {
  StudentList,
  StudentCreate,
  StudentView,
  StudentUpdate,
  StudentDelete,
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
  PerformanceData,
  GoalList,
  VolunteerList,
};
