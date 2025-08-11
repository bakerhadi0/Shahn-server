// src/models/Sale.js
import mongoose from 'mongoose';
import Product from './Product.js';

/**
 * Sale schema يدعم:
 * - quantity: عدد العبوات/الشّدّات
 * - packSize: عدد الوحدات داخل العبوة (يثبّت وقت البيع)
 * - qtyUnits = quantity * packSize
 * - unitPrice: سعر الوحدة وقت البيع (يثبّت)
 * - subtotal = qtyUnits * unitPrice
 * - discountType: 'percent' | 'amount' | undefined
 * - discountValue: قيمة الخصم (إن كانت نسبة -> 0-100)
 * - discount = نسبة * subtotal أو مبلغ مباشر
 * - vatRate: نسبة ضريبة القيمة المضافة (مثل 0.15) (يثبّت)
 * - vat = (subtotal - discount) * vatRate
 * - total = subtotal - discount + vat
 */
const saleSchema = new mongoose.Schema({
  product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity:  { type: Number, required: true, min: 1 },

  packSize:  { type: Number },   // يملأ من المنتج إن لم يُرسل
  qtyUnits:  { type: Number },   // يحسب تلقائيًا
  unitPrice: { type: Number },   // يملأ من المنتج إن لم يُرسل

  subtotal:  { type: Number },   // qtyUnits * unitPrice

  discountType:  { type: String, enum: ['percent', 'amount', null], default: null },
  discountValue: { type: Number, default: 0 },
  discount:      { type: Number, default: 0 },

  vatRate:       { type: Number },  // ثابت وقت البيع (مثلاً 0.15)
  vat:           { type: Number, default: 0 },

  total:         { type: Number },   // subtotal - discount + vat

  note:          { type: String, trim: true },
  date:          { type: Date, default: Date.now }
}, { timestamps: true });

function round2(n) {
  return Number(Number(n).toFixed(2));
}

async function computeAll(doc) {
  const prod = await Product.findById(doc.product).lean();
  if (!prod) throw new Error('Product not found');

  // defaults
  if (doc.unitPrice === undefined || doc.unitPrice === null) doc.unitPrice = Number(prod.price || 0);
  if (doc.packSize  === undefined || doc.packSize  === null) doc.packSize  = Number(prod.packSize || 1);
  const qtyUnits = Number(doc.quantity) * Number(doc.packSize);
  const subtotal = round2(qtyUnits * Number(doc.unitPrice));

  // discount
  let discount = 0;
  if (doc.discountType === 'percent') {
    const pct = Math.max(0, Math.min(100, Number(doc.discountValue || 0)));
    discount = round2(subtotal * (pct / 100));
  } else if (doc.discountType === 'amount') {
    discount = Math.max(0, Number(doc.discountValue || 0));
    if (discount > subtotal) discount = subtotal; // لا يتجاوز
    discount = round2(discount);
  }

  // VAT
  const vatRate = (doc.vatRate !== undefined && doc.vatRate !== null)
    ? Number(doc.vatRate)
    : 0.15; // الافتراضي 15%
  const vatBase = Math.max(0, subtotal - discount);
  const vat = round2(vatBase * vatRate);

  const total = round2(vatBase + vat);

  // assign
  doc.qtyUnits = qtyUnits;
  doc.subtotal = subtotal;
  doc.discount = discount;
  doc.vatRate  = vatRate;
  doc.vat      = vat;
  doc.total    = total;
}

// on save
saleSchema.pre('save', async function(next) {
  try {
    await computeAll(this);
    next();
  } catch (e) { next(e); }
});

// on update
saleSchema.pre('findOneAndUpdate', async function(next) {
  try {
    const update = this.getUpdate() || {};
    if ('quantity' in update || 'packSize' in update || 'unitPrice' in update
        || 'product' in update || 'discountType' in update || 'discountValue' in update
        || 'vatRate' in update) {
      const current = await this.model.findOne(this.getQuery()).lean();
      if (!current) return next();

      const doc = {
        product:      'product' in update ? update.product      : current.product,
        quantity:     'quantity' in update ? update.quantity     : current.quantity,
        packSize:     'packSize' in update ? update.packSize     : current.packSize,
        unitPrice:    'unitPrice' in update ? update.unitPrice   : current.unitPrice,
        discountType: 'discountType' in update ? update.discountType : current.discountType,
        discountValue:'discountValue' in update ? update.discountValue: current.discountValue,
        vatRate:      'vatRate' in update ? update.vatRate       : current.vatRate
      };

      // compute using helper
      // fill defaults inside computeAll-like logic:
      const fake = { ...doc };
      await (async () => {
        const prod = await Product.findById(fake.product).lean();
        if (!prod) throw new Error('Product not found');
        if (fake.unitPrice === undefined || fake.unitPrice === null) fake.unitPrice = Number(prod.price || 0);
        if (fake.packSize  === undefined || fake.packSize  === null) fake.packSize  = Number(prod.packSize || 1);

        const round2 = (n)=>Number(Number(n).toFixed(2));
        const qtyUnits = Number(fake.quantity) * Number(fake.packSize);
        const subtotal = round2(qtyUnits * Number(fake.unitPrice));
        let discount = 0;
        if (fake.discountType === 'percent') {
          const pct = Math.max(0, Math.min(100, Number(fake.discountValue || 0)));
          discount = round2(subtotal * (pct / 100));
        } else if (fake.discountType === 'amount') {
          discount = Math.max(0, Number(fake.discountValue || 0));
          if (discount > subtotal) discount = subtotal;
          discount = round2(discount);
        }
        const vatRate = (fake.vatRate !== undefined && fake.vatRate !== null) ? Number(fake.vatRate) : 0.15;
        const vatBase = Math.max(0, subtotal - discount);
        const vat = round2(vatBase * vatRate);
        const total = round2(vatBase + vat);

        update.qtyUnits = qtyUnits;
        update.subtotal = subtotal;
        update.discount = discount;
        update.vatRate  = vatRate;
        update.vat      = vat;
        update.total    = total;
      })();
      this.setUpdate(update);
    }
    next();
  } catch (e) { next(e); }
});

export default mongoose.model('Sale', saleSchema);
