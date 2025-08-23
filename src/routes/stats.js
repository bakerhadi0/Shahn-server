// src/routes/stats.js
import { Router } from "express"
import Sale from "../models/sale.js"

const router = Router()

router.get("/sales", async (req, res) => {
  const { from, to } = req.query
  const match = {}
  if (from || to) {
    match.createdAt = {}
    if (from) match.createdAt.$gte = new Date(from)
    if (to) {
      const end = new Date(to)
      end.setHours(23, 59, 59, 999)
      match.createdAt.$lte = end
    }
  }

  const rows = await Sale.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalQty: { $sum: "$qty" },
        totalAmount: { $sum: { $multiply: ["$qty", "$price"] } }
      }
    }
  ])

  res.json(rows[0] || { totalQty: 0, totalAmount: 0 })
})

export default router