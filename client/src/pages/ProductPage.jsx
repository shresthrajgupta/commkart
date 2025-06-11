import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Image, ListGroup, Card, Button, Form } from "react-bootstrap";
import { toast } from 'react-toastify';

import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";

import { useGetProductDetailsQuery, useCreateReviewMutation } from "../redux/slices/api/productsApiSlice";
import { addToCart } from "../redux/slices/cartSlice";


const ProductPage = () => {
    const { id: productId } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [quantity, setQuantity] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const { data: getProductDetailsData, isLoading: getProductDetailsLoading, refetch: getProductDetailsRefetch, error: getProductDetailsErr } = useGetProductDetailsQuery(productId);
    const [createReview, { isLoading: createReviewLoading }] = useCreateReviewMutation();

    const { userInfo } = useSelector(state => state.auth);

    const addToCartHandler = () => {
        dispatch(addToCart({ ...getProductDetailsData, quantity }));
        navigate('/cart');
    };

    const createReviewHandler = async (e) => {
        e.preventDefault();

        try {
            await createReview({ productId, rating, comment }).unwrap();
            toast.success('Review submitted successfully');
            getProductDetailsRefetch();
            setRating(0);
            setComment('');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

    return (
        <>
            <Meta title={(!getProductDetailsLoading && getProductDetailsData?.name === undefined) ? "Product Error - CommKart" : (getProductDetailsLoading ? "Welcome to CommKart" : `Buy ${getProductDetailsData?.name} - CommKart`)} />

            < Link className="btn my-2" to="/" style={{ backgroundColor: "#F7B733", border: "none", marginLeft: "-12px", color: "white" }}> Go Back </Link>

            {getProductDetailsLoading ? (<Loader />) : (getProductDetailsErr ? (<Message variant='danger'> {getProductDetailsErr?.data?.message || getProductDetailsErr.error} </Message>) : (
                <>
                    <Row style={{ backgroundColor: "white", paddingTop: "30px", paddingBottom: "30px" }}>
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
                                            <Col> <strong>₹{getProductDetailsData.price}</strong> </Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Status:</Col>
                                            <Col>{getProductDetailsData.countInStock > 0 ? <span style={{ color: "#4ABDAC", fontWeight: "bold" }}>In Stock</span> : <span style={{ color: "#FC4A1A", fontWeight: "bold" }}>Out of Stock</span>}</Col>
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
                                        <Button className="btn-block" type="button" disabled={getProductDetailsData.countInStock === 0} onClick={addToCartHandler} style={{ backgroundColor: "#F7B733", border: "none", color: "white" }}>
                                            Add to Cart
                                        </Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="review" style={{ backgroundColor: "white", paddingTop: "30px" }}>
                        <Col md={6}>
                            <h2 style={{ marginLeft: "20px" }}>Reviews</h2>

                            {getProductDetailsData.reviews.length === 0 && <Message style={{ marginLeft: "20px" }} variant="danger"> No Reviews </Message>}

                            <ListGroup variant="flush">
                                {getProductDetailsData.reviews.map((review) => (
                                    <ListGroup.Item key={review._id}>
                                        <strong>{review.name}</strong>
                                        <Rating value={review.rating} />
                                        <p>{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        <p>{review.comment}</p>
                                    </ListGroup.Item>
                                ))}

                                <ListGroup.Item>
                                    <h2>Write a customer review</h2>

                                    {createReviewLoading && <Loader />}

                                    {userInfo ? (
                                        <Form onSubmit={createReviewHandler}>
                                            <Form.Group controlId='rating' className="my-2">
                                                <Form.Label>Rating</Form.Label>

                                                <Form.Control as='select' value={rating} onChange={(e) => setRating(e.target.value)}>
                                                    <option value=''>Select...</option>
                                                    <option value='1'>1 - Poor</option>
                                                    <option value='2'>2 - Fair</option>
                                                    <option value='3'>3 - Good</option>
                                                    <option value='4'>4 - Very Good</option>
                                                    <option value='5'>5 - Excellent</option>
                                                </Form.Control>
                                            </Form.Group>

                                            <Form.Group controlId='comment' className="my-2">
                                                <Form.Label>Comment</Form.Label>
                                                <Form.Control as='textarea' row='3' value={comment} onChange={(e) => setComment(e.target.value)} />
                                            </Form.Group>

                                            <Button disabled={createReviewLoading} type='submit' variant='primary' style={{ backgroundColor: "#F7B733", border: "none", color: "white" }}>Submit</Button>
                                        </Form>
                                    ) : (<Message variant="danger"> Please <Link to="/login">Log in</Link> to write a review{' '} </Message>)}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </>
            ))}
        </ >
    )
};

export default ProductPage;