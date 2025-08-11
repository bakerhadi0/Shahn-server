import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  product:  { type: String,  required: true },
  quantity: { type: Number,  required: true },
  total:    { type: Number,  required: true }
}, { timestamps: true });

export default mongoose.models.Sale || mongoose.model('Sale', saleSchema);
