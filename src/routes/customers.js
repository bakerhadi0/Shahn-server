import { Router } from "express";
import Customer from "../models/Customer.js";
const router=Router();
router.get("/",async(req,res)=>{const items=await Customer.find().sort({createdAt:-1}).lean();res.json(items);});
router.post("/",async(req,res)=>{const body={...req.body};if(req.user&&req.user.id)body.user=req.user.id;const doc=await Customer.create(body);res.status(201).json(doc);});
export default router;
