const Joi = require("joi");

const parentPOSTSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().optional().allow(""),
  email: Joi.string().email().required(),
  username: Joi.string().optional().allow(""),
  phoneNumber: Joi.string().optional().allow(""),
  dateOfBirth: Joi.date().optional().allow(""),
  profilePicture: Joi.string().uri().optional().allow(""),
  bio: Joi.string().optional().allow(""),
  bloodGroup: Joi.string().optional().allow(""),
  sex: Joi.string().optional().allow(""),
  password: Joi.string()
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
  students: Joi.array()
    .items(Joi.string().alphanum().min(1).required())
    .messages({
      "array.base": "IDs must be an array",
      "array.empty": "IDs cannot be empty",
      "array.min": "At least one ID is required",
      "string.base": "Each ID must be a string",
      "string.empty": "Each ID cannot be empty",
      "string.alphanum": "Each ID must be alphanumeric",
      "any.required": "IDs are required",
    }),
});

module.exports = {
  parentPOSTSchema,
};
