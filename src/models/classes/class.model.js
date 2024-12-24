const { DataTypes, Model } = require("sequelize");
const { db: sequelize } = require("../../configs/db.config");
const { Tenant } = require("../core");
const { Teacher } = require("../teachers");
// const { TenantAbstract } = require("../core/base.model");

class Class extends Model {
  updateFormData(validatedData) {
    Object.assign(this, validatedData);
  }
}

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
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    section: {
      type: DataTypes.STRING,
      allowNull: true,
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

class Assignment extends Model {
  async updateFormData(validatedData) {
    Object.assign(this, validatedData);
    await this.save();
  }
}

Assignment.init(
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
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    documents: {
      type: DataTypes.JSON,
      validate: {
        isArrayOfUrls(value) {
          if (!Array.isArray(value)) {
            throw new Error("The value must be an array of URLs.");
          }
          value.forEach((url) => {
            const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
            if (!urlRegex.test(url)) {
              throw new Error(`Invalid URL: ${url}`);
            }
          });
        },
      },
    },
    priority: {
      type: DataTypes.ENUM("high", "medium", "low"),
      defaultValue: "high",
    },
  },
  {
    sequelize,
    modelName: "Assignment",
    underscored: true,
    paranoid: true,
    timestamps: true,
    tableName: "assignments",
  }
);

module.exports = {
  Class,
  Assignment,
};
