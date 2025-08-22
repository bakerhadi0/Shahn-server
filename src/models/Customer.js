const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
