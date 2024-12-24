const Joi = require("joi");

const teacherPOSTSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().optional().allow(""),
  email: Joi.string().required(),
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
  dateOfBirth: Joi.string().allow("").optional(),
  phoneNumber: Joi.string().allow("").optional(),
});

module.exports = {
  teacherPOSTSchema,
};
