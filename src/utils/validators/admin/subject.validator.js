const Joi = require("joi");

const subjectSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().optional().allow(""),
});

module.exports = {
  subjectSchema,
};
