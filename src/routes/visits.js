import { Router } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const router = Router();

function requireAuth(req, res, next) {
  const hdr = req.headers.authorization || '';
  const parts = hdr.split(' ');
  const token = parts.length === 2 ? parts[1] : '';
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = payload; next();
  } catch { res.status(401).json({ message: 'Unauthorized' }); }
}

const Visit = mongoose.models.Visit || mongoose.model('Visit', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customer: { type: String, required: true },
  purpose: { type: String },
  location: { type: String },
  notes: { type: String },
}, { timestamps: true }));

router.post('/', requireAuth, async (req, res, next) => {
  try { const v = await Visit.create({ ...req.body, user: req.user.id }); res.status(201).json(v); }
  catch (e) { next(e); }
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { customer, from, to } = req.query; const q = {};
    if (customer) q.customer = customer;
    if (from || to) { q.createdAt = {}; if (from) q.createdAt.$gte = new Date(from); if (to) q.createdAt.$lte = new Date(to); }
    const items = await Visit.find(q).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) { next(e); }
});

router.get('/summary', requireAuth, async (req, res, next) => {
  try {
    const { from, to } = req.query; const match = {};
    if (from || to) { match.createdAt = {}; if (from) match.createdAt.$gte = new Date(from); if (to) match.createdAt.$lte = new Date(to); }
    const [agg] = await Visit.aggregate([{ $match: match }, { $group: { _id: null, count: { $sum: 1 } } }]);
    res.json({ ok: true, count: agg?.count || 0 });
  } catch (e) { next(e); }
});

export default router;
