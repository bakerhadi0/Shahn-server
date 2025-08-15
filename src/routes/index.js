import { Router } from 'express';
import auth from './auth.js';
import products from './products.js';
import sales from './sales.js';
import visits from './visits.js';
import customers from './customers.js';

const router = Router();

router.use('/auth', auth);
router.use('/products', products);
router.use('/sales', sales);
router.use('/visits', visits);
router.use('/customers', customers);

export default router;
