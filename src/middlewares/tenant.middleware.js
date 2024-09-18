const { Tenant } = require("../models");

const tenantMiddleware = async (req, res, next) => {
  const host = req.headers.host;
  const subdomain = host.split(".")[0];
  console.log(subdomain);
  const tenant = await Tenant.findOne({
    where: { subdomainPrefix: subdomain },
  });
  if (!tenant)
    return res.status(401).json({
      message: "You dont have this Platform access kindly Contact to the admin",
    });
  req.tenant = tenant;
  console.log(req.user);
  next();
};

module.exports = {
  tenantMiddleware,
};
