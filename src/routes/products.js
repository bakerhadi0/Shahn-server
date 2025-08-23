import { Router } from "express";
import Product from "../models/product.js";
const router = Router();
router.get("/", async (req,res,next)=>{try{const items=await Product.find().sort({createdAt:-1});res.json(items);}catch(e){next(e)}});
router.post("/", async (req,res,next)=>{try{const doc=await Product.create(req.body);res.status(201).json(doc);}catch(e){next(e)}});
router.put("/:id", async (req,res,next)=>{try{const doc=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true});res.json(doc);}catch(e){next(e)}});
router.delete("/:id", async (req,res,next)=>{try{await Product.findByIdAndDelete(req.params.id);res.json({ok:true});}catch(e){next(e)}});
export default router;
