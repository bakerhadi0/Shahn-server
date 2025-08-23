import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import authRoutes, { requireAuth } from "./routes/auth.js";
import customersRoutes from "./routes/customers.js";
import productsRoutes from "./routes/products.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const MONGO = process.env.MONGO_URI || process.env.MONGODB_URI || "";
mongoose.connect(MONGO).then(() => console.log("mongo connected")).catch(console.error);

app.get("/api/health", (req, res) => res.json({ ok: true, mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected" }));

app.use("/api/auth", authRoutes);
app.use("/api/customers", requireAuth, customersRoutes);
app.use("/api/products", requireAuth, productsRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("listening", PORT));

export default app;