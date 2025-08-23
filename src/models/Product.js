import mongoose from 'mongoose'
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: String,
  price: Number,
  stock: Number,
  notes: String
},{timestamps:true})
export default mongoose.model('Product', ProductSchema)
