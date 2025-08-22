import { Router } from "express";
import jwt from "jsonwebtoken";
const router=Router();
router.post("/login",async(req,res)=>{const{email,password}=req.body;const token=jwt.sign({email,role:"admin"},process.env.JWT_SECRET||"dev",{expiresIn:"7d"});res.json({token});});
export function requireAuth(req,res,next){const h=req.headers.authorization||"";const t=h.startsWith("Bearer ")?h.slice(7):"";try{const p=jwt.verify(t,process.env.JWT_SECRET||"dev");req.user=p;next();}catch(e){res.status(401).json({message:"Unauthorized"});}}
export default router;
