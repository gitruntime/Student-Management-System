const { classSchema } = require("./class.validator");
const { studentPOSTSchema, AttendancesSchema } = require("./student.validator");
const { subjectSchema } = require("./subject.validator");
const {
  teacherCreateSchema,
  teacherUpdateSchema,
  experienceSchema,
  certificateSchema,
} = require("./teacher.validator");

const AdminValidator = {
  classSchema,
  subjectSchema,
  teacherCreateSchema,
  teacherUpdateSchema,
  experienceSchema,
  certificateSchema,
  studentPOSTSchema,
  AttendancesSchema
};

module.exports = AdminValidator;
