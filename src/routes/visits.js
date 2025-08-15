import express from "express";
import Visit from "../models/Visit.js";
import { requireAuth } from "../middleware/auth.js";
const router=express.Router();

router.post("/", requireAuth, async (req,res,next)=>{
  try{
    const payload={ user:req.user.id, customer:req.body.customer, notes:req.body.notes,
      location:req.body.location, photos:req.body.photos||[], sale:req.body.sale||null,
      finishedAt:req.body.finishedAt||null };
    const v=await Visit.create(payload);
    res.status(201).json(v);
  }catch(e){ next(e); }
});

router.get("/", requireAuth, async (req,res,next)=>{
  try{
    const {user,customer,from,to}=req.query; const q={};
    if(customer) q.customer=customer; if(user) q.user=user;
    if(from||to){ q.createdAt={}; if(from) q.createdAt.$gte=new Date(from); if(to) q.createdAt.$lte=new Date(to); }
    if(!user && req.user.role!=="admin") q.user=req.user.id;
    const items=await Visit.find(q).populate("user","name role").populate("customer","name company");
    res.json(items);
  }catch(e){ next(e); }
});

router.get("/summary", requireAuth, async (req,res,next)=>{
  try{
    const {from,to}=req.query; const match={};
    if(from||to){ match.createdAt={}; if(from) match.createdAt.$gte=new Date(from); if(to) match.createdAt

if(to) match.createdAt.$lte=new Date(to);
    const agg=await Visit.aggregate([
      { $match: match },
      { $group: { _id: "$user", count: { $sum: 1 } } }
    ]);
    res.json(agg);
  }catch(e){ next(e); }
});
export default router;
