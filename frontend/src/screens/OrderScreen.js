import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, ListGroupItem } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Error from '../components/Error'
import Loader from '../components/Loader';
import { getOrderDetails, payOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET } from '../constants/orderConstants';

const OrderScreen = ( { match }) => {

    const orderId = match.params.id;

    const [sdkReady, setSdkReady] = useState(false);

    const dispatch = useDispatch();

    const orderDetails = useSelector( state => state.orderDetails)
    const { order, loading, error } = orderDetails;

    const orderPay = useSelector( state => state.orderPay)
    const { loading:loadingPay, success:successPay } = orderPay;

    if(!loading) {
        order.itemsPrice = order.orderItems.reduce( (acc, item) => acc + item.price * item.qty, 0)
    }

    useEffect(() => {

        const addPayPalScript = async () => {
            
            const { data: clientId } = await axios.get('/api/config/paypal');
            const script = document.createElement('script');
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true
            script.onload = () => {
                setSdkReady(true)
            }

            document.body.appendChild(script)
        }

        if(!order || successPay){
            dispatch({ type: ORDER_PAY_RESET })
            dispatch(getOrderDetails(orderId))
        } else if(!order.isPaid) {
            if(!window.paypal){
                addPayPalScript()
            } else {
                setSdkReady(true)
            }
        }

    }, [dispatch, orderId, successPay, order])


    const successPaymentHandler = (paymentResult) => {

        dispatch(payOrder(orderId, paymentResult))
    }

    return (
        loading ? <Loader /> : error ? <Error variant='danger'>{error}</Error> : 
        <>
        <h1>Order {order._id}</h1>
             <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <strong>Name: </strong> {order.user.name} <br />
                            <strong>Email: </strong> <a href={`mailto: ${order.user.email}`}>{order.user.email}</a>
                            <p>
                                <strong>Address:</strong>
                                {order.shippingAddress.address},
                                {order.shippingAddress.city}, 
                                {order.shippingAddress.postalCode},
                                {order.shippingAddress.country}
                            </p>

                            <p>
                            {order.isDelivered ? <Error variant='success'>Delivered on {order.deliveredAt}</Error> : <Error variant='danger'>Not Delivered</Error>}
                            </p>

                        </ListGroup.Item>
                        <ListGroupItem>
                            <h2>Payment Method</h2>
                            <strong>Method: </strong>
                            {order.paymentMethod}
                            <p>
                            {order.isPaid ? <Error variant='success'>Paid on {order.paidAt}</Error> : <Error variant='danger'>Not Paid</Error>}
                            </p>
                        </ListGroupItem>
                        <ListGroupItem>
                            <h2>Order Items</h2>
                            {order.orderItems.length === 0 ? <Error>Your Order is Empty</Error> : (
                                <ListGroup variant='flush'>
                                    {order.orderItems.map((item, index) => (
                                        <ListGroupItem key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col>
                                                    <Link to={`/products/${item.product}`}>
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x ${item.price} = ${item.qty * item.price}
                                                </Col>
                                            </Row>
                                        </ListGroupItem>
                                    ))}
                                </ListGroup>
                            )
                            }
                        </ListGroupItem>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroupItem>
                                <h2>Order Summary</h2>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>${order.itemsPrice}</Col>
                                </Row>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroupItem>
                            { !order.isPaid && (
                                <ListGroupItem>
                                    {loadingPay && <Loader />}
                                    {!sdkReady ? <Loader /> : (
                                        <PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler} />
                                    )}
                                </ListGroupItem>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default OrderScreen
