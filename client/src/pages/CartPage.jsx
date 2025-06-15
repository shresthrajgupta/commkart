import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Card, Button, Image } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

import Message from '../components/Message';
import QuantitySelector2 from '../components/QuantitySelector2';
import Meta from '../components/Meta';

import { addToCart, removeFromCart } from "../redux/slices/cartSlice";


const CartPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { cartItems } = useSelector((state) => state.cart);

    const addToCartHandler = async (item, quantity) => {
        dispatch(addToCart({ ...item, quantity }));
    };

    const removeFromCartHandler = async (itemId) => {
        dispatch(removeFromCart(itemId));
    };

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping');
    }

    return (
        <>
            <Meta title='Cart - CommKart' />

            <Row style={{ backgroundColor: "white", padding: "20px", borderRadius: "5px" }}>
                <Col md={8}>
                    <h1 style={{ marginBottom: '20px', color: "#3c3d40", paddingLeft: "20px" }}> Shopping Cart </h1>
                    {cartItems.length === 0 ?
                        (<Message> Your cart is empty <Link to='/'> Go Back </Link> </Message>) :
                        (<ListGroup variant='flush'>
                            {cartItems.map((item) => (
                                <ListGroup.Item key={item._id}>
                                    <Row>
                                        <Col style={{ display: "flex", justifyContent: "center", alignItems: "center" }} className='py-2' md={2}><Image src={item.image} alt={item.name} fluid rounded /></Col>
                                        <Col style={{ display: "flex", justifyContent: "center", alignItems: "center" }} className='py-2' md={3}><Link to={`/product/${item._id}`} style={{ textDecoration: 'none' }}>{item.name}</Link></Col>
                                        <Col style={{ display: "flex", justifyContent: "center", alignItems: "center" }} className='py-2' md={2}>₹{item.price}</Col>

                                        <Col style={{ display: "flex", justifyContent: "center", alignItems: "center" }} className='py-2' md={3}>
                                            {/* <Form.Control as="select" value={item.quantity} onChange={(e) => { addToCartHandler(item, Number(e.target.value)) }}>
                                                {[...Array(item.countInStock).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))}
                                            </Form.Control> */}

                                            <QuantitySelector2 min={1} max={item?.countInStock} value={item?.quantity || 1} onChange={(value) => { (value >= 1 && value <= item?.countInStock) ? addToCartHandler(item, Number(value)) : 1 }} />
                                        </Col>

                                        <Col style={{ display: "flex", justifyContent: "center", alignItems: "center" }} className='py-2' md={2}><Button type='button' variant='light' onClick={() => { removeFromCartHandler(item._id) }}><FaTrash style={{ color: "#FC4A1A", backgroundColor: "transparent" }} /></Button></Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>)}
                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2 style={{ color: "#3c3d40" }}>Subtotal ({cartItems.reduce((acc, item) => acc + Number(item.quantity), 0)}) items</h2>
                                ₹{cartItems.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.price)), 0).toFixed(2)}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Button type='button' className='btn-block' disabled={cartItems.length === 0} onClick={() => { checkoutHandler() }} style={{ backgroundColor: "#F7B733", border: "none", borderRadius: "5px" }}>
                                    Proceed to Checkout
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row >
        </>
    )
};

export default CartPage;