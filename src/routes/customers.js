import { Router } from "express";
import Customer from "../models/customers.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const items = await Customer.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (e) { next(e); }
});

router.post("/", async (req, res, next) => {
  try {
    const doc = await Customer.create(req.body);
    res.status(201).json(doc);
  } catch (e) { next(e); }
});

router.put("/:id", async (req, res, next) => {
  try {
    const doc = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(doc);
  } catch (e) { next(e); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
