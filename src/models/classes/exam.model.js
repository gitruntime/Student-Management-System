const { DataTypes, Model } = require("sequelize");
const { db: sequelize } = require("../../configs/db.config");
const { Tenant } = require("../core");

class Exam extends Model {
  async updateFormData(validatedData) {
    Object.assign(this, validatedData);
    await this.save();
  }
}

Exam.init(
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
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Exam",
    tableName: "exams",
    underscored: true,
    paranoid: true,
    timestamps: true,
  }
);

module.exports = {
  Exam,
};
