import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import customersRoutes from "./routes/customers.js";
import salesRoutes from "./routes/sales.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

mongoose.connect(process.env.MONGO_URL);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/sales", salesRoutes);

const port = process.env.PORT || 10000;
app.listen(port, () => console.log("listening", port));