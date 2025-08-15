import mongoose from "mongoose";
const locSchema=new mongoose.Schema({ lat:{type:Number}, lng:{type:Number}, designUrl:{type:String},lat:Number,lng:Number},{_id:false});
const visitSchema=new mongoose.Schema(
  { user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    customer:{type:mongoose.Schema.Types.ObjectId,ref:"Customer",required:true},
    notes:String, location:locSchema, photos:[String], sale:{type:mongoose.Schema.Types.ObjectId,ref:"Sale"},
    startedAt:{type:Date,default:Date.now}, finishedAt:Date },
  { timestamps:true }
);
export default mongoose.model("Visit", visitSchema);
