const { Account, Permission } = require("./accounts");
const { Admin } = require("./admin");
const { Class, Subject } = require("./classes");
const { Address, Education } = require("./shared");
const { Tenant } = require("./core");
const { Parent } = require("./parents");
const { Student } = require("./students");
const { Teacher, Employment, Certificate, Experience } = require("./teachers");

Tenant.hasOne(Account, { foreignKey: "tenantId", as: "accounts", onDelete:'CASCADE' });
Account.belongsTo(Tenant, { foreignKey: "tenantId", as: "tenantDetails" });

Account.belongsToMany(Permission, {
  through: "accounts_permissions",
  foreignKey: "accountId",
  otherKey: "permissionId",
});
Permission.belongsToMany(Account, {
  through: "accounts_permissions",
  foreignKey: "permissionId",
  otherKey: "accountId",
});

Account.hasOne(Teacher, { foreignKey: "id", as: "teacherProfile",onDelete:"CASCADE" }); // Dont change "as" - (alias).It will cause not to be functional
Teacher.belongsTo(Account, { foreignKey: "id", as: "accountDetails" });

Account.hasOne(Admin, { foreignKey: "id", as: "admin",onDelete:"CASCADE" });
Admin.belongsTo(Teacher, { foreignKey: "id", as: "accounts" });

Account.hasOne(Student, { foreignKey: "id", as: "students",onDelete:"CASCADE" });
Student.belongsTo(Account, { foreignKey: "id", as: "accounts" });

Account.hasOne(Parent, { foreignKey: "id", as: "parents",onDelete:"CASCADE" });
Parent.belongsTo(Account, { foreignKey: "id", as: "accounts" });

Account.hasMany(Address, { foreignKey: "accountId", as: "address",onDelete:"CASCADE" });
Address.belongsTo(Account, { foreignKey: "accountId", as: "accounts" }); 

Teacher.hasOne(Employment, { foreignKey: "teacherId", as: "employments",onDelete:"CASCADE" });
Employment.belongsTo(Teacher, { foreignKey: "teacherId", as: "teachers" });

Teacher.hasMany(Certificate, { foreignKey: "teacherId", as: "certificates",onDelete:"CASCADE" });
Certificate.belongsTo(Teacher, { foreignKey: "teacherId", as: "teachers" });

Teacher.hasMany(Experience, { foreignKey: "teacherId", as: "experiences",onDelete:"CASCADE" });
Experience.belongsTo(Teacher, { foreignKey: "teacherId", as: "teachers" });

Teacher.hasMany(Education, { foreignKey: "teacherId", as: "educations",onDelete:"CASCADE" });
Education.belongsTo(Teacher, { foreignKey: "teacherId", as: "teacherDetail" });

Teacher.belongsToMany(Class, {
  through:  "teachers_classes",
  foreignKey:  "teacherId",
  otherKey: "classesId",
});
Class.belongsToMany(Teacher, {
  through: "teachers_classes",
  foreignKey: "classesId",
  otherKey: "teacherId",
});

Class.belongsToMany(Subject, {
  through: "classes_subjects",
  foreignKey: "classesId",
  otherKey: "subjectsId",
});
Subject.belongsToMany(Class, {
  through: "classes_subjects",
  foreignKey: "subjectsId",
  otherKey: "classesId",
});

Class.hasMany(Student, { foreignKey: "classId", as: "students" });
Student.belongsTo(Class, { foreignKey: "classId", as: "classes" });

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
  Education,
};
