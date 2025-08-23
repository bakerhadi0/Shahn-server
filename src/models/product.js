import mongoose from "mongoose";

const schema = new mongoose.Schema(
  { name: { type: String, required: true }, sku: String, price: { type: Number, default: 0 }, stock: { type: Number, default: 0 }, notes: String },
  { timestamps: true }
);

export default mongoose.model("Product", schema);