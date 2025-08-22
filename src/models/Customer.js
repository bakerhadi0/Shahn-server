import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  company: String,
  phone: String,
  location: String,
  notes: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
export default mongoose.model('Customer', schema);
