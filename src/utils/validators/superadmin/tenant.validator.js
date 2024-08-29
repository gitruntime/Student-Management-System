const Joi = require("joi");

const tenantSchema = Joi.object({
  name: Joi.string().min(1).required(),
  subdomainPrefix: Joi.string().min(1).required(),
});

module.exports = { tenantSchema };
