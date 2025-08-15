import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String },
  contact: { type: String },
  phone: { type: String },
  city: { type: String },
  address: { type: String }
}, { timestamps: true });

export default mongoose.model('Customer', customerSchema);
