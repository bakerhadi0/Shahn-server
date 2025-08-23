import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import authRoutes from "./routes/auth.js";
import customersRoutes from "./routes/customers.js";
import productsRoutes from "./routes/products.js";
import salesRoutes from "./routes/sales.js";
import statsRoutes from "./routes/stats.js";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json(31));
app.use("/api/auth", authRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/stats", statsRoutes);

await mongoose.connect(process.env.MONGO_URI);

app.listen(PORT, () => {
  console.log("listening", PORT);
});