import { Router } from 'express';
import Sale from '../models/Sale.js';

const router = Router();

/** ملخص مبيعات حسب التاريخ (from/to بصيغة YYYY-MM-DD) */
router.get('/summary', async (req, res) => {
  try {
    const { from, to } = req.query;
    const q = {};
    if (from || to) {
      q.date = {};
      if (from) q.date.$gte = new Date(from);
      if (to)   q.date.$lte = new Date(to + 'T23:59:59.999Z');
    }
    const sales = await Sale.find(q);
    const summary = sales.reduce((acc, s) => {
      acc.count += 1;
      acc.total += Number(s.total || 0);
      return acc;
    }, { count: 0, total: 0 });
    res.json({ ok: true, ...summary });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
});

/** إنشاء عملية بيع */
router.post('/', async (req, res) => {
  try {
    const { product, quantity, total, note, date } = req.body;
    const sale = await Sale.create({ product, quantity, total, note, date });
    res.status(201).json(sale);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/** عرض كل المبيعات */
router.get('/', async (_req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/** تحديث عملية بيع */
router.put('/:id', async (req, res) => {
  try {
    const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sale) return res.status(404).json({ message: 'Not found' });
    res.json(sale);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/** حذف عملية بيع */
router.delete('/:id', async (req, res) => {
  try {
    const result = await Sale.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
