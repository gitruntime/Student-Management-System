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

class Goal extends Model {
  async updateFormData(validatedData) {
    Object.assign(this, validatedData);
    await this.save();
  }
}
Goal.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    tenantId: {
      type: DataTypes.INTEGER,
      references: {
        model: Tenant,
        key: "id",
      },
      field: "tenant_id",
    },
    type: {
      type: DataTypes.ENUM("long term", "short term"),
      defaultValue: "short term",
    },
  },
  {
    sequelize,
    timestamps: true,
    paranoid: true,
    tableName: "goals",
    underscored: true,
    modelName: "Goal",
  }
);

class Volunteer extends Model {
  async updateFormData(validatedData) {
    Object.assign(this, validatedData);
    await this.save();
  }
}

Volunteer.init(
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
    organisationName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    impact: {
      type: DataTypes.STRING,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    timestamps: true,
    paranoid: true,
    tableName: "volunteers",
    modelName: "Volunteer",
    underscored: true,
  }
);
module.exports = {
  EventParticipation,
  Award,
  StudentExam,
  Volunteer,
  Goal,
};
