import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import morgan from "morgan"
import mongoose from "mongoose"

import authRoutes from "./routes/auth.js"
import customersRoutes from "./routes/customers.js"
import productsRoutes from "./routes/products.js"
import salesRoutes from "./routes/sales.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

app.get("/api/health", (req, res) => res.json({ ok: true }))

app.use("/api/auth", authRoutes)
app.use("/api/customers", customersRoutes)
app.use("/api/products", productsRoutes)
app.use("/api/sales", salesRoutes)

const PORT = process.env.PORT || 10000
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("mongo connected")
    app.listen(PORT, () => console.log("listening", PORT))
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

export default app