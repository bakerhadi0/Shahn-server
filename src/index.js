import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import customersRoutes from "./routes/customers.js"
import visitsRoutes from "./routes/visits.js"
import productsRoutes from "./routes/products.js"
import salesRoutes from "./routes/sales.js"
import statsRoutes from "./routes/stats.js"
import authRoutes from "./routes/auth.js"
import usersRoutes from "./routes/users.js"

const app = express()
app.use(cors())
app.use(express.json())

app.get("/api/health", (_req, res) => res.send("ok"))

const PORT = process.env.PORT || 10000
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI

mongoose.set("strictQuery", true)
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("mongo connected")
    app.use("/api/auth", authRoutes)
    app.use("/api/customers", customersRoutes)
    app.use("/api/visits", visitsRoutes)
    app.use("/api/products", productsRoutes)
    app.use("/api/sales", salesRoutes)
    app.use("/api/stats", statsRoutes)
    app.use("/api/users", usersRoutes)
    app.listen(PORT, () => console.log("listening", PORT))
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })