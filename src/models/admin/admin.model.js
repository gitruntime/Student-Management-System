const { db: sequelize } = require("../../configs/db.config");
const { DataTypes, Model } = require("sequelize");
// const { TenantAbstract } = require("../core/base.model");

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
  },
);

module.exports = {
  Admin,
};
