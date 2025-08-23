import { Router } from "express"
import Sale from "../models/sale.js"

const r = Router()

r.get("/", async (req, res) => {
  const rows = await Sale.find().sort({ createdAt: -1 })
  res.json(rows)
})

r.post("/", async (req, res) => {
  const s = await Sale.create(req.body)
  res.status(201).json(s)
})

r.put("/:id", async (req, res) => {
  const s = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(s)
})

r.delete("/:id", async (req, res) => {
  await Sale.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

export default r