import { Router } from "express"
import Sale from "../models/sale.js"

const router = Router()

router.get("/sales", async (req, res) => {
  const { from, to } = req.query
  const match = {}
  if (from) match.createdAt = { ...(match.createdAt || {}), $gte: new Date(from) }
  if (to)   match.createdAt = { ...(match.createdAt || {}), $lte: new Date(to) }

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