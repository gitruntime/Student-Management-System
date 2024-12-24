const Joi = require("joi");
const { isAdmin } = require("../../../middlewares");

const tenantSchema = Joi.object({
  name: Joi.string().min(1).required(),
  subdomainPrefix: Joi.string().min(1).required(),
});

const tenantUserCreateSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().optional(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  tenantId: Joi.number().required(),
  userRole: Joi.string().default("admin"),
});

const tenantUserUpdateSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().optional(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  tenantId: Joi.number().required().optional(),
  username: Joi.string().optional(),
  phoneNumber: Joi.string().optional(),
  userRole: Joi.string().required().default("admin"),
  dateOfBirth: Joi.date().less("now").optional(),
  isAdmin: Joi.boolean().default(true),
});

module.exports = {
  tenantSchema,
  tenantUserCreateSchema,
  tenantUserUpdateSchema,
};
