const Joi = require("joi");

const teacherSchema = Joi.object({
  first_name: Joi.string().min(1).required(),
  last_name: Joi.string().optional(),
  email: Joi.string().email().required(),
  phone_number: Joi.string().optional(),
  user_role: Joi.string()
    .valid("student", "teacher", "admin", "parent", "normal")
    .default("teacher"),
  password: Joi.string()
    .min(8)
    .max(12)
    .pattern(/[A-Z]/, "uppercase letter")
    .pattern(/[a-z]/, "lowercase letter")
    .pattern(/\d/, "digit")
    .pattern(/[!@#$%^&*(),.?":{}|<>]/, "special character")
    .required(),
  date_of_birth: Joi.date().max("now").allow(null),
  is_active: Joi.boolean().default(false),
  bio: Joi.string().min(1).optional(),
});

const experienceSchema = Joi.object({
  department: Joi.string().min(1).required(),
  designation: Joi.string().min(1).required(),
  date_joined: Joi.date().required(),
});

const certificateSchema = Joi.object({
  title: Joi.string().min(1).required(),
  link: Joi.string().uri().optional(),
});

module.exports = {
  teacherSchema,
  experienceSchema,
  certificateSchema,
};
