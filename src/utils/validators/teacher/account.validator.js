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
  startDate: Joi.date().required(),
  endDate: Joi.date().optional(),
  description: Joi.string().optional(),
});

module.exports = {
  teacherProfileSchema,
  addressSchema,
  certificateSchema,
  educationSchema
};
