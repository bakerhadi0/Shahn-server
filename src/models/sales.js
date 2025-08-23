import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema(
  {
    item: { type: String, required: true },
    qty: { type: Number, default: 1 },
    price: { type: Number, default: 0 },
    customer: { type: String, default: "" },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Sale", SaleSchema);