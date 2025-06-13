import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { toast } from 'react-toastify';

import CheckoutProgress from "../components/CheckoutProgress";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";

import { useCreateOrderMutation } from "../redux/slices/api/ordersApiSlice";
import { clearCartItems } from "../redux/slices/cartSlice";


const PlaceOrderPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);

    const [createOrder, { isLoading: createOrderLoading, error: createOrderErr }] = useCreateOrderMutation();

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate('/shipping');
        } else if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

    const placeOrderHandler = async () => {
        try {
            const res = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: Number(cart?.itemsPrice),
                shippingPrice: Number(cart.shippingPrice),
                taxPrice: Number(cart?.taxPrice),
                totalPrice: Number(cart?.totalPrice)
            }).unwrap();

            dispatch(clearCartItems());
            navigate(`/order/${res._id}`);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

    return (
        <>
            <Meta title="Place Order - CommKart" />

            <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "5px" }}>
                <CheckoutProgress step1 step2 step3 step4 />

                <Row>
                    <Col md={8}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Shipping</h2>
                                <p> <strong>Address:</strong> {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country} </p>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>Payment Method</h2>
                                <p> <strong>Method:</strong> {cart.paymentMethod} </p>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>Order Items</h2>
                                {cart.cartItems.length === 0 ? (
                                    <Message> Your cart is empty </Message>
                                ) : (
                                    <ListGroup variant="flush">
                                        {cart.cartItems.map((item, index) => (
                                            <ListGroup.Item key={index}>
                                                <Row>
                                                    <Col md={1}> <Image src={item.image} alt={item.name} fluid rounded /> </Col>
                                                    <Col> <Link to={`/product/${item._id}`} style={{ textDecoration: "none" }}>{item.name}</Link> </Col>
                                                    <Col md={4}> {item.quantity} x ₹{item.price} = ₹{item.quantity * item.price} </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>

                    <Col md={4}>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item> <h2>Order Summary</h2> </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col> Items </Col>
                                        <Col> ₹{cart?.itemsPrice} </Col>
                                    </Row>

                                    <Row>
                                        <Col> Shipping </Col>
                                        <Col> ₹{Number(cart?.shippingPrice).toFixed(2)} </Col>
                                    </Row>

                                    <Row>
                                        <Col> Tax </Col>
                                        <Col> ₹{cart?.taxPrice} </Col>
                                    </Row>

                                    <Row>
                                        <Col> Total </Col>
                                        <Col> ₹{Number(cart?.totalPrice).toFixed(2)} </Col>
                                    </Row>
                                </ListGroup.Item>

                                {
                                    createOrderErr &&
                                    <>
                                        <ListGroup.Item>
                                            <Message variant="danger"> {createOrderErr?.data?.message || createOrderErr?.error} </Message>
                                        </ListGroup.Item>
                                    </>
                                }

                                <ListGroup.Item>
                                    <Button type="button" className="btn-block" disabled={cart.cartItems.length === 0} onClick={placeOrderHandler} style={{ backgroundColor: "#F7B733", border: "none" }}> Place Order </Button>
                                    {createOrderLoading && <Loader />}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
};

export default PlaceOrderPage;