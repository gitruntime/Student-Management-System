const { DataTypes, Model } = require("sequelize");
const { db: sequelize } = require("../../configs/db.config");
const { Tenant } = require("../core");

class Education extends Model {
  updateFormData(validatedData) {
    Object.assign(this, validatedData);
  }
}

Education.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tenantId: {
      type: DataTypes.INTEGER,
      references: {
        model: Tenant,
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fieldOfStudy: {
      type: DataTypes.STRING,
    },
    startDate: {
      type: DataTypes.DATE,
    },
    endDate: {
      type: DataTypes.DATE,
    },
    isPresent: {
      type: DataTypes.VIRTUAL,
      get() {
        return !this.endDate;
      },
    },
    description: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "educations",
    timestamps: true,
    paranoid: true,
    modelName: "Account",
  }
);

module.exports = {
  Education,
};
