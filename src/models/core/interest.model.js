const { DataTypes, Model } = require("sequelize");
const { db: sequelize } = require("../../configs/db.config");

class Interest extends Model {
  updateFormData(validatedData) {
    Object.assign(this, validatedData);
  }
}

Interest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tenantId: {
      type: DataTypes.INTEGER,
      references: {
        model: "tenants",
        key: "id",
      },
      field: "tenant_id",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Interest",
    tableName: "interests",
    underscored: true,
  }
);

module.exports = {
  Interest,
};
