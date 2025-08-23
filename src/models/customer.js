import mongoose from "mongoose";
const CustomerSchema=new mongoose.Schema(
  {name:{type:String,required:true,trim:true},company:{type:String,trim:true},phone:{type:String,trim:true},location:{type:String,trim:true},notes:{type:String,trim:true},user:{type:mongoose.Schema.Types.ObjectId,ref:"User"}},
  {timestamps:true}
);
export default mongoose.model("Customer",CustomerSchema);
