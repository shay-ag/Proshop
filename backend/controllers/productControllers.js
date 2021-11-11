import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

const getProducts = asyncHandler(async (req, res) => {

    const products = await Product.find( {})

    res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {

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
})

export { getProducts, getProductById };