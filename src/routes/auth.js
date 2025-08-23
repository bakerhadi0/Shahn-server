import { Router } from "express";
import User from "../models/user.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAdmin, async (_req, res) => {
  const rows = await User.find().sort({ createdAt: -1 }).select("name email role createdAt");
  res.json(rows);
});

router.post("/", requireAdmin, async (req, res) => {
  const { email, password, name = "", role = "user" } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email/password required" });
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: "email exists" });
  const doc = await User.create({ email, password, name, role });
  res.status(201).json({ _id: doc._id });
});

router.put("/:id", requireAdmin, async (req, res) => {
  const { name, email, role } = req.body || {};
  const doc = await User.findByIdAndUpdate(req.params.id, { name, email, role }, { new: true });
  res.json(doc);
});

router.patch("/:id/password", requireAdmin, async (req, res) => {
  const { password } = req.body || {};
  if (!password) return res.status(400).json({ error: "password required" });
  const u = await User.findById(req.params.id);
  if (!u) return res.status(404).json({ error: "not found" });
  u.password = password;
  await u.save();
  res.json({ ok: true });
});

router.delete("/:id", requireAdmin, async (req, res) => {
  if (req.user && req.user.id === req.params.id) return res.status(400).json({ error: "cannot delete self" });
  await User.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;