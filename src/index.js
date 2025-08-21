import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import saleRoutes from './routes/sales.js';
import visitRoutes from './routes/visits.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 10000;

mongoose.connect(MONGODB_URI).then(()=>console.log('MongoDB Connected')).catch((err)=>{console.error('MongoDB error', err); process.exit(1);});

app.get('/', (req,res)=>res.json({ ok:true, service:'Shahn Server' }));
app.get('/api/health', (req,res)=>res.json({ ok:true, mongo: mongoose.connection.readyState===1?'connected':'disconnected' }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/visits', visitRoutes);
app.use("/api/customers", require("./routes/customers"));
app.use("/api/customers", require("./routes/customers"));

app.use((err, req, res, next)=>{ console.error('Error:', err); res.status(500).json({ message: err.message || 'Server error' }); });

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));

app.use('/api/auth', require('./routes/auth.register'));

app.use('/api/customers', requireAuth, require('./routes/customers'));
