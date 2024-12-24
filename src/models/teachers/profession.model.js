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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Senior Developer",
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "X Company",
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    isPresent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "experiences",
    paranoid: true,
    timestamps: true,
    underscored: true,
    validate: {
      endDateRequiredIfNotPresent() {
        if (!this.isPresent && !this.endDate) {
          throw new Error("endDate is required when isPresent is false.");
        }
        if (this.isPresent && this.endDate) {
          throw new Error("endDate must be null when isPresent is true.");
        }
      },
    },
  }
);

module.exports = {
  Certificate,
  Experience,
};
