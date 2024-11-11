const Joi = require("joi");

const subjectSchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = {
  subjectSchema,
};
