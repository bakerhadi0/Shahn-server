import express from 'express';
import Customer from '../models/Customer.js';
const router = express.Router();

router.get('/', async (req,res,next)=>{
  try{
    const q=(req.query.q||'').trim();
    const f=q?{name:new RegExp(q,'i'),user:req.user.id}:{user:req.user.id};
    const items=await Customer.find(f).sort({createdAt:-1}).lean();
    res.json({ok:true,items});
  }catch(e){next(e);}
});

router.post('/', async (req,res,next)=>{
  try{
    const {name,company,phone,location,notes}=req.body;
    const doc=await Customer.create({name,company,phone,location,notes,user:req.user.id});
    res.json({ok:true,item:doc});
  }catch(e){next(e);}
});

export default router;
