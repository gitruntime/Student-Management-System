const Joi = require("joi");

const teacherCreateSchema = Joi.object({
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().optional(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  userRole: Joi.string().default("teacher"),
});

const teacherUpdateSchema = Joi.object({
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().optional(),
  email: Joi.string().required(),
  username: Joi.string().optional(),
  phoneNumber: Joi.string().optional(),
  dateOfBirth: Joi.string().optional(),
  bio: Joi.string().optional(),
  bloodGroup: Joi.valid(
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-"
  ).optional(),
});

const experienceSchema = Joi.object({
  department: Joi.string().required(),
  designation: Joi.string().required(),
  dateJoined: Joi.string().required(),
});

const certificateSchema = Joi.object({
  title: Joi.string().required(),
  link: Joi.string().required(),
});

const educationSchema = Joi.object({
  name: Joi.string().required(),
  fieldOfStudy: Joi.string().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  description: Joi.date().optional(),
});

module.exports = {
  teacherCreateSchema,
  teacherUpdateSchema,
  experienceSchema,
  certificateSchema,
  educationSchema,
};
