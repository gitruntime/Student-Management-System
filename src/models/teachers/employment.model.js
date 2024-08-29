const { DataTypes } = require("sequelize");
const { db } = require("../../configs/db.config");

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
    basic_salary: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    employment_type: {
      type: DataTypes.ENUM,
      values: ["part", "full", "freelance"],
      defaultValue: "full",
    },
  },
  {
    tableName: "employments",
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  },
);

module.exports = {
  Employment,
};
