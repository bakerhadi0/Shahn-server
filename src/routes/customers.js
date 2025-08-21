const router = require('express').Router();
const Customer = require('../models/Customer');

router.get('/', async (req, res, next) => {
  try {
    const items = await Customer.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const v = await Customer.create({
      name: req.body.name,
      company: req.body.company,
      phone: req.body.phone,
      location: req.body.location,
      notes: req.body.notes
    });
    res.status(201).json(v);
  } catch (e) { next(e); }
});

module.exports = router;
