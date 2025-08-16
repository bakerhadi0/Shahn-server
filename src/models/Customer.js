const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    company: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    notes: { type: String, default: "" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", CustomerSchema);
