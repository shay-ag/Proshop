import Express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';

import connectDB from './config/db.js';
import products from '../backend/data/products.js';

dotenv.config();
connectDB();
const app = Express();

app.get('/', (req, res) => {
    res.send('API is running....');
});

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/products/:pid', (req, res) => {

    const product = products.find( (product) => {
        return product._id === req.params.pid;
    });

    res.json(product);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));