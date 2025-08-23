import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import customersRoutes from "./routes/customers.js";
import productsRoutes from "./routes/products.js";
import salesRoutes from "./routes/sales.js";
import statsRoutes from "./routes/stats.js";
import visitsRoutes from "./routes/visits.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.sendStatus(200));

app.use("/api/auth", authRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/visits", visitsRoutes);

await mongoose.connect(process.env.MONGO_URI);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("listening", PORT));