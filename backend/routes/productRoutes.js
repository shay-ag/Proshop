import express from 'express';

import { getProducts, getProductById } from '../controllers/productControllers.js';
// import Product from '../models/productModel.js';

const router = express.Router();

//fetching all products
router.get('/', getProducts);

//fetching product by product id
router.get('/:pid', getProductById);

export default router;
