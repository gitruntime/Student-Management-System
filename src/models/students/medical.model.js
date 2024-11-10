const { DataTypes, Model } = require("sequelize");
const { db: sequelize } = require("../../configs/db.config");
const { Tenant } = require("../core");

class MedicalRecord extends Model {
  updateFormData(validatedData) {
    Object.assign(this, validatedData);
  }
}

MedicalRecord.init(
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
    history: {
      type: DataTypes.STRING,
    },
    allergies: {
      type: DataTypes.STRING,
    },
    ongoingTreatment: {
      type: DataTypes.STRING,
    },
    lastMedicalCheckup: {
      type: DataTypes.DATEONLY,
    },
    eyeVision: {
      type: DataTypes.STRING,
    },
    height: {
      type: DataTypes.DECIMAL,
    },
    heightUnit: {
      type: DataTypes.ENUM,
      values: ["cm", "in"],
      defaultValue: "cm",
    },
    weight: {
      type: DataTypes.STRING,
    },
    weightUnit: {
      type: DataTypes.ENUM,
      values: ["kg", "pounds"],
      defaultValue: "kg",
    },
    bmi: {
      type: DataTypes.VIRTUAL,
      get() {
        const weight = this.getDataValue("weight");
        const height = this.getDataValue("height");
        if (weight && height) {
          return weight / (height * height);
        }
        return null;
      },
    },
  },
  {
    sequelize,
    modelName: "MedicalRecord",
    tableName: "medical_records",
    underscored: true,
    timestamps: true,
    paranoid: true,
  },
);

module.exports = {
  MedicalRecord,
};
