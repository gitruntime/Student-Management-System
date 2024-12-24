const Joi = require("joi");

const classPOSTSchema = Joi.object({
  name: Joi.string().required(),
  section: Joi.string()
    .optional()
    .regex(/^[A-Z]$/)
    .allow(""),
  subjects: Joi.array()
    .items(Joi.number().integer().required())
    .min(1)
    .required(),
});

const subjectPOSTSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().optional().allow(""),
});

const addTeachersToClassSchema = Joi.object({
  teacherId: Joi.number().required(),
  subjectId: Joi.number().required(),
  teacherRole: Joi.string()
    .valid("subject", "class")
    .default("subject")
    .required(),
});
module.exports = {
  classPOSTSchema,
  subjectPOSTSchema,
  addTeachersToClassSchema,
};
