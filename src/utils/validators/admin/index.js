const { classSchema } = require("./class.validator");
const { subjectSchema } = require("./subject.validator");
const {
  teacherCreateSchema,
  teacherUpdateSchema,
  experienceSchema,
  certificateSchema,
} = require("./teacher.validator");

module.exports = {
  classSchema,
  subjectSchema,
  teacherCreateSchema,
  teacherUpdateSchema,
  experienceSchema,
  certificateSchema,
};
