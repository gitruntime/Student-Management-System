const { DataTypes } = require("sequelize");
const { db } = require("../../configs/db.config");
const { Tenant } = require("../core");

const Student = db.define(
  "Student",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    tenantId: {
      type: DataTypes.INTEGER,
      references: {
        model: Tenant,
        key: "id",
      },
      field: "tenant_id",
    },
  },
  {
    tableName: "students",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  },
);

module.exports = {
  Student,
};
