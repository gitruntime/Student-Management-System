const Joi = require("joi");

const subjectSchema = Joi.object({
  name: Joi.string().min(1).required(),
});

module.exports = {
  subjectSchema,
};
