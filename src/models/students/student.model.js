const { DataTypes, Model } = require("sequelize");
const { db: sequelize } = require("../../configs/db.config");
const { Tenant } = require("../core");

class Student extends Model {
  updateFormData(validatedData) {
    Object.assign(this, validatedData);
  }
}

Student.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement:true
    },
    tenantId: {
      type: DataTypes.INTEGER,
      references: {
        model: Tenant,
        key: "id",
      },
      field: "tenant_id",
    },
    profilePicture: {
      type: DataTypes.STRING,
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bloodGroup: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "students",
    modelName: "Student",
    timestamps: true,
    paranoid: true,
    underscored: true,
  },
);

module.exports = {
  Student,
};
