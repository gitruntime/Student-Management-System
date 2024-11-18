const Joi = require("joi");

const classSchema = Joi.object({
  name: Joi.string().required(),
  section: Joi.string().optional().allow(""),
});

const classSubjectsSchema = Joi.object({
  subjectIds: Joi.array().items(Joi.number()).required(),
});

module.exports = {
  classSchema,
  classSubjectsSchema,
};
