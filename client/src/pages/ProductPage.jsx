import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Row, Col, Image, ListGroup, Card, Button, Form } from "react-bootstrap";

import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";

import { useGetProductDetailsQuery } from "../redux/slices/api/productsApiSlice";
import { addToCart } from "../redux/slices/cartSlice";


const ProductPage = () => {
    const { id: productId } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [quantity, setQuantity] = useState(1);

    const { data: getProductDetailsData, isLoading: getProductDetailsLoading, error: getProductDetailsErr } = useGetProductDetailsQuery(productId);

    const addToCartHandler = () => {
        dispatch(addToCart({ ...getProductDetailsData, quantity }));
        navigate('/cart');
    };

    return (
        <>
            <Link className="btn btn-light my-3" to="/"> Go Back </Link>

            {getProductDetailsLoading ? (<Loader />) : (getProductDetailsErr ? (<Message variant='danger'> {getProductDetailsErr?.data?.message || getProductDetailsErr.error} </Message>) : (
                <>
                    <Row>
                        <Col md={5}> <Image src={getProductDetailsData.image} alt={getProductDetailsData.name} fluid /> </Col>

                        <Col md={4}>
                            <ListGroup variant="flush">
                                <ListGroup.Item> <h3>{getProductDetailsData.name}</h3> </ListGroup.Item>
                                <ListGroup.Item> <Rating value={getProductDetailsData.rating} text={`${getProductDetailsData.numReviews} reviews`} /> </ListGroup.Item>
                                {/* <ListGroup.Item> Price: ${getProductDetailsData.price} </ListGroup.Item> */}
                                <ListGroup.Item> {getProductDetailsData.description} </ListGroup.Item>
                            </ListGroup>
                        </Col>

                        <Col md={3}>
                            <Card>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <Row>
                                            <Col> Price: </Col>
                                            <Col> <strong>${getProductDetailsData.price}</strong> </Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Status:</Col>
                                            <Col>{getProductDetailsData.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    {getProductDetailsData.countInStock > 0 && (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Qty</Col>

                                                <Col>
                                                    <Form.Control as="select" value={quantity} onChange={(e) => setQuantity(e.target.value)}>
                                                        {[...Array(getProductDetailsData.countInStock).keys()].map((x) => (
                                                            <option key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )}

                                    <ListGroup.Item>
                                        <Button className="btn-block" type="button" disabled={getProductDetailsData.countInStock === 0} onClick={addToCartHandler}>
                                            Add to Cart
                                        </Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                </>
            ))}
        </ >
    )
};

export default ProductPage;