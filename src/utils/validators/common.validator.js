const Joi = require("joi");

const addressSchema = Joi.object({
  city: Joi.string().min(1).required(),
  state: Joi.string().min(1).required(),
  pincode: Joi.number().integer().required(),
  street_address: Joi.string().min(1).required(),
  country: Joi.string().min(1).required(),
  phone_number: Joi.string()
    .pattern(/^[0-9]+$/)
    .allow(null),
});

const bankDetailSchema = Joi.object({
  name: Joi.string().min(1).required(),
  address: Joi.string().allow(null),
  holder_name: Joi.string().min(1).required(),
  account_number: Joi.string().min(1).required(),
  ifsc_code: Joi.string().min(1).required(),
  account_type: Joi.string()
    .valid("current", "savings", "salary")
    .default("savings"),
});

const attendanceSchema = Joi.object({
  status: Joi.string().valid("present", "leave", "late").default("present"),
});

module.exports = {
  addressSchema,
  bankDetailSchema,
  attendanceSchema,
};
