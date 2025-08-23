import { Router } from "express";
import Sale from "../models/sales.js";

const router = Router();

router.get("/", async (_req, res) => {
  const rows = await Sale.find().sort({ createdAt: -1 });
  res.json(rows);
});

router.post("/", async (req, res) => {
  const doc = await Sale.create(req.body);
  res.status(201).json(doc);
});

router.put("/:id", async (req, res) => {
  const doc = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(doc);
});

router.delete("/:id", async (req, res) => {
  await Sale.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;