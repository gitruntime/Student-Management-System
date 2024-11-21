const Joi = require("joi");

const AssignmentSchema = Joi.object({
  name: Joi.string().required(),
  dueDate: Joi.string().required(),
  documents: Joi.date().optional(),
  priority: Joi.string().required(),
  classId: Joi.number().required(),
  subjectId: Joi.number().required(),
});

module.exports = {
  AssignmentSchema,
};
