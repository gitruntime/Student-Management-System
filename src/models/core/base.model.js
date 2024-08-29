const { DataTypes, Model } = require("sequelize");
const { db: sequelize } = require("../../configs/db.config");
const { Tenant } = require("./tenant.model");
const { Table } = require("@sequelize/core/decorators-legacy");

/**
 * Base Model that has foreignkey relation to every table
 * This is an abstraction class not a table
 *
 * Currently we are not using this feature
 * In future try to make reusable for every model
 * Refer :- https://sequelize.org/docs/v7/models/inheritance/
 */
// TenantAbstract.init(
//   {
//     tenantUserId: {
//       type: DataTypes.INTEGER,
//       references: {
//         model: Tenant,
//         key: "id",
//       },
//       field: "tenant_user_id",
//     },
//     createdAt: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//       field: "created_at",
//     },
//     updatedAt: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//       field: "updated_at",
//     },
//     deletedAt: {
//       type: DataTypes.DATE,
//       field: "deleted_at",
//     },
//   },
//   {
//     sequelize,
//     modelName: 'TenantAbstract',
//     timestamps: true,
//     paranoid: true,
//   },
// );

// module.exports = {
//   TenantAbstract,
// };
