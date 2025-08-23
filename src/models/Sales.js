import mongoose from "mongoose"

const ItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    qty: { type: Number, default: 1 },
    price: { type: Number, default: 0 }
  },
  { _id: false }
)

const SaleSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    items: [ItemSchema],
    total: { type: Number, default: 0 },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
)

export default mongoose.model("Sales", SaleSchema)