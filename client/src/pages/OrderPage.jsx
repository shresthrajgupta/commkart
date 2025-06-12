import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";

import { useGetOrderDetailsQuery, usePayOrderMutation, useGetPayPalClientIdQuery, useMarkDeliveredMutation } from "../redux/slices/api/ordersApiSlice";


const OrderPage = () => {
    const { id: orderId } = useParams();

    const { data: getOrderDetailsData, refetch: getOrderDetailsRefetch, isLoading: getOrderDetailsLoading, error: getOrderDetailsErr } = useGetOrderDetailsQuery(orderId);
    const [payOrder, { isLoading: payOrderLoading }] = usePayOrderMutation();
    const [markDelivered, { isLoading: markDeliveredLoading }] = useMarkDeliveredMutation();

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
    const { data: getPayPalClientIdData, isLoading: getPayPalClientIdLoading, error: getPayPalClientIdErr } = useGetPayPalClientIdQuery();

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!getPayPalClientIdErr && !getPayPalClientIdLoading && getPayPalClientIdData.clientId) {
            const loadPayPalScript = async () => {
                paypalDispatch({
                    type: "resetOptions",
                    value: {
                        "clientId": getPayPalClientIdData.clientId,
                        currency: "USD"
                    }
                });

                paypalDispatch({ type: "setLoadingStatus", value: "pending" });
            }

            if (getOrderDetailsData && !getOrderDetailsData.isPaid) {
                if (!window.paypal) {
                    loadPayPalScript();
                }
            }
        }
    }, [getOrderDetailsData, getPayPalClientIdData, paypalDispatch, getPayPalClientIdLoading, getPayPalClientIdErr]);

    function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
            try {
                await payOrder({ orderId, details }).unwrap();
                getOrderDetailsRefetch();
                toast.success("Order paid successfully");
            } catch (err) {
                toast.error(err?.data?.message || err?.message);
            }
        });
    };

    async function onApproveTest() {
        await payOrder({ orderId, details: { payer: {} } });
        getOrderDetailsRefetch();
        toast.success("Order paid successfully");
    };

    function onError(err) {
        toast.error(err?.message);
    };

    function createOrder(data, actions) {
        return actions.order.create({
            purchase_units: [{ amount: { value: getOrderDetailsData.totalPrice } }]
        }).then((orderId) => {
            return orderId;
        })
    };

    const markDeliveredHandler = () => {
        try {
            markDelivered(orderId);
            getOrderDetailsRefetch();
            toast.success("Order marked as delivered");
        } catch (err) {
            toast.error(err?.data?.message || err.message);
        }
    };

    return (
        <>
            <Meta title="Order Details - CommKart" />

            {getOrderDetailsLoading ? <Loader /> : (getOrderDetailsErr ? (<Message variant='danger' > {getOrderDetailsErr?.data?.message || getOrderDetailsErr?.error} </Message>) : (
                <>
                    <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "5px" }}>
                        <h1 style={{ color: "#3c3d40", paddingLeft: "18px" }}>Order {getOrderDetailsData._id}</h1>
                        <Row>
                            <Col md={8}>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <h2>Shipping</h2>
                                        <p>
                                            <strong>Name: </strong> {getOrderDetailsData.user.name} <br />
                                            <strong>Email: </strong> {getOrderDetailsData.user.email} <br />
                                            <strong>Address: </strong> {getOrderDetailsData.shippingAddress.address}, {getOrderDetailsData.shippingAddress.city}, {getOrderDetailsData.shippingAddress.postalCode}, {getOrderDetailsData.shippingAddress.country}
                                        </p>

                                        {getOrderDetailsData.isDelivered ? (
                                            <Message variant='success'> Delivered on {new Date(getOrderDetailsData.deliveredAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} </Message>
                                        ) : (
                                            <Message variant='danger'> Not Delivered </Message>
                                        )}
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <h2>Payment Method</h2>
                                        <p> <strong>Method: </strong> {getOrderDetailsData.paymentMethod} </p>

                                        {getOrderDetailsData.isPaid ? (
                                            <Message variant='success'> Paid on {new Date(getOrderDetailsData.paidAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} </Message>
                                        ) : (
                                            <Message variant='danger'> Not Paid </Message>
                                        )}
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <h2>Order Items</h2>
                                        {getOrderDetailsData.orderItems.length === 0 ? (
                                            <Message> Order is empty </Message>
                                        ) : (
                                            <ListGroup variant='flush'>
                                                {getOrderDetailsData.orderItems.map((item, index) => (
                                                    <ListGroup.Item key={index}>
                                                        <Row>
                                                            <Col md={1}> <Image src={item.image} alt={item.name} fluid rounded /> </Col>
                                                            <Col> <Link to={`/product/${item._id}`}>{item.name}</Link> </Col>
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
                                    <ListGroup variant='flush'>
                                        <ListGroup.Item> <h2>Order Summary</h2> </ListGroup.Item>

                                        <ListGroup.Item>
                                            <Row>
                                                <Col> Items </Col>
                                                <Col> ₹{getOrderDetailsData?.itemsPrice} </Col>
                                            </Row>

                                            <Row>
                                                <Col> Shipping </Col>
                                                <Col> ₹{getOrderDetailsData.shippingPrice} </Col>
                                            </Row>

                                            <Row>
                                                <Col> Tax </Col>
                                                <Col> ₹{getOrderDetailsData.taxPrice} </Col>
                                            </Row>

                                            <Row>
                                                <Col> Total </Col>
                                                <Col> ₹{getOrderDetailsData.totalPrice} </Col>
                                            </Row>
                                        </ListGroup.Item>

                                        {!getOrderDetailsData.isPaid && (
                                            <ListGroup.Item>
                                                {payOrderLoading && <Loader />}

                                                {isPending ? <Loader /> : (
                                                    <>
                                                        {/* <div> <Button onClick={onApproveTest} style={{ marginBottom: '10px' }}> Test Pay Order </Button> </div> */}
                                                        <div> <PayPalButtons disabled createOrder={createOrder} onApprove={onApprove} onError={onError} /> </div>
                                                    </>
                                                )}
                                            </ListGroup.Item>
                                        )}

                                        {markDeliveredLoading && <Loader />}
                                        {userInfo && userInfo.isAdmin && getOrderDetailsData.isPaid && !getOrderDetailsData.isDelivered && (
                                            <>
                                                <ListGroup.Item>
                                                    <Button type='button' className='btn btn-block' onClick={markDeliveredHandler}> Mark As Delivered </Button>
                                                </ListGroup.Item>
                                            </>
                                        )}
                                    </ListGroup>
                                </Card>
                            </Col>
                        </Row >
                    </div>
                </>
            ))}
        </>
    )
};

export default OrderPage;