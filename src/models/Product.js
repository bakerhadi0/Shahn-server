// src/models/Product.js
import mongoose from 'mongoose';

/**
 * Product
 * - price: سعر الوحدة الواحدة (ريال) ويمكن أن يكون بالهللة (0.20)
 * - unit: نوع الوحدة مثل 'piece' | 'cup' | 'roll' | 'bottle' ... (حر نصيًا)
 * - packSize: عدد الوحدات داخل الشد/العبوة (افتراضي 1)
 */
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 }, // سعر الوحدة
  unit:  { type: String, default: 'piece', trim: true }, // مثل: piece/cup/roll/bottle/carton
  packSize: { type: Number, default: 1, min: 1 },
  sku: { type: String, trim: true },
  stock: { type: Number, default: 0, min: 0 },
  description: { type: String, trim: true }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
