const { DataTypes, Model } = require("sequelize");
const { db: sequelize } = require("../../configs/db.config");
const { Tenant } = require("../core");
// const { TenantAbstract } = require("../core");

class Address extends Model {
  updateFormData(validatedData) {
    Object.assign(this, validatedData);
  }
}

Address.init(
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
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pincode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    streetAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    addressType: {
      type: DataTypes.ENUM,
      values: ["Residential", "Permenant"],
      defaultValue: "Permenant",
    },
  },
  {
    sequelize,
    tableName: "addresses",
    underscored: true,
    timestamps: true,
    paranoid: true,
  }
);

module.exports = {
  Address,
};
