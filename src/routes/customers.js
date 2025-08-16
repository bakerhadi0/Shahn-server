const router = require("express").Router();
const Customer = require("../models/Customer");
const { requireAuth } = require("../middleware/auth");

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const { search } = req.query;
    const q = {};
    if (search) {
      const re = new RegExp(search, "i");
      q.$or = [{ name: re }, { company: re }, { phone: re }];
    }
    const items = await Customer.find(q).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) { next(e); }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const b = req.body || {};
    const item = await Customer.create({
      name: b.name, company: b.company, phone: b.phone,
      location: b.location, notes: b.notes, user: req.user.id
    });
    res.status(201).json(item);
  } catch (e) { next(e); }
});

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const item = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (e) { next(e); }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
