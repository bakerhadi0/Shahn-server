import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import customersRoutes from "./routes/customers.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req,res)=>res.json({ ok:true, mongo: mongoose.connection.readyState===1?"connected":"disconnected" }));

app.use("/api/auth", authRoutes);
app.use("/api/customers", customersRoutes);

mongoose.connect(process.env.MONGO_URL);
const port = process.env.PORT || 10000;
app.listen(port);
export default app;