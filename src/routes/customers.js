const router = require('express').Router();
const Customer = require('../models/Customer');

router.get('/', async (req, res, next) => {
  try {
    const q = {};
    if (!req.user || req.user.role !== 'admin') q.user = req.user.id;
    if (req.query.search) q.$text = { $search: req.query.search };
    const items = await Customer.find(q).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const payload = {
      name: req.body.name,
      company: req.body.company,
      phone: req.body.phone,
      location: req.body.location,
      notes: req.body.notes,
      user: req.user && req.user.id
    };
    const doc = await Customer.create(payload);
    res.status(201).json(doc);
  } catch (e) { next(e); }
});

module.exports = router;
