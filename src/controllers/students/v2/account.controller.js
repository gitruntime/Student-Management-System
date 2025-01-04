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
} = require("../../../models");
const { Interest } = require("../../../models/core");
const { Goal, Volunteer } = require("../../../models/students/academic.model");
const { tryCatch } = require("../../../utils/handlers");
const { getCompleteStudentData } = require("../../admin/v2/student.controller");
const { SchemaType } = require("@google/generative-ai");
const { ai } = require("../../../configs/ai.config");

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
  return res
    .status(200)
    .json({ message: "Goal fetched successfully", data, version: "v2" });
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

const aiAstrological = tryCatch(async (req, res, next) => {
  const student = await Student.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
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
  const student = await Student.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
    attributes: ["id", "accountId"],
  });

  if (!student) return res.status(404).json({ message: "Student not found" });

  const studentData = await getCompleteStudentData(
    req.user.id,
    student,
    req.tenant.id
  );

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

  console.log(result);

  // const student = await Student.findOne({
  //   where: { accountId: id, tenantId: req.tenant.id },
  //   attributes: ["id", "accountId"],
  // });

  // if (!student) return res.status(404).json({ message: "Student not found" });

  // const studentData = getCompleteStudentData(id, student, req.tenant.id);

  // const promptResult = await model.generateContent(
  //   `${studentData}

  // **Prompt:**

  // Analyze the student's profile, focusing on their academic performance, extracurricular activities, and stated interests.

  // **Task 1: Skill Assessment**
  // Assess the student's **aptitude, logical thinking, creativity, analytical skills, collaboration, technical skills, and curiosity**.
  // - If sufficient data is available, provide a **percentage-based rating** for each skill, **grounded in specific examples** from the student's profile.
  // - If no relevant data is available for a skill, assign a **value of 0%** for that skill and note that it is due to insufficient information.

  // **Task 2: Career Path Recommendations**
  // Based on the skill assessment, suggest **5 potential career paths** that align with the student's strengths and interests.
  // - If sufficient data is available, provide a **brief description** and explain how the student's skills and interests make them a good fit.
  // - If the data is insufficient to recommend career paths, indicate that career recommendations could not be generated due to lack of information.

  // **Output Format:**

  // **Skill Assessment:**
  // [
  //   { skill: "Aptitude", value: <>, fill: "var(--color-chrome)", evidence: "<>" },
  //   { skill: "Logical thinking", value: <>, fill: "var(--color-safari)", evidence: "<>" },
  //   // ... other skills
  // ]

  // **Career Path Recommendations:**
  // [
  //   { role: "No recommendations available", description: "Insufficient data to suggest potential career paths." }
  // ]

  // **Note:** Ensure that all assessments and recommendations are **directly supported by evidence** from the student's profile. For missing data, explicitly provide fallback values as specified. Avoid speculative claims or assumptions beyond the provided data.If there is no much data about student give me the data with placeholders`
  // );

  // const promptResultText = promptResult.response.text();

  // console.log(promptResult);

  // const [responded, chartData] = extractChart(promptResultText);
  // const [careerResponded, careerData] = extractCareer(promptResultText);

  // let roadmapData = {};
  // let haveRoadmap = false;
  // if (
  //   careerData[0].role &&
  //   careerData[0].role !== "No recommendations available"
  // ) {
  //   const promptResult3 = await model.generateContent(
  //     `${JSON.stringify({ ...plainStudentData, ...plainAttendanceData, ...plainInterestData })} What is a realistic timeline to become an ${careerData[0].role}? Please outline the key steps, including essential skills, certifications, and practical experience. What are the potential challenges and strategies to overcome them?

  //     Give me the output based on the below structure.
  //     const Roadmap = {
  //     "title":"<>",
  //     "subtitle":"<>",
  //     "timeline": "<>",
  //     "key_steps": [
  //         {
  //             "step": "<>",
  //             "icon" : "<lucid-react> (Component) Eg:- <AlertCircle className="h-4 w-4" />"
  //             "skills": [<>,<>,<>],
  //             "timeframe": "<>"
  //         },
  //         ....
  //     ],
  //     "potential_challenges": [
  //         {
  //             "challenge": "<>",
  //             "strategy": "<>"
  //         },
  //         .....
  //     ]
  //     }
  //     `
  //   );
  //   [haveRoadmap, roadmapData] = extractRoadmap(promptResult3.response.text());
  // }

  // let responseData = {
  //   message: "Data Fetched Successfully",
  //   data: [
  //     // {
  //     //   id: 1,
  //     //   prompt:
  //     //     "Analyze his profile, considering his academic performance, extracurricular activities, and stated interests. Assess his aptitude, logical thinking, creativity, analytical skills, collaboration, technical skills, and curiosity. Provide a percentage-based rating for each skill. Additionally, suggest 5 potential career paths based on his strengths and interests.",
  //     //   result: promptResult1.response.text(),
  //     // },
  //     {
  //       id: 2,
  //       prompt: `Analyze his profile, considering his academic performance, extracurricular activities, and stated interests. Assess his aptitude, logical thinking, creativity, analytical skills, collaboration, technical skills, and curiosity. Provide a percentage-based rating for each skill. Additionally, suggest 5 potential career paths based on his strengths and interests.`,
  //       result: {
  //         chartData: { haveData: responded, chart: chartData },
  //         careerData: { haveData: careerResponded, career: careerData },
  //       },
  //       },
  //     {
  //       id: 3,
  //       prompt:
  //         "What is a realistic timeline to become an AI/ML engineer? Please outline the key steps, including essential skills, certifications, and practical experience. What are the potential challenges and strategies to overcome them?",
  //       result: {
  //         roadmapData: { haveData: haveRoadmap, roadmap: roadmapData },
  //       },
  //     },
  //   ],
  // };

  // if (!responded)
  //   return res
  //     .status(404)
  //     .json({ message: "Cannot generate data", data: promptResult });

  console.log(result.response.text());

  return res.status(200).json({
    message: "Data fetched Successfully",
    data: JSON.parse(result.response.text()),
  });
});

const aiCareer = tryCatch(async (req, res, next) => {
  const { role } = req.query;

  const student = await Student.findOne({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
    attributes: ["id", "accountId"],
  });

  if (!student) return res.status(404).json({ message: "Student not found" });

  const studentData = await getCompleteStudentData(
    req.user.id,
    student,
    req.tenant.id
  );

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
  aiOverview,
  aiAstrological,
  aiCareer,
};
