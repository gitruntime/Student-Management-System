const { Response } = require("../utils/handlers");

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: true });
  if (error) {
    const errorDetails = error.details[0];
    const validationError = {
      [errorDetails.path.join(".")]: errorDetails.message,
    };

    // Respond with a 400 status and validation error details
    return res.status(400).json({
      message: "Validation Error",
      error: validationError,
    });
  }
  req.validatedData = value;
  next();
};

module.exports = { validate };
