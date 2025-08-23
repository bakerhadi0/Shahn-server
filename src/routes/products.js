import express from "express";
import Product from "../models/product.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try { res.json(await Product.find().sort({ createdAt: -1 })); } catch (e) { next(e); }
});

router.post("/", async (req, res, next) => {
  try { res.status(201).json(await Product.create(req.body)); } catch (e) { next(e); }
});

router.put("/:id", async (req, res, next) => {
  try { res.json(await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (e) { next(e); }
});

router.delete("/:id", async (req, res, next) => {
  try { await Product.findByIdAndDelete(req.params.id); res.json({ ok: true }); } catch (e) { next(e); }
});

export default router;