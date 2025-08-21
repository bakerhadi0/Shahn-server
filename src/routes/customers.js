const express = require('express');
const Customer = require('../models/Customer');
const router = express.Router();

router.get('/', async (req,res,next)=>{
  try{
    const q = {};
    if(req.query.q){
      const rx = new RegExp(req.query.q,'i');
      q.$or = [{name:rx},{company:rx},{phone:rx},{location:rx}];
    }
    const items = await Customer.find(q).sort({createdAt:-1}).limit(500);
    res.json({ok:true, items});
  }catch(e){ next(e); }
});

router.post('/', async (req,res,next)=>{
  try{
    const c = new Customer(req.body);
    await c.save();
    res.status(201).json({ok:true, item:c});
  }catch(e){ next(e); }
});

module.exports = router;
