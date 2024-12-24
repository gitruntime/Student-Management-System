const { DataTypes, Model } = require("sequelize");
// const { TenantAbstract } = require("../core/base.model");
const { db: sequelize } = require("../../configs/db.config");
const { Tenant } = require("../core");

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
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    codename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "permissions",
    modelName: "Permission",
    timestamps: true,
    paranoid: true,
    underscored: true,
  },
);

// Need to Create Group Model Also

module.exports = {
  Permission,
};
