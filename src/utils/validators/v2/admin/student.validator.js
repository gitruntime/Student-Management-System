const Joi = require("joi");

const studentPOSTSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().optional().allow(""),
  email: Joi.string().email().required(),
  password: Joi.string()
    .required()
    .min(8)
    .max(12)
    .custom((value, helpers) => {
      if (!/[A-Z]/.test(value)) {
        return helpers.message(
          "Password must contain at least one uppercase letter"
        );
      }

      if (!/[a-z]/.test(value)) {
        return helpers.message(
          "Password must contain at least one lowercase letter"
        );
      }

      if (!/\d/.test(value)) {
        return helpers.message("Password must contain at least one digit");
      }

      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        return helpers.message(
          "Password must contain at least one special character"
        );
      }
      return value;
    })
    .default("Password@123"),
  classId: Joi.string().regex(/^\d+$/).required(),
});

const attendancePOSTSchema = Joi.object({
  attendanceDate: Joi.date().required(),
  status: Joi.string().valid("present", "absent", "excused", "late").required(),
  checkIn: Joi.string().pattern(
    /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/
  ),
  checkOut: Joi.string().pattern(
    /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/
  ),
});

module.exports = { studentPOSTSchema, attendancePOSTSchema };
