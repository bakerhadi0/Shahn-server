import { Router } from 'express';
import Customer from '../models/Customer.js';
import { requireAuth } from './auth.js';

const router = Router();

// list with optional search ?q=term
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { q } = req.query;
    const query = q ? {
      $or: [
        { name:     { $regex: q, $options: 'i' } },
        { company:  { $regex: q, $options: 'i' } },
        { phone:    { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } }
      ]
    } : {};
    const items = await Customer.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) { next(e); }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const item = await Customer.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const item = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (e) { next(e); }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const item = await Customer.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
