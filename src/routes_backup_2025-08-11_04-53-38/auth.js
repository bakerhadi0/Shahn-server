import { Router } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/user.js"

const router = Router()

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {}
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ error: "invalid" })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ error: "invalid" })
  const token = jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" })
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
})

export default router