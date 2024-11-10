const { DataTypes, Model } = require("sequelize");
const { db: sequelize } = require("../../configs/db.config");
const { Tenant } = require("../core");
const { Teacher } = require("../teachers");
// const { TenantAbstract } = require("../core/base.model");

class Class extends Model {}

Class.init(
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
      allowNull:false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    classTeacher: {
      type: DataTypes.INTEGER,
      references: {
        model: Teacher,
        key: "id",
      },
      field: "teacher_id",
    },
  },
  {
    sequelize,
    modelName: "Class",
    tableName: "classes",
    underscored: true,
    timestamps: true,
    paranoid: true,
  }
);

module.exports = {
  Class,
};
