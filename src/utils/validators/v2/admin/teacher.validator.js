const Joi = require("joi");

const teacherPOSTSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().optional(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  dateOfBirth: Joi.string().allow("").optional(),
  phoneNumber: Joi.string().allow("").optional(),
});

module.exports = {
  teacherPOSTSchema,
};
