const { Op, Sequelize } = require("sequelize");
const {
  Class,
  Subject,
  Teacher,
  ClassTeacher,
  Account,
  Student,
  ClassSubject,
  Exam,
  ExamSubject,
} = require("../../../models");
const { calculateTotalPages } = require("../../../utils/handlers");
const { tryCatch } = require("../../../utils/handlers/tryCatch");
const { db: sequelize } = require("../../../configs/db.config");

// Developed
const classList = tryCatch(async (req, res, next) => {
  const {
    size: limit = 1000,
    page = 1,
    sortBy = "id",
    sortOrder = "ASC",
  } = req.query;
  const data = await Class.findAll({
    limit,
    offset: (page - 1) * limit,
    where: { tenantId: req.tenant.id },
    attributes: [
      "id",
      "name",
      "section",
      [
        sequelize.literal(`(
            SELECT COUNT(*)
            FROM classes_subjects AS cs
            WHERE cs.class_id = "Class".id
        )`),
        "subjectCount",
      ],
      [
        sequelize.literal(`(
            SELECT COUNT(*)
            FROM students AS s
            WHERE s.class_id = "Class".id AND s.deleted_at IS NULL
        )`),
        "studentCount",
      ],
      [
        sequelize.literal(`(
            SELECT COUNT(*)
            FROM classes_teachers AS ct
            WHERE ct.class_id = "Class".id
        )`),
        "teacherCount",
      ],
    ],
    group: ["Class.id"],
    order: [[sortBy, sortOrder]],
  });
  const count = await Class.count({
    where: { tenantId: req.tenant.id },
  });
  return res.status(200).json({
    data,
    totalCount: count,
    currentPage: page,
    totalPages: calculateTotalPages(count, limit),
    size: limit,
    version: 2,
    message: "Class data fetched Successfully",
  });
});

const classView = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Class.findOne({
    where: { tenantId: req.tenant.id, id },
    attributes: [
      "id",
      "name",
      "section",
      [
        sequelize.literal(`(
            SELECT COUNT(*)
            FROM classes_subjects AS cs
            WHERE cs.class_id = "Class".id
        )`),
        "subjectCount",
      ],
      [
        sequelize.literal(`(
            SELECT COUNT(*)
            FROM students AS s
            WHERE s.class_id = "Class".id AND s.deleted_at IS NULL
        )`),
        "studentCount",
      ],
      [
        sequelize.literal(`(
            SELECT COUNT(*)
            FROM classes_teachers AS ct
            WHERE ct.class_id = "Class".id
        )`),
        "teacherCount",
      ],
    ],
    include: [
      {
        model: Student,
        as: "students",
        attributes: [], // Exclude detailed student attributes
      },
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
  return res.status(200).json({
    data,
    version: 2,
    message: "Class data fetched Successfully",
  });
});

// Developed
const classCreate = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { subjects, ...classDetails } = req.validatedData;

    let data = await Class.findOne({
      where: { ...classDetails, tenantId: req.tenant.id },
    });
    if (data) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Data already exists",
        error: { name: "Class already registered" },
      });
    } // Avoid duplication

    data = await Class.create(
      {
        ...classDetails,
        tenantId: req.tenant.id,
      },
      { transaction }
    );

    const subjectInstance = await Subject.findAll(
      {
        where: { id: subjects },
      },
      { transaction }
    );

    if (subjectInstance.length !== subjects.length) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Some subjects does not exist",
        error: { subjects: "Clear the subjects and select again" },
      });
    }

    await data.addSubjects(subjectInstance, { transaction });
    await transaction.commit();
    return res
      .status(201)
      .json({ data, message: "Class created Successfully" });
  } catch (error) {
    console.log(error, ";;;;;");

    await transaction.rollback();
    return res.status(400).json({ message: error });
  }
};

// Developed
const classUpdate = async (req, res, next) => {
  const { id } = req.params;
  const { subjects, ...classDetails } = req.validatedData;
  const existData = await Class.findOne({
    where: { ...classDetails, [Op.not]: [{ id }] },
  });
  if (existData)
    return res.status(400).json({
      message: "Data already exists",
      error: { name: "Class is already registered" },
    }); // Avoid duplication
  const transaction = await sequelize.transaction();
  try {
    const data = await Class.findOne({
      where: { id, tenantId: req.tenant.id },
    });
    if (!data) return res.status(404).json({ message: "Class not found" });
    const subjectInstance = await Subject.findAll(
      {
        where: { id: subjects },
      },
      { transaction }
    );

    if (subjectInstance.length !== subjects.length) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Some subjects does not exist",
        error: { subjects: "Clear the subjects and select again" },
      });
    }
    data.updateFormData(classDetails);
    await data.save({ transaction });
    await data.setSubjects(subjectInstance, { transaction });
    await transaction.commit();
    return res
      .status(200)
      .json({ data, message: "Class updated Successfully", version: 2 });
  } catch (error) {
    await transaction.rollback();
    return res.status(400).json({ message: error, versoin: 2 });
  }
};

