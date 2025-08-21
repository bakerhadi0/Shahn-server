const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, default: "" },
  phone: { type: String, default: "" },
  location: { type: String, default: "" },
  notes: { type: String, default: "" }
},{ timestamps: true });
module.exports = mongoose.model('Customer', customerSchema);
