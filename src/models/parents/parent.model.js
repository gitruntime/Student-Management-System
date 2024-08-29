const { DataTypes } = require("sequelize");
const { db } = require("../../configs/db.config");

const Parent = db.define(
  "Parent",
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
    tableName: "parents",
    paranoid: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  },
);

module.exports = {
  Parent,
};
