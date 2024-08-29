const Joi = require("joi");

const classSchema = Joi.object({
  name: Joi.string().min(1).required(),
});

module.exports = {
  classSchema,
};
