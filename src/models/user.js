import { Router } from "express"
import bcrypt from "bcryptjs"
import User from "../models/user.js"   // ← هذي المهمة

const router = Router()

router.get("/", async (_req, res) => {
  const rows = await User.find().sort({ createdAt: -1 }).select("-passwordHash")
  res.json(rows)
})

router.post("/", async (req, res) => {
  const { email, name = "", password = "123456", role = "user" } = req.body
  const exists = await User.findOne({ email })
  if (exists) return res.status(409).json({ message: "Email exists" })
  const passwordHash = await bcrypt.hash(String(password), 10)
  const doc = await User.create({ email, name, role, passwordHash })
  res.status(201).json({ _id: doc._id, email: doc.email, name: doc.name, role: doc.role, createdAt: doc.createdAt })
})

router.put("/:id", async (req, res) => {
  const { name, role } = req.body
  const doc = await User.findByIdAndUpdate(req.params.id, { name, role }, { new: true }).select("-passwordHash")
  res.json(doc)
})

router.patch("/:id/password", async (req, res) => {
  const { password } = req.body
  const passwordHash = await bcrypt.hash(String(password), 10)
  await User.findByIdAndUpdate(req.params.id, { passwordHash })
  res.json({ ok: true })
})

router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

export default router