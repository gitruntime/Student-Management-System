const { DataTypes, Model } = require("sequelize");
const { db } = require("../../configs/db.config");

class Tenant extends Model {}

Tenant.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subdomainPrefix: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "subdomain_prefix",
      unique: true,
    },
  },
  {
    sequelize: db,
    modelName: "Tenant",
    tableName: "tenants",
    hooks: {
      afterCreate: async (user, options) => {
        // we can implement welcome mail in future with website link
      },
    },
  },
);

module.exports = {
  Tenant,
};
