import { Router } from "express"
import Sale from "../models/sale.js"
import Product from "../models/product.js"

const r = Router()

r.get("/", async (req, res) => {
  const items = await Sale.find().populate("product").sort({ createdAt: -1 })
  res.json(items)
})

r.post("/", async (req, res) => {
  const { productId, qty = 1, price } = req.body
  const p = await Product.findById(productId)
  if (!p) return res.status(400).json({ error: "product not found" })
  const s = await Sale.create({ product: p._id, qty, price: price ?? p.price })
  res.status(201).json(s)
})

r.put("/:id", async (req, res) => {
  const { productId, qty, price } = req.body
  const patch = {}
  if (productId) patch.product = productId
  if (qty != null) patch.qty = qty
  if (price != null) patch.price = price
  const s = await Sale.findByIdAndUpdate(req.params.id, patch, { new: true })
  res.json(s)
})

r.delete("/:id", async (req, res) => {
  await Sale.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

export default r