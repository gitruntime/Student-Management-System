const Joi = require("joi");

const studentPOSTSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().optional().allow(""),
  email: Joi.string().email().required(),
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
