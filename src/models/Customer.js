const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    notes: { type: String, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

CustomerSchema.index({ name: 'text', company: 'text', phone: 'text', location: 'text' });

module.exports = mongoose.model('Customer', CustomerSchema);
