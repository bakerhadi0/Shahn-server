import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "unauthorized" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: "unauthorized" });
  }
}

export function requireAdmin(req, res, next) {
  const done = () => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "forbidden" });
    }
    next();
  };
  if (!req.user) return requireAuth(req, res, done);
  done();
}