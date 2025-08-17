const router = require("express").Router();
const Customer = require("../models/Customer");
const { requireAuth } = require("../lib/auth");

router.get("/", requireAuth, async (req,res,next)=>{
  try{
    const s = (req.query.s||"").trim();
    const q = s ? { $or:[
      { name: new RegExp(s,"i") },
      { company: new RegExp(s,"i") },
      { phone: new RegExp(s,"i") }
    ] } : {};
    const items = await Customer.find(q).sort({createdAt:-1}).lean();
    res.json(items);
  }catch(e){ next(e); }
});

router.post("/", requireAuth, async (req,res,next)=>{
  try{
    const c = await Customer.create({
      name:req.body.name,
      company:req.body.company,
      phone:req.body.phone,
      location:req.body.location,
      notes:req.body.notes
    });
    res.status(201).json(c);
  }catch(e){ next(e); }
});

module.exports = router;
