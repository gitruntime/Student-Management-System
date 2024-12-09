const { Tenant } = require("../models");

const tenantMiddleware = async (req, res, next) => {
  const subdomain = req.headers["x-tenant-domain"];
  if (!subdomain)
    return res.status(404).json({ message: "Subdomain not found" });

  const tenant = await Tenant.findOne({
    where: { subdomainPrefix: subdomain },
  });

  if (!tenant)
    return res.status(401).json({
      message: "You dont have this Platform access kindly Contact to the admin",
    });
  req.tenant = tenant;
  next();
};

module.exports = {
  tenantMiddleware,
};
