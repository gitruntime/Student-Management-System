const Joi = require("joi");

const teacherProfileSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().optional(),
  dateOfBirth: Joi.date().max("now").allow(null),
  bio: Joi.string().min(1).optional(),
  bloodGroup: Joi.string().optional(),
});

const addressSchema = Joi.object({
  city: Joi.string().required(),
  state: Joi.string().required(),
  pincode: Joi.string().required(),
  streetAddress: Joi.string().required(),
  country: Joi.string().required(),
  phoneNumber: Joi.string().optional(),
  addressType: Joi.string().optional(),
});

const certificateSchema = Joi.object({
  title: Joi.string().required(),
  link: Joi.string().uri().required(),
});

const educationSchema = Joi.object({
  name: Joi.string().required(),
  fieldOfStudy: Joi.string().required(),
  startDate: Joi.date().required().messages({
    "any.required": "startDate is required.",
    "date.base": "startDate must be a valid date.",
  }),
  endDate: Joi.date()
    .when("isPresent", {
      is: true,
      then: Joi.valid(null).messages({
        "any.only": "endDate must be null when isPresent is true.",
      }),
      otherwise: Joi.required().messages({
        "any.required": "endDate is required when isPresent is false.",
        "date.base": "endDate must be a valid date.",
      }),
    })
    .allow(null),
  isPresent: Joi.boolean().required().messages({
    "any.required": "isPresent is required.",
    "boolean.base": "isPresent must be a boolean value.",
  }),
  description: Joi.string().optional(),
  location: Joi.string().required(),
});

const experienceSchema = Joi.object({
  title: Joi.string().required(),
  company: Joi.string().required(),
  startDate: Joi.date().required().messages({
    "any.required": "startDate is required.",
    "date.base": "startDate must be a valid date.",
  }),
  endDate: Joi.date()
    .when("isPresent", {
      is: true,
      then: Joi.valid(null).messages({
        "any.only": "endDate must be null when isPresent is true.",
      }),
      otherwise: Joi.required().messages({
        "any.required": "endDate is required when isPresent is false.",
        "date.base": "endDate must be a valid date.",
      }),
    })
    .allow(null),
  isPresent: Joi.boolean().required().messages({
    "any.required": "isPresent is required.",
    "boolean.base": "isPresent must be a boolean value.",
  }),
});

module.exports = {
  teacherProfileSchema,
  addressSchema,
  certificateSchema,
  educationSchema,
  experienceSchema,
};
