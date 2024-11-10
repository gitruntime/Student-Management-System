const { DataTypes, Model } = require("sequelize");
const { db: sequelize } = require("../../configs/db.config");
const { Tenant } = require("../core");
const { Student } = require("./student.model");

class EventParticipation extends Model {
  updateFormData(validatedData) {
    Object.assign(this, validatedData);
  }
}

EventParticipation.init(
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
    isAwarded: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    participationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    position: {
      type: DataTypes.ENUM,
      values: ["1st", "2nd", "3rd"],
    },
  },
  {
    sequelize,
    modelName: "EventParticipation",
    tableName: "event_participations",
    underscored: true,
    timestamps: true,
    paranoid: true,
  }
);

class Award extends Model {
  updateFormData(validatedData) {
    Object.assign(this, validatedData);
  }
}

Award.init(
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
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Award",
    tableName: "awards",
    underscored: true,
    timestamps: true,
    paranoid: true,
  }
);

class StudentExam extends Model {}

StudentExam.init(
  {
    isEnrolled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "students_exams",
    sequelize,
  }
);

module.exports = {
  EventParticipation,
  Award,
  StudentExam,
};
