// src/index.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import routes from './routes/index.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// نربط كل الراوتات تحت /api
app.use('/api', routes);

// فحص سريع
app.get('/', (req, res) => res.json({ ok: true, service: 'Shahn Sales API' }));

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

async function start() {
  try {
    if (!MONGODB_URI) throw new Error('Missing MONGODB_URI');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log('✅ Server running on :' + PORT));
  } catch (err) {
    console.error('❌ Startup error:', err.message);
    process.exit(1);
  }
}

start();