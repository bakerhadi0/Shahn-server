import { Router } from 'express';
import Customer from '../models/Customer.js';

const router = Router();

// list
router.get('/', async (req, res, next) => {
  try {
    const q = {};
    if (req.query.search) q.name = new RegExp(req.query.search, 'i');
    const items = await Customer.find(q).sort({ name: 1 }).limit(500);
    res.json(items);
  } catch (e) { next(e); }
});

// create
router.post('/', async (req, res, next) => {
  try {
    const item = await Customer.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
});

export default router;
