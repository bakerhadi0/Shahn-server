import { Router } from "express"
import Sale from "../models/Sales.js"

const router = Router()

router.get("/", async (req,res)=>{ const items = await Sale.find().sort({createdAt:-1}); res.json(items) })
router.post("/", async (req,res)=>{ const x = await Sale.create(req.body); res.status(201).json(x) })
router.put("/:id", async (req,res)=>{ const x = await Sale.findByIdAndUpdate(req.params.id, req.body, {new:true}); res.json(x) })
router.delete("/:id", async (req,res)=>{ await Sale.findByIdAndDelete(req.params.id); res.json({ok:true}) })

export default router