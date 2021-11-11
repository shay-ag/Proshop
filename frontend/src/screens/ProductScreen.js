import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form } from  'react-bootstrap';

import { ListProductDetails } from '../actions/productActions';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Error from '../components/Error';
// import axios from 'axios';

// import products from '../products';

const ProductScreen = ( { match, history }) => {

    const [qty, setQty] = useState(1);

    const dispatch = useDispatch();

    const productDetails = useSelector( state => state.productDetails)
    const { loading, error, product } = productDetails;

    useEffect(() => {
        dispatch(ListProductDetails(match.params.pid))
    }, [dispatch, match])

    // const [product, setProduct] = useState({});

    // useEffect( () => {
    //     const fetchProduct = async () => {
    //         const res = await axios.get(`/api/products/${match.params.pid}`);

    //         setProduct(res.data);
    //     }

    //     fetchProduct();
    // }, [match]);

    // const product = products.find( (product) => {
    //     return product._id === match.params.pid;
    // })

    const addToCartHandler = () => {
        history.push(`/cart/${match.params.pid}?qty=${qty}`)
    }

    return <div>
        <Link className="btn btn-dark my-3" to="/" >Go Back</Link>
        { loading ? <Loader />: error ? <Error variant='danger'>{error}</Error> :
        <Row>
            <Col md={6}>
                <Image src={product.image} alt={product.name} fluid/>
            </Col>
            <Col md={3}>
                <ListGroup variant="flush">
                    <ListGroupItem>
                        <h3>{product.name}</h3>
                    </ListGroupItem>
                    <ListGroupItem>
                        <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                    </ListGroupItem>
                    <ListGroupItem>
                        Price: ${product.price}
                    </ListGroupItem>
                    <ListGroupItem>
                        {product.description}
                    </ListGroupItem>
                </ListGroup>
            </Col>

            <Col md={3}>
                <Card>
                    <ListGroup variant="flush">
                        <ListGroupItem>
                            <Row>
                                <Col>
                                    Price:
                                </Col>
                                <Col>
                                    <strong>
                                        ${product.price}
                                    </strong>
                                </Col>
                            </Row>
                        </ListGroupItem>

                        <ListGroupItem>
                            <Row>
                                <Col>
                                    Status:
                                </Col>
                                <Col>
                                {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                                </Col>
                            </Row>
                        </ListGroupItem>

                        {product.countInStock > 0 && (
                            <ListGroupItem>
                                <Row>
                                    <Col>Qty</Col>
                                    <Col>
                                        <Form.Control as='select' value={qty} onChange={ (e) => setQty(e.target.value)}
                                        >
                                            { [...Array(product.countInStock).keys()].map( (x) => {
                                                return <option key={x + 1} value={x + 1}> {x + 1} </option>
                                            }) }
                                        </Form.Control>
                                    </Col>
                                </Row>
                            </ListGroupItem>
                        ) }

                        <ListGroupItem>
                            <Button 
                            className="btn-block" 
                            type="button" 
                            disabled={product.countInStock === 0}
                            onClick={addToCartHandler} 
                            > 

                            Add To Cart
                            </Button>
                        </ListGroupItem>
                    </ListGroup>
                </Card>
            </Col>
        </Row> }
    </div>
}

export default ProductScreen;