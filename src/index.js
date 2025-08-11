import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

// ----- App & Middleware -----
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ----- DB -----
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// ----- Schemas -----
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },     // سعر الوحدة (يسمح بالهللة)
  unitType: { type: String, default: 'piece' },         // piece / cup / roll ...
  packSize: { type: Number, default: 1, min: 1 },       // عدد الوحدات في الشد/العبوة
  sku: { type: String },
  notes: { type: String }
}, { timestamps: true });

const saleSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },     // عدد العلب/الشدّات/الرولات (وليس عدد الوحدات الفردية)
  unitPrice: { type: Number },                            // اختياري: لو أرسلت سعر مختلف وقت البيع
  unitType: { type: String },                             // اختياري
  packSize: { type: Number },                             // اختياري: لو اختلف عن المنتج
  // خصم
  discountType: { type: String, enum: ['percent', 'amount', null], default: null },
  discountValue: { type: Number, default: 0 },
  // VAT
  vatEnabled: { type: Boolean, default: true },
  vatRate: { type: Number, default: 15 },                 // %
  // حقول محسوبة
  qtyUnits: { type: Number, default: 0 },
  subtotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  vat: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
}, { timestamps: true });

// حسابات تلقائية قبل الحفظ
saleSchema.pre('save', async function(next) {
  try {
    const Product = mongoose.model('Product');
    const prod = await Product.findById(this.product);
    if (!prod) throw new Error('Product not found');

    const uPrice = (this.unitPrice ?? prod.price) || 0;
    const pSize  = (this.packSize ?? prod.packSize) || 1;

    this.unitType = this.unitType ?? prod.unitType;
    this.packSize = pSize;

    // إجمالي الوحدات = الكمية × حجم العبوة
    this.qtyUnits = this.quantity * pSize;

    // المجموع قبل الخصم والضريبة
    this.subtotal = +(this.qtyUnits * uPrice).toFixed(2);

    // الخصم
    let discountVal = 0;
    if (this.discountType === 'percent' && this.discountValue > 0) {
      discountVal = +(this.subtotal * (this.discountValue / 100)).toFixed(2);
    } else if (this.discountType === 'amount' && this.discountValue > 0) {
      discountVal = +this.discountValue.toFixed(2);
    }
    discountVal = Math.min(discountVal, this.subtotal);
    this.discount = discountVal;

    const afterDiscount = +(this.subtotal - discountVal).toFixed(2);

    // VAT
    const rate = this.vatEnabled ? (this.vatRate ?? 15) : 0;
    this.vat = +((afterDiscount * rate) / 100).toFixed(2);

    // الإجمالي النهائي
    this.total = +(afterDiscount + this.vat).toFixed(2);

    next();
  } catch (e) {
    next(e);
  }
});

const Product = mongoose.model('Product', productSchema);
const Sale = mongoose.model('Sale', saleSchema);

// ----- Health -----
app.get('/', (req, res) => {
  res.json({ ok: true, service: 'Shahn Sales API' });
});
app.get('/api/health', (req, res) => {
  res.json({ ok: true, mongo: mongoose.connection.readyState === 1 ? 'connected' : 'not-connected' });
});

// ----- Products CRUD -----
app.get('/api/products', async (req, res, next) => {
  try {
    const items = await Product.find().sort({ createdAt: -1 }).limit(1000);
    res.json(items);
  } catch (e) { next(e); }
});

app.post('/api/products', async (req, res, next) => {
  try {
    // تأكد من price
    if (typeof req.body.price !== 'number') return res.status(400).json({ message: 'price is required (number)' });
    const item = await Product.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
});

app.get('/api/products/:id', async (req, res, next) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (e) { next(e); }
});

app.put('/api/products/:id', async (req, res, next) => {
  try {
    const item = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (e) { next(e); }
});

app.delete('/api/products/:id', async (req, res, next) => {
  try {
    const item = await Product.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// ----- Sales -----
app.get('/api/sales', async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const q = {};
    if (from || to) {
      q.createdAt = {};
      if (from) q.createdAt.$gte = new Date(from);
      if (to) q.createdAt.$lte = new Date(to);
    }
    const items = await Sale.find(q).populate('product').sort({ createdAt: -1 }).limit(500);
    res.json(items);
  } catch (e) { next(e); }
});

app.post('/api/sales', async (req, res, next) => {
  try {
    // أقل شيء: product + quantity (اختياريًا: unitPrice, packSize, discountType, discountValue, vatEnabled, vatRate)
    const sale = await Sale.create(req.body);
    res.status(201).json(sale);
  } catch (e) { next(e); }
});

app.get('/api/sales/summary', async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const match = {};
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }
    const agg = await Sale.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          qtyUnits: { $sum: '$qtyUnits' },
          subtotal: { $sum: '$subtotal' },
          discount: { $sum: '$discount' },
          vat: { $sum: '$vat' },
          total: { $sum: '$total' }
        }
      }
    ]);
    const summary = agg[0] || { count: 0, qtyUnits: 0, subtotal: 0, discount: 0, vat: 0, total: 0 };
    res.json({ ok: true, ...summary });
  } catch (e) { next(e); }
});

// ----- Error handler -----
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ message: err.message || 'Server error' });
});

// ----- Start -----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));