const { Schema, model } = require('mongoose');
const customerSchema = new Schema({
  name: { type: String, required: true, trim: true },
  company: { type: String, trim: true },
  phone: { type: String, trim: true },
  location: { type: String, trim: true },
  notes: { type: String, trim: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
module.exports = model('Customer', customerSchema);
