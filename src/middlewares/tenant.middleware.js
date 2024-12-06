const { Tenant } = require("../models");

const tenantMiddleware = async (req, res, next) => {
  const host = req.headers.host;
  const subdomain = host.split(".")[0];
  const tenant = await Tenant.findOne({
    where: { subdomainPrefix: subdomain },
  });
  console.log(tenant);
  
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
