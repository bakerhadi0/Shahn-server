import { Router } from "express"
import Customer from "../models/customers.js"

const router = Router()

router.get("/", async (req, res) => {
  const items = await Customer.find().sort({ _id: -1 })
  res.json(items)
})

router.post("/", async (req, res) => {
  const doc = await Customer.create(req.body)
  res.status(201).json(doc)
})

router.put("/:id", async (req, res) => {
  const doc = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(doc)
})

router.delete("/:id", async (req, res) => {
  await Customer.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

export default router
