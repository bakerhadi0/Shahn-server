import { Router } from "express";
import Sale from "../models/Sale.js";

const router = Router();

router.get("/sales", async (req, res) => {
  const { from, to } = req.query;
  const match = {};

  if (from) {
    const d = new Date(from);
    d.setHours(0, 0, 0, 0);
    match.createdAt = { $gte: d };
  }
  if (to) {
    const d2 = new Date(to);
    d2.setHours(23, 59, 59, 999);
    match.createdAt = { ...(match.createdAt || {}), $lte: d2 };
  }

  const rows = await Sale.aggregate([
    ...(Object.keys(match).length ? [{ $match: match }] : []),
    {
      $group: {
        _id: null,
        totalQty: { $sum: "$qty" },
        totalAmount: { $sum: { $multiply: ["$qty", "$price"] } }
      }
    }
  ]);

  res.json(rows[0] || { totalQty: 0, totalAmount: 0 });
});

export default router;