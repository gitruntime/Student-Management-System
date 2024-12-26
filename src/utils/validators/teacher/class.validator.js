const Joi = require("joi");

const AssignmentSchema = Joi.object({
  id: Joi.number().integer().positive().optional(),
  classId: Joi.number().required(),
  name: Joi.string().required(),
  dueDate: Joi.date().required(),
  documents: Joi.array()
    .items(Joi.string().uri({ scheme: ["http", "https", "ftp"] }))
    .optional()
    .messages({
      "array.base": "The value must be an array of URLs.",
      "string.uri": "Invalid URL provided.",
    }),
  priority: Joi.string().valid("high", "medium", "low").default("high"),
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
