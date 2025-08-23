import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin","seller"], default: "seller" }
  },
  { timestamps: true }
)

export default mongoose.model("User", UserSchema)