const { permissionSchema } = require("./authorization.validator");
const { tenantSchema } = require("./tenant.validator");

module.exports = {
  permissionSchema,
  tenantSchema,
};
