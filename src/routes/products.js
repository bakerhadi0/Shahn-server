import express from "express"
import Product from "../models/product.js"

const router = express.Router()

router.get("/", async (req, res) => {
  const items = await Product.find().sort({ createdAt: -1 }).lean()
  res.json(items)
})

router.post("/", async (req, res) => {
  const p = await Product.create(req.body)
  res.status(201).json(p)
})

router.put("/:id", async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(p)
})

router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

export default router