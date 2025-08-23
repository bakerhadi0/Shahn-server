import mongoose from "mongoose"
const schema = new mongoose.Schema(
  { customer:String, product:String, qty:{type:Number,min:1}, price:{type:Number,min:0}, notes:String },
  { timestamps:true }
)
export default mongoose.model("Sale", schema)