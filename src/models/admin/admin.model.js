const { db: sequelize } = require("../../configs/db.config");
const { DataTypes, Model } = require("sequelize");
const { Tenant } = require("../core");

class Admin extends Model {}

Admin.init(
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
    sequelize,
    tableName: "admin",
    modelName: "Admin",
    timestamps: true,
    paranoid: true,
    underscored: true,
  },
);

module.exports = {
  Admin,
};
