const { DataTypes, Model } = require("sequelize");
const { db: sequelize } = require("../../configs/db.config");
const { Tenant } = require("../core");

class Exam extends Model {}

Exam.init(
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
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    examType: {
      type: DataTypes.ENUM,
      values: [
        "First Sem",
        "Second Sem",
        "Third Sem",
        "Fourth Sem",
        "Fifth Sem",
        "Sixth Sem",
        "Unit Test",
      ],
    },
  },
  {
    sequelize,
    modelName: "Exam",
    tableName: "exams",
    underscored: true,
    paranoid: true,
    timestamps: true,
  },
);

module.exports = {
  Exam,
};
