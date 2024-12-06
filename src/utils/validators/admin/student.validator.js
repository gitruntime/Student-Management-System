const Joi = require("joi");

const studentPOSTSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().optional().allow(""),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(12)
    .regex(/[A-Z]/, "uppercase")
    .regex(/[a-z]/, "lowercase")
    .regex(/\d/, "number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "special character")
    .messages({
      "string.min": "Password length must be at least 8 characters",
      "string.max":
        "Password length must be less than or equal to 12 characters",
      "string.pattern.name": "Password must contain at least one {#name}",
    })
    .optional(),
});

const AttendancesSchema = Joi.object({
  attendanceDate: Joi.date().iso().required(),
  status: Joi.string().valid("present", "absent", "excused", "late").required(),
  checkIn: Joi.string().pattern(
    /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/
  ),
  checkOut: Joi.string().pattern(
    /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/
  ),
});

const CreateMarksSchema = Joi.object({
  examId: Joi.string().required().messages({
    "any.required": "Exam ID is required",
    "string.base": "Exam ID must be a string",
  }),
  examSubjectId: Joi.string().required().messages({
    "any.required": "Exam Subject ID is required",
    "string.base": "Exam Subject ID must be a string",
  }),
  grade: Joi.string().valid("A", "B", "C", "D", "E", "F").required().messages({
    "any.required": "Grade is required",
    "string.base": "Grade must be a string",
    "any.only": "Grade must be one of A, B, C, D, E, or F",
  }),
  marksObtained: Joi.number().min(0).max(100).required().messages({
    "any.required": "Marks are required",
    "number.base": "Marks must be a number",
    "number.min": "Marks cannot be less than 0",
    "number.max": "Marks cannot be more than 100",
  }),
  subjectId: Joi.string().optional().allow(""),
});

module.exports = {
  studentPOSTSchema,
  AttendancesSchema,
  CreateMarksSchema,
};
