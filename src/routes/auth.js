import { Router } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordHashed: { type: String, required: true },
  role: { type: String, enum: ['admin','sales','designer','logistics'], default: 'sales' },
}, { timestamps: true }));

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email exists' });
    const passwordHashed = await bcrypt.hash(password, 10);
    const u = await User.create({ name, email, passwordHashed, role });
    res.status(201).json({ id: u._id, email: u.email, role: u.role });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email });
    if (!u) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, u.passwordHashed || '');
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: u._id.toString(), role: u.role, name: u.name }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token });
  } catch (e) { next(e); }
});

export default router;
