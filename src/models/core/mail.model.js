// const { DataTypes, Model } = require("sequelize");
// const { db: sequelize } = require("../../configs/db.config");

// class TrackMail extends Model {}

// TrackMail.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     tenantId: {
//       type: DataTypes.INTEGER,
//       references: {
//         model: "tenants",
//         key: "id",
//       },
//       field: "tenant_id",
//     },
//     recipients: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     subject: {
//       type: DataTypes.STRING,
//     },
//     isOpened: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false
//     }
//   },
//   {
//     sequelize,
//     modelName: "TrackMail",
//     tableName: "trackmails",
//     underscored: true,
//     timestamps: true,
//     paranoid: true
//   }
// );

// module.exports = {
//     TrackMail,
// };
