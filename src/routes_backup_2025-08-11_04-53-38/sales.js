import { Router } from "express"
import Sale from "../models/sale.js"
import { authRequired } from "../middleware/auth.js"
import PDFDocument from "pdfkit"

const router = Router()

router.get("/", authRequired, async (_req, res) => {
  const rows = await Sale.find().sort({ createdAt: -1 })
  res.json(rows)
})

router.post("/", authRequired, async (req, res) => {
  const doc = await Sale.create(req.body)
  res.status(201).json(doc)
})

router.put("/:id", authRequired, async (req, res) => {
  const doc = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(doc)
})

router.delete("/:id", authRequired, async (req, res) => {
  await Sale.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

router.get("/export.csv", authRequired, async (req, res) => {
  const { from, to } = req.query
  const match = {}
  if (from || to) {
    match.createdAt = {}
    if (from) match.createdAt.$gte = new Date(from)
    if (to) { const d = new Date(to); d.setHours(23,59,59,999); match.createdAt.$lte = d }
  }
  const rows = await Sale.find(match).sort({ createdAt: 1 })
  const header = "date,item,qty,price,total,customer,notes\n"
  const csv = header + rows.map(r => {
    const total = Number(r.qty||0) * Number(r.price||0)
    const cols = [
      new Date(r.createdAt).toISOString().slice(0,10),
      (r.item||"").replace(/,/g," "),
      r.qty||0,
      r.price||0,
      total,
      (r.customer||"").replace(/,/g," "),
      (r.notes||"").replace(/[\r\n,]/g," ")
    ]
    return cols.join(",")
  }).join("\n")
  res.setHeader("Content-Type","text/csv; charset=utf-8")
  res.setHeader("Content-Disposition","attachment; filename=\"sales.csv\"")
  res.send(csv)
})

router.get("/:id/invoice.pdf", authRequired, async (req, res) => {
  const s = await Sale.findById(req.params.id)
  if (!s) return res.status(404).end()
  res.setHeader("Content-Type","application/pdf")
  res.setHeader("Content-Disposition",`inline; filename=invoice-${s._id}.pdf`)
  const doc = new PDFDocument({ margin: 48 })
  doc.pipe(res)
  doc.fontSize(18).text("فاتورة مبيعات", { align: "center" })
  doc.moveDown()
  doc.fontSize(12)
  doc.text(`رقم: ${s._id}`)
  doc.text(`التاريخ: ${new Date(s.createdAt).toLocaleDateString("en-GB")}`)
  doc.moveDown()
  doc.text(`العميل: ${s.customer||"-"}`)
  doc.text(`المنتج: ${s.item||"-"}`)
  doc.text(`الكمية: ${s.qty||0}`)
  doc.text(`السعر: ${s.price||0}`)
  const total = Number(s.qty||0) * Number(s.price||0)
  doc.moveDown()
  doc.fontSize(14).text(`الإجمالي: ${total}`)
  doc.moveDown()
  doc.fontSize(12).text(`ملاحظات: ${s.notes||"-"}`)
  doc.end()
})

export default router