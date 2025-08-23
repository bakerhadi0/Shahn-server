import express from "express"
import cors from "cors"
import morgan from "morgan"
import "dotenv/config"
import mongoose from "mongoose"

import authRoutes from "./routes/auth.js"
import customersRoutes from "./routes/customers.js"
import visitsRoutes from "./routes/visits.js"
import salesRoutes from "./routes/sales.js"
import statsRoutes from "./routes/stats.js"
app.use("/api/stats", statsRoutes)
const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

const MONGO = process.env.MONGODB_URI || process.env.MONGO_URL || ""
if (!MONGO) { console.error("Missing MONGODB_URI"); process.exit(1) }
await mongoose.connect(MONGO)
console.log("mongo connected")

app.get("/api/health", (_req, res) => res.json({ ok: true }))
app.use("/api/auth", authRoutes)
app.use("/api/customers", customersRoutes)
app.use("/api/visits", visitsRoutes)
app.use("/api/sales", salesRoutes)

const PORT = process.env.PORT || 10000
app.listen(PORT, () => console.log("listening", PORT))