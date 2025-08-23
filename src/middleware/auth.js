import jwt from "jsonwebtoken"

export function authRequired(req, res, next) {
  const h = req.headers.authorization || ""
  const token = h.startsWith("Bearer ") ? h.slice(7) : ""
  if (!token) return res.status(401).json({ error: "unauthorized" })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret")
    req.user = payload
    next()
  } catch {
    res.status(401).json({ error: "unauthorized" })
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "unauthorized" })
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: "forbidden" })
    next()
  }
}