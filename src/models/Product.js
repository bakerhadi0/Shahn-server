import { Schema, model } from "mongoose"

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, trim: true },
    price: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    notes: { type: String, trim: true },
    user: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
)

export default model("Product", ProductSchema)