// !later
const classDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Class.findOne({ where: { id, tenantId: req.tenant.id } });
  if (!data) return res.status(404).json({ message: "Class not found" });
  await data.destroy();
  return res.status(200).json({ message: "Class Deleted Successfully" });
});

// Developed
const subjectList = tryCatch(async (req, res, next) => {
  const { rows: data, count } = await Subject.findAndCountAll({
    where: { tenantId: req.tenant.id },
    attributes: ["id", "name", "code"],
    order: [["name", "ASC"]],
  });
  return res.status(200).json({
    data,
    totalRecords: count,
    message: "Subject data fetched Successfully",
    version: 2,
  });
});

// Developed
const subjectCreate = tryCatch(async (req, res, next) => {
  let data = await Subject.findOne({
    where: { ...req.validatedData, tenantId: req.tenant.id },
  });
  if (data)
    return res.status(400).json({
      message: "Data already exists",
      error: { name: "Subject already registered" },
      version: 2,
    }); // Avoid duplication
  data = await Subject.create({
    ...req.validatedData,
    tenantId: req.tenant.id,
  });
  return res
    .status(200)
    .json({ data, message: "Subject created Successfully", version: 2 });
});

// Developed
const subjectUpdate = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const existData = await Subject.findOne({
    where: { ...req.validatedData, [Op.not]: [{ id }] },
  });
  if (existData)
    return res.status(400).json({
      message: "Data already exists",
      error: { name: "Subject already registered" },
    }); // Avoid duplication
  const data = await Subject.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!data) return res.status(404).json({ message: "Subject not found" });
  data.updateFormData(req.validatedData);
  await data.save();
  return res
    .status(200)
    .json({ data, message: "Subject updated Successfully" });
});

// Developed
const subjectDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Subject.findOne({
    where: { id, tenantId: req.tenant.id },
  });
  if (!data)
    return res.status(404).json({ message: "Subject not found", version: 2 });
  await data.destroy();
  return res
    .status(200)
    .json({ message: "Subject Deleted Successfully", version: 2 });
});

// Developed
const getClassSubjects = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Class.findOne({
    where: {
      id,
      tenantId: req.tenant.id,
    },
    include: {
      model: Subject,
      through: { attributes: [] },
    },
  });
  return res.status(200).json({
    data: data.Subjects,
    message: "Class subjects fetched successfully",
    version: 2,
  });
});

// Developed
const getTeachersFromClass = tryCatch(async (req, res, next) => {
  const { id } = req.params;

  let data = await ClassTeacher.findAll({
    where: { classId: id },
    include: [
      {
        model: Teacher,
        attributes: ["id", "accountId"], // Direct fields in Teacher table
        include: [
          {
            model: Account,
            as: "accountDetails", // Use the correct alias from the association
            attributes: [
              "id",
              "fullName",
              "firstName",
              "lastName",
              "email",
              "phoneNumber",
            ], // Fields from Account table
            include: [
              {
                model: Teacher,
                as: "teacherProfile",
              },
            ],
          },
        ],
      },
      {
        model: Subject,
        as: "Subject", // Alias defined in the association
        attributes: ["id", "name", "code"], // Fields from Subject table
      },
    ],
    attributes: ["id", "teacherRole", "classId", "teacherId", "subjectId"], // Fields from ClassTeacher table
  });

  console.dir(data, "pppppppppppppppppppppppppppppppppppppppppp");

  data = data.map((teacher) => {
    return {
      id: teacher.Teacher.accountId,
      firstName: teacher.Teacher.accountDetails.firstName,
      lastName: teacher.Teacher.accountDetails.lastName,
      email: teacher.Teacher.accountDetails.email,
      fullName: teacher.Teacher.accountDetails.fullName,
      phoneNumber: teacher.Teacher.accountDetails.phoneNumber,
      profilePicture:
        teacher.Teacher.accountDetails.teacherProfile.profilePicture,
      subject: {
        id: teacher.Subject.id,
        name: teacher.Subject.name,
        code: teacher.Subject.code,
      },
      teacherRole: teacher.teacherRole,
    };
  });

  return res.status(200).json({
    message: "Teachers fetched successfully",
    data,
    version: 2,
  });
});

