const { DataTypes, Model } = require("sequelize");
const { db: sequelize } = require("../../configs/db.config");
// const { TenantAbstract } = require("../core/base.model");

class Subject extends Model {}

Subject.init(
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
  },
  {
    sequelize,
    tableName: "subjects",
    modelName: "Subject",
  },
);

module.exports = {
  Subject,
};
