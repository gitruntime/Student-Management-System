module.exports = {
  tenantController: require("./tenant.controller"),
  permissionController: require("./authorization.controller")
    .permissionController,
  groupController: require("./authorization.controller").groupController,
  tenantUserController: require("./tenantUser.controller"),
};
