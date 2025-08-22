const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const { q } = req.query;
    const match = {};
    if (q) {
      const rx = new RegExp(q, 'i');
      match.$or = [
        { name: rx },
        { company: rx },
        { phone: rx },
        { location: rx }
      ];
    }
    const items = await Customer.find(match).sort({ createdAt: -1 }).limit(200);
    res.json(items);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, company, phone, location, notes } = req.body || {};
    if (!name) return res.status(400).json({ message: 'name required' });
    const doc = await Customer.create({ name, company, phone, location, notes });
    res.status(201).json(doc);
  } catch (e) { next(e); }
});

module.exports = router;
