import { Router } from 'express';
import auth from './auth.js';
import products from './products.js';
import sales from './sales.js';

const router = Router();
router.use('/auth', auth);
router.use('/products', products);
router.use('/sales', sales);
export default router;
