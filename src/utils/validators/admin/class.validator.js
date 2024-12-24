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

const addStudentsToClassSchema = Joi.object({
  studentIds: Joi.array().items(Joi.number()).min(1).required().unique(),
});

module.exports = {
  classSchema,
  classSubjectsSchema,
  addTeachersToClassSchema,
  addStudentsToClassSchema
};
