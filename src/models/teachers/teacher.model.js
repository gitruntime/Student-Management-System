const { DataTypes, Model } = require("sequelize");
const { db: sequelize } = require("../../configs/db.config");
const { Tenant } = require("../core");
// const { TenantAbstract } = require("../core/base.model");

class Teacher extends Model {
  updateFormData(validatedData) {
    Object.assign(this, validatedData);
  }
}

Teacher.init(
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
    bio: {
      type: DataTypes.STRING,
    },
    bloodGroup: {
      type: DataTypes.STRING,
    },
    profilePicture: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: "Profile picture must be a valid URL",
        },
      },
    },
    sex: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      validate: {
        isIn: {
          args: [["male", "female", "other", null]],
          msg: "Must be either male, female, or other",
        },
      },
    },
  },
  {
    sequelize,
    tableName: "teachers",
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

module.exports = {
  Teacher,
};
