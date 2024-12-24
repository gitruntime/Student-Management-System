const { DataTypes, Model } = require("sequelize");
const { db: sequelize } = require("../../configs/db.config");
const { Tenant } = require("../core");

class Attendance extends Model {
  async updateFormData(validatedData) {
    Object.assign(this, validatedData);
    await this.save()
  }
}

Attendance.init(
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
    attendanceDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["present", "absent", "excused", "late"],
      allowNull: false,
    },
    checkIn: {
      type: DataTypes.TIME,
    },
    checkOut: {
      type: DataTypes.TIME,
    },
  },
  {
    sequelize,
    modelName: "Attendance",
    tableName: "attendances",
    underscored: true,
    timestamps: true,
    paranoid: true,
  }
);

module.exports = {
  Attendance,
};
