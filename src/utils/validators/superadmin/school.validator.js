const Joi = require("joi");

const SchoolsPOSTSchema = Joi.object({
  subdomainPrefix: Joi.string().required(),
  organisationName: Joi.string().required(),
  establishedYear: Joi.string().optional(),
  email: Joi.string().required(),
  phoneNumber: Joi.string().optional(),
  userRole: Joi.string().default("admin"),
});

module.exports = { SchoolsPOSTSchema };
