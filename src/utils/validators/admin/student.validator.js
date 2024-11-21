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

module.exports = {
  studentPOSTSchema,
};
