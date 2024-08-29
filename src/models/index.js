const { Account, Permission } = require("./accounts");
const { Admin } = require("./admin");
const { Class, Subject } = require("./classes");
const { Address } = require("./shared");
const { Tenant } = require("./core");
const { Parent } = require("./parents");
const { Student } = require("./students");
const { Teacher, Employment, Certificate, Experience } = require("./teachers");

Tenant.hasOne(Account, { foreignKey: "tenantId", as: "accounts" });
Account.belongsTo(Tenant, { foreignKey: "tenantId", as: "tenants" });

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

Account.hasOne(Teacher, { foreignKey: "id", as: "teachers" });
Teacher.belongsTo(Account, { foreignKey: "id", as: "accounts" });

Account.hasOne(Admin, { foreignKey: "id", as: "admin" });
Admin.belongsTo(Teacher, { foreignKey: "id", as: "accounts" });

Account.hasOne(Student, { foreignKey: "id", as: "students" });
Student.belongsTo(Account, { foreignKey: "id", as: "accounts" });

Account.hasOne(Parent, { foreignKey: "id", as: "parents" });
Parent.belongsTo(Account, { foreignKey: "id", as: "accounts" });

Account.hasMany(Address, { foreignKey: "id", as: "address" });
Address.belongsTo(Account, { foreignKey: "id", as: "accounts" });

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
  Experience,
  Admin,
  Address,
  Certificate,
  Student,
  Parent,
  Class,
  Subject,
  Tenant,
};
