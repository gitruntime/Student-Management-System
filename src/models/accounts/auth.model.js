const { DataTypes } = require("sequelize");
const { db } = require("../../configs/db.config");
const { Teacher } = require("../../models/teachers/teacher.model");
const bcrypt = require("bcrypt");
const { Admin } = require("../admin/admin.model");
const { Parent } = require("../parents/parent.model");
const { Student } = require("../students/student.model");

const Account = db.define(
  "Account",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    full_name: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.first_name} ${this.last_name}`;
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        msg: "Email is already in use",
      },
      validate: {
        isEmail: {
          msg: "Enter a valid email address",
        },
      },
    },
    phone_number: {
      type: DataTypes.STRING,
    },
    user_role: {
      type: DataTypes.ENUM,
      values: ["student", "teacher", "admin", "parent", "normal"],
      defaultValue: "normal",
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
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
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
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_superuser: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_staff: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "accounts",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
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

const Permission = db.define(
  "Permission",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    codename: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "permissions",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  },
);

module.exports = {
  Account,
  Permission,
};
