import mongoose from "mongoose"

const saleSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  qty: { type: Number, default: 1 },
  price: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
}, { timestamps: true })

saleSchema.pre("save", function (next) { this.total = (this.qty||0) * (this.price||0); next() })

export default mongoose.model("Sale", saleSchema)