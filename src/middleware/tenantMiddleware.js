const Tenant = require("../models/tenant");

// middleware/tenantMiddleware.js
module.exports = async function (req, res, next) {
  const host = req.headers.host;
  const subdomain = host.split('.')[0]; // Extract subdomain
  if (!subdomain) {
    return res.status(400).json({ error: "Subdomain missing" });
}

// 🔹 Use static method from schema
const tenant = await Tenant.getTenantBySubdomain(subdomain);

if (!tenant) {
    return res.status(404).json({ error: "Tenant not found" });
}

  req.tenant = subdomain; // Attach tenant to the request object
  next();
};