const { DataTypes } = require("sequelize");
const { db } = require("../../configs/db.config");
const { Tenant } = require("../core");

const Parent = db.define(
  "Parent",
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
    profilePicture: {
      type: DataTypes.STRING,
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bloodGroup: {
      type: DataTypes.STRING,
    },
    sex: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: true,
      validate: {
        isIn: {
          args: [["male", "female", "other", null]],
          msg: "Must be either male, female, or other",
        },
      },
    },
  },
  {
    tableName: "parents",
    paranoid: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

module.exports = {
  Parent,
};
