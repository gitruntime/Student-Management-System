const Joi = require("joi");

const studentPOSTSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().optional(),
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

const AttendancePOSTSchema = Joi.object({
  attendanceDate: Joi.date().required(),
  status: Joi.string().valid("present", "absent", "excused", "late").required(),
  checkIn: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
    .optional()
    .messages({
      "string.pattern.base":
        "Check-in must be a valid time in HH:MM:SS format.",
    }),
  checkOut: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
    .optional()
    .messages({
      "string.pattern.base":
        "Check-out must be a valid time in HH:MM:SS format.",
    }),
});

module.exports = {
  studentPOSTSchema,
  AttendancePOSTSchema,
};
