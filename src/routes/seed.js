// src/routes/seed.js
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import Product from '../models/Product.js';
import Sale from '../models/Sale.js';
import User from '../models/User.js';

const router = Router();

router.post('/run', async (req, res) => {
  try {
    // 1) إنشاء أدمن إن لم يوجد
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
    const adminPass  = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const passwordHash = await bcrypt.hash(adminPass, 10);
      admin = await User.create({
        name: 'Admin',
        email: adminEmail,
        passwordHash,
        role: 'admin',
      });
    }

    // 2) منتجات تجريبية
    const productsSeed = [
      { name: 'Water 330ml',   price: 1.5,  stock: 500 },
      { name: 'Pepsi 355ml',   price: 3.0,  stock: 300 },
      { name: 'Tea Cup',       price: 2.5,  stock: 200 },
      { name: 'Business Card', price: 35.0, stock: 50  },
    ];

    const createdProducts = [];
    for (const p of productsSeed) {
      const prod = await Product.findOneAndUpdate(
        { name: p.name },
        { $setOnInsert: p },
        { new: true, upsert: true }
      );
      createdProducts.push(prod);
    }

    // 3) مبيعات تجريبية بسيطة
    if (createdProducts.length >= 2) {
      const salesSeed = [
        {
          product: createdProducts[0]._id,
          quantity: 10,
          total: createdProducts[0].price * 10,
          date: new Date(),
        },
        {
          product: createdProducts[1]._id,
          quantity: 5,
          total: createdProducts[1].price * 5,
          date: new Date(),
        },
      ];
      for (const s of salesSeed) {
        await Sale.create(s);
      }
    }

    res.json({
      ok: true,
      admin: { email: admin.email },
      seeded: { products: createdProducts.length, sales: 2 },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, message: e.message });
  }
});

export default router;