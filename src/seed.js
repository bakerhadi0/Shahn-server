import { Router } from 'express';
import bcrypt from 'bcryptjs';
import Product from '../models/Product.js';
import Sale from '../models/Sale.js';
import User from '../models/User.js';

const router = Router();

/** إنشاء أدمن (إن لم يوجد) + إدخال منتجات ومبيعات تجريبية */
router.post('/run', async (req, res) => {
  try {
    // 1) تأكيد وجود أدمن
    const adminEmail = (process.env.DEFAULT_ADMIN_EMAIL || req.body?.adminEmail || 'admin@example.com').toLowerCase();
    const adminPass  = process.env.DEFAULT_ADMIN_PASSWORD || req.body?.adminPassword || 'Admin@123456';

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const passwordHash = await bcrypt.hash(adminPass, 10);
      admin = await User.create({ name: 'Admin', email: adminEmail, passwordHash, role: 'admin' });
    }

    // 2) منتجات تجريبية (وفق الـ schema الحالي: name/price/stock فقط)
    const productsSeed = [
      { name: 'Water 330ml',  price: 1.5,  stock: 500 },
      { name: 'Pepsi 355ml',  price: 3.0,  stock: 300 },
      { name: 'Tea Cup',      price: 2.5,  stock: 200 },
      { name: 'Business Card',price: 35.0, stock: 50  }
    ];

    const createdProducts = [];
    for (const p of productsSeed) {
      const prod = await Product.findOneAndUpdate(
        { name: p.name },
        { $set: p },
        { new: true, upsert: true }
      );
      createdProducts.push(prod);
    }

    // 3) مبيعات تجريبية (sale.product نص باسم المنتج)
    const priceOf = (name) => (createdProducts.find(x => x.name === name)?.price) || 0;
    const salesSeed = [
      { product: 'Pepsi 355ml',  quantity: 2, total: priceOf('Pepsi 355ml')  * 2, note: 'seed' },
      { product: 'Water 330ml',  quantity: 5, total: priceOf('Water 330ml')  * 5, note: 'seed' },
      { product: 'Business Card',quantity: 1, total: priceOf('Business Card')* 1, note: 'seed' },
    ];

    const createdSales = [];
    for (const s of salesSeed) {
      const sale = await Sale.create(s);
      createdSales.push(sale);
    }

    res.json({
      ok: true,
      admin: { id: admin._id, email: admin.email },
      products: createdProducts.map(p => ({ id: p._id, name: p.name, price: p.price, stock: p.stock })),
      sales: createdSales.map(s => ({ id: s._id, product: s.product, quantity: s.quantity, total: s.total })),
    });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
});

/** حذف بيانات الـ seed */
router.post('/cleanup', async (_req, res) => {
  try {
    const names = ['Water 330ml', 'Pepsi 355ml', 'Tea Cup', 'Business Card'];
    const delProducts = await Product.deleteMany({ name: { $in: names } });
    const delSales = await Sale.deleteMany({ note: 'seed' });
    res.json({ ok: true, deleted: { products: delProducts.deletedCount, sales: delSales.deletedCount } });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
});

export default router;
