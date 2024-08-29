const { DataTypes, Model } = require("sequelize");
const { db: sequelize } = require("../../configs/db.config");
const { Teacher } = require("../teachers/teacher.model");
const { Admin } = require("../admin/admin.model");
const { Parent } = require("../parents/parent.model");
const { Student } = require("../students/student.model");
// const { TenantAbstract } = require("../core/base.model");
const bcrypt = require("bcrypt");
const { Tenant } = require("../index");

class Account extends Model {}

Account.init(
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
    firstName: {
      type: DataTypes.STRING,
      field: "first_name",
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      field: "last_name",
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.firstName} ${this.lastName}`;
      },
    },
    username: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Email is already in use",
      },
      validate: {
        isEmail: {
          msg: "Enter a valid email address",
        },
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      field: "phone_number",
    },
    userRole: {
      type: DataTypes.ENUM,
      values: ["student", "teacher", "admin", "parent", "normal"],
      defaultValue: "normal",
      allowNull: false,
      field: "user_role",
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        min: {
          args: [8],
          msg: "Password length must be greater than or equal to 8",
        },
        max: {
          args: [12],
          msg: "Password length must be less than or equal to 12",
        },
        hasUpperCase: (value) => {
          if (!/[A-Z]/.test(value)) {
            throw new Error(
              "Password must contain at least one uppercase letter",
            );
          }
        },
        hasLowerCase: (value) => {
          if (!/[a-z]/.test(value)) {
            throw new Error(
              "Password must contain at least one lowercase letter",
            );
          }
        },
        hasDigit: (value) => {
          if (!/\d/.test(value)) {
            throw new Error("Password must contain at least one digit");
          }
        },
        hasSpecialCharacter: (value) => {
          if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            throw new Error(
              "Password must contain at least one special character",
            );
          }
        },
      },
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      field: "date_of_birth",
      validate: {
        isDate: {
          msg: "Enter a valid Date",
        },
        isPast: (value) => {
          if (new Date(value) >= new Date()) {
            throw new Error("Date of Birth must be in past");
          }
        },
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_active",
    },
    // This field refers to the owner of this platform
    isSuperuser: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_superuser",
    },
    // This field refers to the school or college admin
    isAdmin: {
      type: DataTypes.VIRTUAL,
      get() {
        return !!this.userRole === "admin";
      },
    },
  },
  {
    sequelize,
    tableName: "accounts",
    modelName: "Account",
    underscored: true,
    /**
     * Handling Lifeycle Events
     * https://sequelize.org/docs/v6/other-topics/hooks/
     */
    hooks: {
      beforeCreate: async (user, options) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      afterCreate: async (user, options) => {
        switch (user.user_role) {
          case "teacher":
            await Teacher.create({
              id: user.id,
            });
            break;
          case "admin":
            await Admin.create({
              id: user.id,
            });
            break;
          case "parent":
            await Parent.create({
              id: user.id,
            });
            break;
          case "student":
            await Student.create({
              id: user.id,
            });
            break;
          default:
            break;
        }
      },
    },
  },
);

module.exports = {
  Account,
};
