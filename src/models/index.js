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
const { Assignment } = require("./classes/class.model");
const { Volunteer, Goal } = require("./students/academic.model");
const { Document } = require("./shared/document.model");

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

Account.hasMany(Document, {
  foreignKey: "accountId",
  as: "documents",
  onDelete: "CASCADE",
});
Document.belongsTo(Account, { foreignKey: "accountId", as: "account" });

Account.hasMany(Certificate, {
  foreignKey: "accountId",
  as: "certificates",
  onDelete: "CASCADE",
});
Certificate.belongsTo(Account, { foreignKey: "accountId", as: "account" });

Account.belongsToMany(Interest, {
  through: "account_interests",
  foreignKey: "accountId",
  otherKey: "interestId",
});
Interest.belongsToMany(Account, {
  through: "account_interests",
  foreignKey: "interestId",
  otherKey: "accountId",
});

Account.hasMany(MedicalRecord, {
  foreignKey: "accountId",
  as: "medical_records",
  onDelete: "CASCADE",
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
Admin.belongsTo(Account, { foreignKey: "accountId", as: "accountDetails" });

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
  onDelete: "CASCADE",
});
Employment.belongsTo(Teacher, {
  foreignKey: "teacherId",
  as: "teacherProfile",
});

Teacher.hasMany(Experience, {
  foreignKey: "teacherId",
  as: "experiences",
  onDelete: "CASCADE",
});
Experience.belongsTo(Teacher, {
  foreignKey: "teacherId",
  as: "teacherProfile",
});
Teacher.hasMany(Education, {
  foreignKey: "teacherId",
  as: "educations",
  onDelete: "CASCADE",
});
Education.belongsTo(Teacher, {
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

Student.hasMany(Volunteer, {
  foreignKey: "studentId",
  as: "volunteerings",
  onDelete: "CASCADE",
});
Student.belongsTo(Volunteer, {
  foreignKey: "studentId",
  as: "volunteerStudentData",
});

Student.hasMany(Goal, {
  foreignKey: "studentId",
  as: "goals",
  onDelete: "CASCADE",
});
Student.belongsTo(Goal, {
  foreignKey: "studentId",
  as: "goalStudentData",
});
// Student.belongsToMany(Exam, {
//   through: StudentExam,
//   foreignKey: "examId",
//   otherKey: "studentId",
// });
// Exam.belongsToMany(Student, {
//   through: StudentExam,
//   foreignKey: "studentId",
//   otherKey: "examId",
// });

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

Student.hasMany(Award, {
  foreignKey: "studentId",
  as: "awards",
  onDelete: "CASCADE",
});
Award.belongsTo(Student, { foreignKey: "studentId", as: "studentProfile" });

Student.hasMany(Attendance, {
  foreignKey: "studentId",
  as: "attendances",
  onDelete: "CASCADE",
});
Attendance.belongsTo(Student, {
  foreignKey: "studentId",
  as: "studentProfile",
});

// Parent ------------------------------------------------------------------------------>
Account.hasOne(Parent, {
  foreignKey: "accountId",
  as: "parentProfile",
  onDelete: "CASCADE",
});
Parent.belongsTo(Account, { foreignKey: "accountId", as: "accounts" });

// Class ------------------------------------------------------------------->
class ClassSubject extends Model {}

ClassSubject.init(
  {
    tenantId: {
      type: DataTypes.INTEGER,
      references: {
        model: Tenant,
        key: "id",
      },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: "classes_subjects",
  }
);
Class.belongsToMany(Subject, {
  through: ClassSubject,
  foreignKey: "classId",
  otherKey: "subjectId",
});
Subject.belongsToMany(Class, {
  through: ClassSubject,
  foreignKey: "subjectId",
  otherKey: "classId",
});

Class.hasMany(Student, {
  foreignKey: "classId",
  as: "students",
  onDelete: "CASCADE",
});
Student.belongsTo(Class, { foreignKey: "classId", as: "classDetails" });

class ClassTeacher extends Model {}

ClassTeacher.init(
  {
    teacherRole: {
      type: DataTypes.ENUM("class", "subject"),
      defaultValue: "subject",
    },
  },
  {
    sequelize,
    timestamps: true,
    underscored: true,
    tableName: "classes_teachers",
  }
);

ClassTeacher.belongsTo(Class, { foreignKey: "classId" });
ClassTeacher.belongsTo(Teacher, { foreignKey: "teacherId" });
ClassTeacher.belongsTo(Subject, { foreignKey: "subjectId" });

Class.hasMany(ClassTeacher, { foreignKey: "classId" });
Teacher.hasMany(ClassTeacher, { foreignKey: "teacherId" });
Subject.hasMany(ClassTeacher, { foreignKey: "subjectId" });

// class ClassExam extends Model {}

// ClassExam.init(
//   {
//     tenantId: {
//       type: DataTypes.INTEGER,
//       references: {
//         model: Tenant,
//         key: "id",
//       },
//     },
//   },
//   {
//     sequelize,
//     paranoid: true,
//     timestamps: true,
//     underscored: true,
//     tableName: "classes_exams",
//   }
// );

// Class.belongsToMany(Exam, {
//   through: ClassExam,
//   foreignKey: "teacherId",
//   otherKey: "classId",
// });
// Exam.belongsToMany(Class, {
//   through: ClassExam,
//   foreignKey: "classId",
//   otherKey: "teacherId",
// });
class ExamSubject extends Model {
  async updateFormData(validatedData) {
    Object.assign(this, validatedData);
    await this.save();
  }
}

ExamSubject.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tenantId: {
      type: DataTypes.INTEGER,
      references: {
        model: Tenant,
        key: "id",
      },
      field: "tenant_id",
      allowNull: false,
    },
    examDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
    },
    endTime: {
      type: DataTypes.TIME,
    },
    maxScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ExamSubject",
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

// <====================================  Exam Workflow ============================================>

// Exams will be created by either Admin or Teacher, A Class can have many exam records,
Account.hasMany(Exam, { foreignKey: "createdBy" }); // who is created.
Exam.belongsTo(Account, { foreignKey: "createdBy" }); // who is created

Class.hasMany(Exam, {
  // in which class this exam will assigned
  foreignKey: "classId",
});
Exam.belongsTo(Class, { foreignKey: "classId" });

Exam.hasMany(ExamSubject, { foreignKey: "examId", as: "examSubjects" });
ExamSubject.belongsTo(Exam, { foreignKey: "examId", as: "exam" });

Subject.hasMany(ExamSubject, { foreignKey: "subjectId" });
ExamSubject.belongsTo(Subject, { foreignKey: "subjectId" });

class StudentExamScore extends Model {}

StudentExamScore.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tenantId: {
      type: DataTypes.INTEGER,
      references: {
        model: Tenant,
        key: "id",
      },
    },
    marksObtained: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    grade: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "StudentExamScore",
    tableName: "student_exam_scores",
    underscored: true,
    timestamps: true,
  }
);

Student.hasMany(StudentExamScore, {
  foreignKey: "studentId",
  as: "StudentExamScores",
});
StudentExamScore.belongsTo(Student, { foreignKey: "studentId", as: "student" });

ExamSubject.hasMany(StudentExamScore, {
  foreignKey: "examSubjectId",
  as: "examScores",
});
StudentExamScore.belongsTo(ExamSubject, {
  foreignKey: "examSubjectId",
  as: "examSubjects",
});

// <====================================  Exam Workflow ============================================>

// Assignment
Class.hasMany(Assignment, { foreignKey: "classId" });
Assignment.belongsTo(Class, { foreignKey: "classId" });

Subject.hasMany(Assignment, { foreignKey: "subjectId" });
Assignment.belongsTo(Subject, { foreignKey: "subjectId" });

Account.hasMany(Assignment, { foreignKey: "assignedBy" });
Assignment.belongsTo(Account, { foreignKey: "assignedBy" });

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
  ClassTeacher,
  StudentExamScore,
  ExamSubject,
  Exam,
  ClassSubject,
  Document,
};
