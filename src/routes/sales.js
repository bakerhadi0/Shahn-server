// src/routes/sales.js
import { Router } from 'express';
import Sale from '../models/Sale.js';

const router = Router();

// إنشاء بيع مع دعم packSize/unitPrice/discount/vatRate
router.post('/', async (req, res) => {
  try {
    const { product, quantity, packSize, unitPrice, discountType, discountValue, vatRate, note, date } = req.body;
    if (!product || !quantity) return res.status(400).json({ message: 'product و quantity مطلوبان' });

    const sale = await Sale.create({ product, quantity, packSize, unitPrice, discountType, discountValue, vatRate, note, date });
    res.status(201).json({ ok: true, sale });
  } catch (e) {
    console.error('Create sale error:', e);
    res.status(500).json({ message: e.message });
  }
});

// عرض المبيعات
router.get('/', async (_req, res) => {
  try {
    const items = await Sale.find().sort({ createdAt: -1 }).limit(500).populate('product');
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// ملخص
router.get('/summary', async (req, res) => {
  try {
    const { from, to } = req.query;
    const q = {};
    if (from || to) {
      q.date = {};
      if (from) q.date.$gte = new Date(from);
      if (to) q.date.$lte = new Date(to + 'T23:59:59.999Z');
    }
    const sales = await Sale.find(q).lean();
    const summary = sales.reduce((acc, s) => {
      acc.count += 1;
      acc.qtyUnits += Number(s.qtyUnits || 0);
      acc.subtotal += Number(s.subtotal || 0);
      acc.discount += Number(s.discount || 0);
      acc.vat      += Number(s.vat || 0);
      acc.total    += Number(s.total || 0);
      return acc;
    }, { count: 0, qtyUnits: 0, subtotal: 0, discount: 0, vat: 0, total: 0 });
    // تقريب لرقمين
    const round2 = (n)=>Number(Number(n).toFixed(2));
    res.json({
      ok: true,
      ...summary,
      subtotal: round2(summary.subtotal),
      discount: round2(summary.discount),
      vat: round2(summary.vat),
      total: round2(summary.total)
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
