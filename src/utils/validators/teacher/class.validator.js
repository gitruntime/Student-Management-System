const Joi = require("joi");

const AssignmentSchema = Joi.object({
  name: Joi.string().required(),
  dueDate: Joi.string().required(),
  documents: Joi.date().optional(),
  priority: Joi.string().required(),
  classId: Joi.number().required(),
  subjectId: Joi.number().required(),
});

const ExamSchema = Joi.object({
  name: Joi.string().required(),
  date: Joi.date().iso().required(),
  examType: Joi.string().optional().allow(),
  isPublished: Joi.boolean().default(false),
});
const ExamSubjectSchema = Joi.object;

module.exports = {
  AssignmentSchema,
};
