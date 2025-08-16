const router = require('express').Router();
const Customer = require('../models/Customer');
const { requireAuth } = require('../auth');

router.get('/', requireAuth, async (req,res,next)=>{
  try{
    const { q } = req.query;
    const filter = {};
    if (req.user.role !== 'admin') filter.user = req.user.id;
    if (q){
      const rx = new RegExp(q,'i');
      filter.$or = [{name:rx},{company:rx},{phone:rx}];
    }
    const items = await Customer.find(filter).sort({createdAt:-1});
    res.json(items);
  }catch(e){ next(e); }
});

router.post('/', requireAuth, async (req,res,next)=>{
  try{
    const { name, company, phone, location, notes } = req.body;
    const c = await Customer.create({ name, company, phone, location, notes, user: req.user.id });
    res.status(201).json(c);
  }catch(e){ next(e); }
});

router.put('/:id', requireAuth, async (req,res,next)=>{
  try{
    const doc = await Customer.findById(req.params.id);
    if(!doc) return res.status(404).json({message:'Not found'});
    if(req.user.role!=='admin' && String(doc.user)!==String(req.user.id))
      return res.status(403).json({message:'Forbidden'});
    Object.assign(doc, req.body);
    await doc.save();
    res.json(doc);
  }catch(e){ next(e); }
});

router.delete('/:id', requireAuth, async (req,res,next)=>{
  try{
    const doc = await Customer.findById(req.params.id);
    if(!doc) return res.status(404).json({message:'Not found'});
    if(req.user.role!=='admin' && String(doc.user)!==String(req.user.id))
      return res.status(403).json({message:'Forbidden'});
    await doc.deleteOne();
    res.json({ok:true});
  }catch(e){ next(e); }
});

module.exports = router;
