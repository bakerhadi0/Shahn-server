// src/index.js
import express from "express"
import cors from "cors"
import morgan from "morgan"
import mongoose from "mongoose"

import authRoutes from "./routes/auth.js"
import customersRoutes from "./routes/customers.js"
import productsRoutes from "./routes/products.js"
import salesRoutes from "./routes/sales.js"
import statsRoutes from "./routes/stats.js"

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

app.get("/api/health", (_req, res) => res.send("ok"))

app.use("/api/auth", authRoutes)
app.use("/api/customers", customersRoutes)
app.use("/api/products", productsRoutes)
app.use("/api/sales", salesRoutes)
app.use("/api/stats", statsRoutes)

const PORT = process.env.PORT || 10000
const MONGO = (process.env.MONGO_URI || process.env.MONGODB_URI || process.env.MONGO_URL || "").trim()

if (!MONGO) {
  console.error("Missing Mongo connection string")
  process.exit(1)
}

mongoose.set("strictQuery", true)
mongoose
  .connect(MONGO, { dbName: process.env.MONGO_DB || undefined })
  .then(() => {
    console.log("mongo connected")
    app.listen(PORT, () => console.log("listening", PORT))
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })