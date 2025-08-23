import "dotenv/config"
import express from "express"
import cors from "cors"
import morgan from "morgan"
import mongoose from "mongoose"

import authRoutes from "./routes/auth.js"
import productRoutes from "./routes/products.js"
import sales from "./routes/sales.js"
import usersRoutes from "./routes/users.js"

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/shahn_sales"
const PORT = process.env.PORT || 4000

mongoose.connect(MONGODB_URI).then(()=>{
  console.log("✅ MongoDB connected")
}).catch(err=>{
  console.error("MongoDB error", err)
  process.exit(1)
})

app.get("/", (_req,res)=>res.json({name:"Shahn Sales API", status:"ok"}))
app.use("/api/auth", authRoutes)

const requireRole = (...roles)=> (req,res,next)=>{
  if(!req.user || !roles.includes(req.user.role)) return res.status(403).json({ message:"Forbidden" })
  next()
}

app.get("/api/auth/me", sales.guard, (req,res)=>{
  const u = req.user || {}
  res.json({ id: u.id || u._id, email: u.email, name: u.name, role: u.role })
})

app.use("/api/products", sales.guard, productRoutes)
app.use("/api/sales", sales.guard, sales.router)
app.use("/api/users", sales.guard, requireRole("admin"), usersRoutes)

app.use((err, _req, res, _next)=>{
  console.error("Error:", err)
  res.status(err.status || 500).json({ message: err.message || "Server error" })
})

app.listen(PORT, ()=> console.log(`🚀 API on http://localhost:${PORT}`))