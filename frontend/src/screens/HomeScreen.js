import React, { useEffect } from 'react';
import { useDispatch, useSelector} from 'react-redux';
// import axios from 'axios';
import { Row, Col } from 'react-bootstrap';

import { ListProducts } from '../actions/productActions';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Error from '../components/Error';
// import products from '../products';

const HomeScreen = () => {

    const dispatch = useDispatch();

    const productList = useSelector(state => state.productList);
    const { loading, error, products} = productList;

    useEffect( () => {
        dispatch(ListProducts())
    }, [dispatch])

    // const [products, setProducts] = useState([]);

    // useEffect( () => {
    //     const fetchProducts = async () => {
    //         const res = await axios.get('/api/products')

    //         setProducts(res.data);
    //     }

    //     fetchProducts();
    // }, []);

    return <div>
        <h1>Latest Products</h1>
        { loading ? <Loader /> : error ? <Error variant='danger'>{error}</Error> :
        <Row>
            {products.map( (product) => {
                return <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product}/>
                </Col>
            })}
        </Row> }
    </div>
}

export default HomeScreen;