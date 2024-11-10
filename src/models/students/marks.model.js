const { DataTypes, Model } = require("sequelize");
const { db: sequelize } = require("../../configs/db.config");
const { Tenant } = require("../core");
const { Student } = require("./student.model");

class Mark extends Model {}

Mark.init(
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
    studentId: {
      type: DataTypes.INTEGER,
      references: {
        model: Student,
        key: "id",
      },
      field: "student_id",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Mark",
    tableName: "marks",
    underscored: true,
    timestamps: true,
    paranoid: true,
  },
);

module.exports = {
  Mark,
};
