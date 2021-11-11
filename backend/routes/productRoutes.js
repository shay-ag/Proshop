import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

const router = express.Router();

//fetching all products
router.get('/', asyncHandler(async (req, res) => {

    const products = await Product.find( {})

    res.json(products);
}));

//fetching product by product id
router.get('/:pid', asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.pid)

    if(product){
        res.json(product)
    } else{
        res.status(404).json( {message: 'Product Not Found'});

        // ---> or
        // res.status(404); ----> (optional)
        // throw new Error('Product Not Found');
    }

    // const product = products.find( (product) => {
    //     return product._id === req.params.pid;
    // });

    // res.json(product);
}));

export default router;
