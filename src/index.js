import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import customersRoutes from "./routes/customers.js";
import productsRoutes from "./routes/products.js";
import salesRoutes from "./routes/sales.js";
import visitsRoutes from "./routes/visits.js";
import statsRoutes from "./routes/stats.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.status(200).send("31"));

app.use("/api/auth", authRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/visits", visitsRoutes);
app.use("/api/stats", statsRoutes);

const PORT = process.env.PORT || 10000;
const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  process.env.DATABASE_URL ||
  "";

if (!MONGO_URI || typeof MONGO_URI !== "string") {
  console.error("Missing Mongo connection string (MONGO_URI/MONGODB_URI).");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, { autoIndex: true })
  .then(() => {
    console.log("mongo connected");
    app.listen(PORT, () => console.log("listening", PORT));
  })
  .catch((err) => {
    console.error("Mongo connect failed:", err);
    process.exit(1);
  });

export default app;