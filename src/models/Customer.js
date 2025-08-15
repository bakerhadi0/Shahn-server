import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  company:  { type: String },
  phone:    { type: String },
  location: { type: String },   // مدينة/لوكيشن مختصر
  notes:    { type: String }
}, { timestamps: true });

export default mongoose.model('Customer', customerSchema);
