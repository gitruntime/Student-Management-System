const { DataTypes } = require("sequelize");
const { db } = require("../../configs/db.config");
const { Tenant } = require("../core");

const Employment = db.define(
  "Employment",
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
    basicSalary: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    employmentType: {
      type: DataTypes.ENUM,
      values: ["part", "full", "freelance"],
      defaultValue: "full",
    },
  },
  {
    tableName: "employments",
    paranoid: true,
    underscored: true,
  }
);

module.exports = {
  Employment,
};
