const Joi = require("joi");

const classSchema = Joi.object({
  name: Joi.string().required(),
  section: Joi.string().optional().allow(""),
});

const classSubjectsSchema = Joi.object({
  subjectIds: Joi.array().items(Joi.number()).required(),
});

const addTeachersToClassSchema = Joi.object({
  teacherId: Joi.number().required(),
  subjectId: Joi.number().required(),
  teacherRole: Joi.string().valid("subject", "class").default("subject"),
});

module.exports = {
  classSchema,
  classSubjectsSchema,
  addTeachersToClassSchema,
};
