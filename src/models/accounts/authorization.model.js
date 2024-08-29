const { DataTypes, Model } = require("sequelize");
// const { TenantAbstract } = require("../core/base.model");
const { db: sequelize } = require("../../configs/db.config");

class Permission extends Model {}

Permission.init(
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    operation: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ["GET", "POST", "PUT", "DELETE"],
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subModel: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "permissions",
    modelName: "Permission",
  },
);

// Need to Create Group Model Also

module.exports = {
  Permission,
};
