const { DataTypes, Model } = require("sequelize");
const { db: sequelize } = require("../../configs/db.config");
const { Tenant } = require("../core");
// const { TenantAbstract } = require("../core/base.model");

class Certificate extends Model {
  updateFormData(validatedData) {
    Object.assign(this, validatedData);
  }
}

Certificate.init(
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
  },
  {
    sequelize,
    tableName: "certificates",
    paranoid: true,
    underscored: true,
    timestamps: true,
  }
);

class Experience extends Model {
  updateFormData(validatedData) {
    Object.assign(this, validatedData);
  }
}

Experience.init(
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
    company: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:"Company 1"
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateJoined: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "experiences",
    paranoid: true,
    timestamps: true,
    underscored: true,
  }
);

module.exports = {
  Certificate,
  Experience,
};
