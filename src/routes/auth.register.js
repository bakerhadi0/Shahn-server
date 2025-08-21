const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { requireAuth } = require("../utils/auth");
router.post("/register", requireAuth, async (req,res,next)=>{
  try{
    if(!req.user || req.user.role!=="admin") return res.status(403).json({message:"forbidden"});
    const { name, email, password, role } = req.body || {};
    if(!name || !email || !password || !role) return res.status(400).json({message:"missing fields"});
    const exists = await User.findOne({ email });
    if(exists) return res.status(409).json({message:"email exists"});
    const hash = await bcrypt.hash(password,10);
    const u = await User.create({ name, email, password: hash, role });
    res.status(201).json({ id:u._id, name:u.name, email:u.email, role:u.role, createdAt:u.createdAt });
  }catch(e){ next(e); }
});
module.exports = router;
