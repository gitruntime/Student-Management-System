/**
 * => Here we set all the relationship with each Model.
 * => Here we create all the Junction Table
 * => This file is for centralised exports to make file as standard
 */
const { Account, Permission } = require("./accounts");
const { Admin } = require("./admin");
const { Class, Subject, Exam, Event } = require("./classes");
const { Address, Education } = require("./shared");
const { Tenant, Interest } = require("./core");
const { Parent } = require("./parents");
const {
  Student,
  Attendance,
  MedicalRecord,
  StudentExam,
  EventParticipation,
  Award,
  Mark,
} = require("./students");
const { Teacher, Employment, Certificate, Experience } = require("./teachers");
const { Model, DataTypes } = require("sequelize");
const { db: sequelize } = require("../configs/db.config");

// Base ---------------------------------------------------->

Tenant.hasOne(Account, {
  foreignKey: "tenantId",
  as: "account",
  onDelete: "CASCADE",
});
Account.belongsTo(Tenant, { foreignKey: "tenantId", as: "tenantDetails" });

// Shared ----------------------------------------------------------------------->

Account.hasMany(Address, {
  foreignKey: "accountId",
  as: "addresses",
  onDelete: "CASCADE",
});
Address.belongsTo(Account, { foreignKey: "accountId", as: "account" });

Account.belongsToMany(Interest, {
  through: "students_interests",
  foreignKey: "interestId",
  otherKey: "accountId",
});
Interest.belongsToMany(Account, {
  through: "students_interests",
  foreignKey: "accountId",
  otherKey: "interestId",
});

Account.hasMany(MedicalRecord, {
  foreignKey: "accountId",
  as: "medical_records",
});
MedicalRecord.belongsTo(Account, {
  foreignKey: "accountId",
  as: "account",
});

// Admin ------------------------------------------------------------------------------>
Account.hasOne(Admin, {
  foreignKey: "accountId",
  as: "adminProfile",
  onDelete: "CASCADE",
});
Admin.belongsTo(Account, { foreignKey: "accountId", as: "accounts" });

// Teacher ---------------------------------------------------------------------------->
Account.hasOne(Teacher, {
  foreignKey: "accountId",
  as: "teacherProfile",
  onDelete: "CASCADE",
});
Teacher.belongsTo(Account, { foreignKey: "accountId", as: "accountDetails" });

Teacher.hasOne(Employment, {
  foreignKey: "teacherId",
  as: "employmentDetails",
});
Employment.belongsTo(Teacher, {
  foreignKey: "teacherId",
  as: "teacherProfile",
});

Teacher.hasMany(Experience, {
  foreignKey: "teacherId",
  as: "experiences",
});
Experience.belongsTo(Teacher, {
  foreignKey: "teacherId",
  as: "teacherProfile",
});

// Student ----------------------------------------------------------------------------->
Account.hasOne(Student, {
  foreignKey: "accountId",
  as: "studentProfile",
  onDelete: "CASCADE",
});
Student.belongsTo(Account, { foreignKey: "accountId", as: "accounts" });

Student.belongsToMany(Exam, {
  through: StudentExam,
  foreignKey: "examId",
  otherKey: "studentId",
});
Exam.belongsToMany(Student, {
  through: StudentExam,
  foreignKey: "studentId",
  otherKey: "examId",
});

Student.belongsToMany(Event, {
  through: EventParticipation,
  foreignKey: "eventId",
  otherKey: "studentId",
});
Event.belongsToMany(Student, {
  through: EventParticipation,
  foreignKey: "studentId",
  otherKey: "eventId",
});

Student.hasMany(Award, { foreignKey: "studentId", as: "awards" });
Award.belongsTo(Student, { foreignKey: "studentId", as: "studentProfile" });

// Parent ------------------------------------------------------------------------------>
Account.hasOne(Parent, {
  foreignKey: "accountId",
  as: "parentProfile",
  onDelete: "CASCADE",
});
Parent.belongsTo(Account, { foreignKey: "accountId", as: "accounts" });

// Class ------------------------------------------------------------------->
Class.belongsToMany(Subject, {
  through: "classes_subjects",
  foreignKey: "classId",
  otherKey: "subjectId",
});
Subject.belongsToMany(Class, {
  through: "classes_subjects",
  foreignKey: "subjectId",
  otherKey: "classId",
});

class ClassTeacher extends Model {
  preventMultipleClassTeacher() {
    // work on later
  }
}

ClassTeacher.init(
  {
    isClassTeacher: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "classes_teachers",
  }
);

Class.belongsToMany(Teacher, {
  through: ClassTeacher,
  foreignKey: "teacherId",
  otherKey: "classId",
});
Teacher.belongsToMany(Class, {
  through: ClassTeacher,
  foreignKey: "classId",
  otherKey: "teacherId",
});

// Assignment
// Subject.belongsToMany();

// Base ------------------------------------------------------------------------->

// Account.belongsToMany(Permi  ssion, {
//   through: "accounts_permissions",
//   foreignKey: "accountId",
//   otherKey: "permissionId",
// });
// Permission.belongsToMany(Account, {
//   through: "accounts_permissions",
//   foreignKey: "permissionId",
//   otherKey: "accountId",
// });

// Teacher.hasOne(Employment, {
//   foreignKey: "teacherId",
//   as: "employments",
//   onDelete: "CASCADE",
// });
// Employment.belongsTo(Teacher, { foreignKey: "teacherId", as: "teachers" });

// Teacher.hasMany(Certificate, {
//   foreignKey: "teacherId",
//   as: "certificates",
//   onDelete: "CASCADE",
// });
// Certificate.belongsTo(Teacher, { foreignKey: "teacherId", as: "teachers" });

// Teacher.hasMany(Experience, {
//   foreignKey: "teacherId",
//   as: "experiences",
//   onDelete: "CASCADE",
// });
// Experience.belongsTo(Teacher, { foreignKey: "teacherId", as: "teachers" });

// Teacher.hasMany(Education, {
//   foreignKey: "teacherId",
//   as: "educations",
//   onDelete: "CASCADE",
// });
// Education.belongsTo(Teacher, { foreignKey: "teacherId", as: "teacherDetail" });

// Teacher.belongsToMany(Class, {
//   through: "teachers_classes",
//   foreignKey: "teacherId",
//   otherKey: "classesId",
// });
// Class.belongsToMany(Teacher, {
//   through: "teachers_classes",
//   foreignKey: "classesId",
//   otherKey: "teacherId",
// });

// Student.hasMany(Attendance, { foreignKey: "studentId", as: "attendances" });
// Attendance.belongsTo(Student, { foreignKey: "studentId", as: "students" });

// // Student.hasMany(MedicalRecord, {
// //   foreignKey: "studentId",
// //   as: "medicalRecords",
// // });
// // MedicalRecord.belongsTo(Student, {
// //   foreignKey: "studentId",
// //   as: "studentProfile",
// // });

// Student.hasMany(Award, {
//   foreignKey: "studentId",
//   as: "awards",
// });
// Award.belongsTo(Student, {
//   foreignKey: "studentId",
//   as: "studentProfile",
// });

// Class.hasMany(Student, { foreignKey: "classId", as: "students" });
// Student.belongsTo(Class, { foreignKey: "classId", as: "classes" });

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
  Attendance,
  MedicalRecord,
  Award,
};
