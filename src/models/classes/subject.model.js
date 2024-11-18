const { DataTypes, Model } = require("sequelize");
const { db: sequelize } = require("../../configs/db.config");
const { Tenant } = require("../core");
const { Exam } = require("./exam.model");
const { Class } = require("./class.model");
// const { TenantAbstract } = require("../core/base.model");

class Subject extends Model {
  updateFormData(validatedData) {
    Object.assign(this, validatedData);
  }
}

Subject.init(
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
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "subjects",
    modelName: "Subject",
    paranoid: true,
    timestamps: true,
  }
);

class ExamSubject extends Model {
  updateFormData(validatedData) {
    Object.assign(this, validatedData);
  }
}

// Exam has multiple subjects and their dates and times - the class 
// 

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
    },
    examId: {
      type: DataTypes.INTEGER,
      references: {
        model: Exam,
        key: "id",
      },
    },
    classId: {
      type: DataTypes.INTEGER,
      references: {
        model: Class,
        key: "id",
      },
    },
    subjectId: {
      type: DataTypes.INTEGER,
      references: {
        model: Subject,
        key: "id",
      },
    },
    maxMarks: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    paranoid: true,
    tableName: "exam_subjects",
    modelName: "ExamSubject",
  }
);

class ExamSubjectScore extends Model {}
// sTUDENT => exam subject score
ExamSubjectScore.init({
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
  },
  marksObtained: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  grade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = {
  Subject,
  ExamSubject,
};
