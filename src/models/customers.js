import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, default: "" },
    phone:   { type: String, default: "" },
    location:{ type: String, default: "" },
    notes:   { type: String, default: "" },
    user:    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.model("Customer", schema);
