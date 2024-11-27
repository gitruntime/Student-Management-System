const Joi = require("joi");

const StudentProfileSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  dateOfBirth: Joi.date().allow(null).optional(),
  bio: Joi.string().allow(null).optional(),
  username: Joi.string().allow(null).optional(),
  bloodGroup: Joi.string()
    .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
    .allow(null)
    .optional(),
});

const AddressSchema = Joi.object({
  city: Joi.string().required(),
  state: Joi.string().required(),
  pincode: Joi.number().integer().positive().required(),
  streetAddress: Joi.string().required(),
  country: Joi.string().required(),
  phoneNumber: Joi.string()
    .pattern(/^(\+91|91)?[6-9]\d{9}$|^\+?\d{7,15}$/)
    .optional(),
  addressType: Joi.string().valid("Residential", "Permenant").required(),
});

const StudentGoalSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().valid("long term", "short term").required(),
  description: Joi.string().allow("").optional(),
});

const StudentVolunteerSchema = Joi.object({
  organisationName: Joi.string().required(),
  role: Joi.string().required(),
  duration: Joi.string().required(),
  impact: Joi.string().optional().allow(""),
});
const interestSchema = Joi.object({
  interests: Joi.array().items(Joi.string()).min(1).unique().required(),
});
const interestDeleteSchema = Joi.object({
  interests: Joi.array().items(Joi.number()).min(1).unique().required(),
});
module.exports = {
  StudentGoalSchema,
  StudentVolunteerSchema,
  StudentProfileSchema,
  AddressSchema,
  interestSchema,
  interestDeleteSchema,
};
