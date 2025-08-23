import mongoose from "mongoose";
const schema=new mongoose.Schema({ email:{type:String,unique:true}, password:String, role:String },{timestamps:true});
export default mongoose.model("User",schema);