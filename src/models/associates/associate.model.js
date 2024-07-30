const { Account, Permission } = require("../accounts/auth.model");
const { Admin } = require("../admin/admin.model");
const { Teacher, Class, Subject } = require("../teachers/teacher.model");
const { Address, BankDetail } = require("../common.model");
const { Employment } = require("../teachers/employment.model");
const { Certificate, Experience } = require("../teachers/profession.model");
const { Student } = require("../students/student.model");
const { Parent } = require("../parents/parent.model");

Account.belongsToMany(Permission, {
  through: "accounts_permissions",
  foreignKey: "account_id",
  otherKey: "permission_id",
});
Permission.belongsToMany(Account, {
  through: "accounts_permissions",
  foreignKey: "permission_id",
  otherKey: "account_id",
});

Account.hasOne(Teacher, { foreignKey: "account_id", as: "teachers" });
Teacher.belongsTo(Account, { foreignKey: "account_id", as: "accounts" });

Account.hasOne(Admin, { foreignKey: "account_id", as: "admin" });
Admin.belongsTo(Teacher, { foreignKey: "account_id", as: "accounts" });

Account.hasOne(Student, { foreignKey: "account_id", as: "students" });
Student.belongsTo(Account, { foreignKey: "account_id", as: "accounts" });

Account.hasOne(Parent, { foreignKey: "account_id", as: "parents" });
Parent.belongsTo(Account, { foreignKey: "account_id", as: "accounts" });

Account.hasMany(Address, { foreignKey: "account_id", as: "address" });
Address.belongsTo(Account, { foreignKey: "account_id", as: "accounts" });

Teacher.hasOne(BankDetail, { foreignKey: "teacher_id", as: "bank_details" });
BankDetail.belongsTo(Teacher, { foreignKey: "teacher_id", as: "teachers" });

Teacher.hasOne(Employment, { foreignKey: "teacher_id", as: "employments" });
Employment.belongsTo(Teacher, { foreignKey: "teacher_id", as: "teachers" });

Teacher.hasMany(Certificate, { foreignKey: "teacher_id", as: "certificates" });
Certificate.belongsTo(Teacher, { foreignKey: "teacher_id", as: "teachers" });

Teacher.hasMany(Experience, { foreignKey: "teacher_id", as: "experiences" });
Experience.belongsTo(Teacher, { foreignKey: "teacher_id", as: "teachers" });

Teacher.belongsToMany(Class, {
  through: "teachers_classes",
  foreignKey: "teacher_id",
  otherKey: "classes_id",
});
Class.belongsToMany(Teacher, {
  through: "teachers_classes",
  foreignKey: "classes_id",
  otherKey: "teacher_id",
});

Class.belongsToMany(Subject, {
  through: "classes_subjects",
  foreignKey: "classes_id",
  otherKey: "subjects_id",
});
Subject.belongsToMany(Class, {
  through: "classes_subjects",
  foreignKey: "subjects_id",
  otherKey: "classes_id",
});

Class.hasMany(Student, { foreignKey: "class_id", as: "students" });
Student.belongsTo(Class, { foreignKey: "class_id", as: "classes" });

module.exports = {
  Account,
  Permission,
  Teacher,
  Admin,
  Address,
};
