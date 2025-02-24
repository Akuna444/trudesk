// models/tenant.js
const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  // Tenant identifier (e.g., subdomain or tenant name)
  tenantId: {
    type: String,
    required: true,
    unique: true,
  },

  // Subdomain for the tenant (e.g., "company1" in "company1.example.com")
  subdomain: {
    type: String,
    required: true,
    unique: true,
  },

  // Database connection details for the tenant
  database: {
    name: {
      type: String,
      required: true,
    },
    uri: {
      type: String,
      required: true,
    },
  },

  // Tenant status (e.g., active, suspended)
  status: {
    type: String,
    enum: ['active', 'suspended', 'pending'],
    default: 'active',
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the `updatedAt` field before saving
tenantSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

tenantSchema.statics.getTenantBySubdomain = async function (subdomain) {
  return await this.findOne({ subdomain });
};

module.exports = mongoose.model('Tenant', tenantSchema);

