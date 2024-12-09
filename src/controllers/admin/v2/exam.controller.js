const { db: sequelize } = require("../../../configs/db.config");
const {
  Exam,
  ExamSubject,
  Subject,
  Class,
  Student,
} = require("../../../models");
const { tryCatch } = require("../../../utils/handlers/tryCatch");

const examList = tryCatch(async (req, res, next) => {
  const { studentId } = req.query;
  // I know this is very useless thing but we dont have documentation, no UI, no workflow, cause of that my brain is twisted, change it later
  const whereCondition = {
    tenantId: req.tenant.id,
  };
  if (studentId) {
    const student = await Student.findOne({
      where: { accountId: studentId, tenantId: req.tenant.id },
      attributes: ["classId"],
    });
    whereCondition.classId = student.classId;
  }

  let data = await Exam.findAll({
    where: whereCondition,
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

  data = data.map((exam) => {
    return {
      id: exam.id,
      name: exam.name,
      startDate: exam.startDate,
      endDate: exam.endDate,
      isPublished: exam.isPublished,
      classId: exam.classId,
      subjects: exam.examSubjects.map((subject) => {
        return {
          subjectId: subject.subjectId,
          maxScore: subject.maxScore,
          startTime: subject.startTime,
          endTime: subject.endTime,
          examDate: subject.examDate,
        };
      }),
      subjectDetails: exam.examSubjects.map((subject) => {
        return {
          id: subject.Subject.id,
          subjectName: subject.Subject.name + " " + subject.Subject.code,
        };
      }),
    };
  });

  return res.status(200).json({ message: "Exam fetched successfully", data });
});

// Used transaction here for partial data creation
const examCreate = tryCatch(async (req, res, next) => {
  const { subjects, ...exam } = req.validatedData;
  const transaction = await sequelize.transaction();
  try {
    const data = await Exam.create(
      {
        ...exam,
        tenantId: req.tenant.id,
        createdBy: req.user.id,
      },
      {
        transaction,
      }
    );
    const subjectData = subjects.map((subject) => ({
      ...subject,
      examId: data.id,
      tenantId: req.tenant.id,
    }));
    await ExamSubject.bulkCreate(subjectData, { transaction });
    const examWithSubjects = await Exam.findOne({
      where: { id: data.id },
      include: [
        {
          model: ExamSubject,
          as: "examSubjects",
        },
      ],
      transaction,
    });
    await transaction.commit();
    return res.status(201).json({
      message: "Exam and subjects created successfully",
      data: examWithSubjects,
    });
  } catch (error) {
    transaction.rollback();
    return res.status(400).json({ error, message: "Something went wrong" });
  }
});

const examUpdate = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Exam.findOne({
    where: { id, tenantId: req.tenant.id },
    include: [
      {
        model: ExamSubject,
        as: "examSubjects",
      },
    ],
  });
  if (!data) return res.status(404).json({ message: "Exam not found" });
  if (data.isPublished) {
    return res.status(400).json({
      message: "Exam has already been published.Changes cannot be done",
    });
  }
  const transaction = await sequelize.transaction();
  const { subjects, ...exam } = req.validatedData;
  try {
    await data.update({ ...exam, tenantId: req.tenant.id }, { transaction });
    // Flushing the record as per the ui design
    await ExamSubject.destroy({
      where: { examId: id },
      transaction,
    });

    // creating a new records as per the ui
    const subjectData = subjects.map((subject) => ({
      ...subject,
      examId: id,
      tenantId: req.tenant.id,
    }));
    await ExamSubject.bulkCreate(subjectData, { transaction });
    await transaction.commit();
  } catch (error) {
    transaction.rollback();
    return res.status(400).json({ error, message: "Something went wrong" });
  }

  const updatedData = await Exam.findOne({
    where: { id, tenantId: req.tenant.id },
    include: [
      {
        model: ExamSubject,
        as: "examSubjects",
      },
    ],
  });

  return res.status(200).json({
    message: "Exam and subjects updated successfully",
    data: updatedData,
  });
});
const examDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Exam.findOne({
    where: { id, tenantId: req.tenant.id },
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
      {
        model: Class,
      },
    ],
  });
  if (!data) return res.status(404).json({ message: "Exam not found" });
  if (data.isPublished) {
    return res.status(400).json({
      message: "Exam has already been published.Changes cannot be done",
    });
  }
  await data.destroy();
  return res.status(200).json({ message: "Exam deleted successfully.!!" });
});

module.exports = {
  examList,
  examCreate,
  examUpdate,
  examDelete,
};
