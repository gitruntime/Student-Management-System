module.exports = {
  authMiddleware: require("./authentication.middleware").authMiddleware,
  isAdmin: require("./authorization.middleware").isAdmin,
  validate: require("./validation.middleware").validate,
  tenantMiddleware: require("./tenant.middleware").tenantMiddleware,
  parseIntMiddleware: require("./parseInt.middleware").parseIntMiddleware,
};
