const Joi = require("joi");

const permissionSchema = Joi.object({
  title: Joi.string().required(),
  codename: Joi.string().required(),
});

module.exports = {
  permissionSchema,
};
