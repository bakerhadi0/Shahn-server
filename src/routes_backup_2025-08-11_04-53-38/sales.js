import { Router } from 'express';
import Sale from '../models/Sale.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { product, quantity, total } = req.body;
    const sale = await Sale.create({ product, quantity, total });
    res.json(sale);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/', async (_req, res) => {
  try {
    const sales = await Sale.find();
    res.json(sales);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