// Developed
const addTeacherstoClass = tryCatch(async (req, res, next) => {
  // class Id
  const { id } = req.params;

  const teacher = await Teacher.findOne({
    where: { accountId: req.validatedData.teacherId },
    attributes: ["accountId", "id"],
  });

  if (!teacher) {
    return res.status(404).json({
      message: "Teacher not found.",
      error: { teacherId: "Please select the teacher again" },
    });
  }

  const isClassHasSubject = await ClassSubject.findOne({
    where: { subjectId: req.validatedData.subjectId, classId: id },
  });

  if (!isClassHasSubject) {
    return res.status(404).json({
      message: "Validation Error",
      error: { subjectId: "The subject is not associated with this class" },
    });
  }

  if (req.validatedData.teacherRole === "class") {
    let isClassTeacherExist = await ClassTeacher.findOne({
      where: {
        teacherId: teacher.id,
        teacherRole: "class",
      },
    });
    if (isClassTeacherExist) {
      return res.status(400).json({
        message: "Validation Error",
        version: "v2",
        error: {
          teacherId: `Teacher is already assigned to ${isClassTeacherExist.classId == id ? "this" : "a"} class as Class Teacher`,
        },
      });
    }

    const isClassHasClassTeacher = await ClassTeacher.findOne({
      where: {
        classId: id,
        teacherRole: "class",
      },
    });
    if (isClassHasClassTeacher) {
      return res.status(400).json({
        message: "Validation Error",
        version: "v2",
        error: {
          subjectId: "This class has already assigned to a class teacher",
        },
      });
    }

    const data = await ClassTeacher.create({
      subjectId: req.validatedData.subjectId,
      classId: id,
      teacherId: teacher.id,
      teacherRole: "class",
    });
    return res
      .status(201)
      .json({ data, version: 2, message: "Class teacher added successfully" });
  }

  const isClassHasSubjectTeacher = await ClassTeacher.findOne({
    where: {
      teacherId: teacher.id,
      classId: id,
      teacherRole: "subject",
      subjectId: req.validatedData.subjectId,
    },
  });

  if (isClassHasSubjectTeacher) {
    return res.status(400).json({
      message: "Validation Error",
      error: {
        subjectId: "This data is already exist",
        teacherId: "This data is already exist",
        teacherRole: "This data is already exist",
      },
    });
  }

  const data = await ClassTeacher.create({
    subjectId: req.validatedData.subjectId,
    classId: id,
    teacherId: teacher.id,
    teacherRole: "subject",
  });

  return res.status(201).json({
    message: "Teacher added to the class Successfully",
    data,
    version: 2,
  });
});

const addSubjectstoClass = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { subjectId } = req.validatedData;
  const subject = await Subject.findOne({ where: { id: subjectId } });
  const isDataAlreadyExist = await ClassSubject.findOne({
    where: {
      classId: id,
      subjectId: subjectId,
    },
  });
  if (isDataAlreadyExist) {
    return res.status(400).json({
      message: "",
      error: su,
    });
  }
});

// !need to look into this
const removeTeacherFromClass = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await ClassTeacher.findOne({
    where: { id: id },
  });
  if (!data) return res.status(404).json({ message: "Data not Found" });
  await data.destroy();
  return res.status(200).json({ message: "Data removed successfully" });
});

// Developed
const fetchClassStudents = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Account.findAll({
    where: { tenantId: req.tenant.id, userRole: "student" },
    include: [
      {
        model: Student,
        as: "studentProfile",
        where: { classId: id },
        attributes: {
          exclude: [
            "tenantId",
            "createdAt",
            "updatedAt",
            "deletedAt",
            "accountId",
            "studentId",
            "classId",
          ],
        },
      },
    ],
    attributes: {
      exclude: [
        "password",
        "tenantId",
        "isAdmin",
        "userRole",
        "isActive",
        "isSuperuser",
      ],
    },
  });
  return res
    .status(200)
    .json({ message: "Student data fetched Successfully.!", data });
});

const fetchClassExams = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Exam.findAll({
    where: {
      classId: id,
    },
    include: [
      {
        model: ExamSubject,
        as: "examSubjects",
        include: [
          {
            model: Subject,
          },
        ],
      },
    ],
  });
  return res.status(200).json({ message: "Exam's fetched successfully", data });
});

module.exports = {
  classList,
  classCreate,
  classView,
  classUpdate,
  classDelete,
  subjectList,
  subjectCreate,
  subjectUpdate,
  subjectDelete,
  addTeacherstoClass,
  getTeachersFromClass,
  removeTeacherFromClass,
  fetchClassStudents,
  getClassSubjects,
  fetchClassExams,
};
