import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true },
    sku:   { type: String, default: "" },
    price: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    notes: { type: String, default: "" },
    user:  { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.model("Product", schema);
