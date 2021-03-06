import React, { useEffect} from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Form, Button, Card, ListGroupItem} from 'react-bootstrap';

import { addToCart, removeFromCart } from '../actions/cartActions';
import Error from '../components/Error';

const CartScreen = ( {match, location, history}) => {

    const productId = match.params.pid;

    const qty = location.search ? Number(location.search.split('=')[1]) : 1;

    const dispatch = useDispatch();

    const cart = useSelector( state => state.cart);
    const { cartItems } = cart;

    useEffect( () => {
        if(productId){
            dispatch(addToCart(productId, qty));
        }
    }, [dispatch, productId, qty]);

    const removeFromCartHandler = (id) => {
        dispatch( removeFromCart(id) );
    }

    const checkOutHandler = () => {
         history.push('/login?redirect=shipping')
    }

    return <div>
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0
                ? <Error>Your Cart Is Empty <Link to='/'>Go Back</Link></Error> 
                : <ListGroup variant='flush'>
                    { cartItems.map( (item) => {
                        return <ListGroupItem key={item.product}>
                            <Row>
                                <Col md={2}>
                                    <Image src={item.image} alt={item.name} fluid />
                                </Col>
                                <Col md={3}>
                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                </Col>
                                <Col md={2}>{item.price}</Col>
                                <Col md={2}>
                                    <Form.Control as='select' value={item.qty} 
                                    onChange={ (e) => dispatch(addToCart(item.product, Number(e.target.value)))}
                                            >
                                                { [...Array(item.countInStock).keys()].map( (x) => {
                                                    return <option key={x + 1} value={x + 1}> {x + 1} </option>
                                                }) }
                                    </Form.Control>
                                </Col>
                                <Col md={2}>
                                    <Button type='button' variant='light' onClick={ () => {
                                        removeFromCartHandler(item.product)
                                    }}>
                                        <i className='fas fa-trash'></i>
                                    </Button>
                                </Col>
                            </Row>
                        </ListGroupItem>
                    })}
                </ListGroup>}
            </Col>
            <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroupItem>
                                <h2>Subtotal ({cartItems.reduce( (acc, item) => acc + item.qty, 0)}) items</h2>
                                ${cartItems.reduce( (acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                            </ListGroupItem>
                            <ListGroupItem>
                                <Button type='button' classname='btn-block' disabled={cartItems.length === 0} onClick={checkOutHandler}>
                                    Proceed To Checkout
                                </Button>
                            </ListGroupItem>
                        </ListGroup>
                    </Card>
            </Col>
            
        </Row>
    </div>
}

export default CartScreen;