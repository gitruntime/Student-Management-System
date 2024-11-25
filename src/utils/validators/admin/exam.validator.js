const Joi = require("joi");

const examSchema = Joi.object({
  name: Joi.string().required(),
  classId: Joi.number().required(),
  startDate: Joi.date().iso().required(),
  isPublished: Joi.boolean().default(false),
  endDate: Joi.date()
    .iso()
    .optional()
    .allow("")
    .allow("")
    .custom((value, helpers) => {
      if (value === "") return null;
      return value;
    }),
  subjects: Joi.array()
    .items(
      Joi.object({
        subjectId: Joi.number().required(),
        examDate: Joi.date().iso().required(),
        startTime: Joi.string()
          .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
          .required(),
        endTime: Joi.string()
          .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
          .required(),
        maxScore: Joi.number().min(0).required(),
      })
    )
    .min(1)
    .required(),
});

module.exports = {
  examSchema,
};
