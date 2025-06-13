import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

import Message from "../components/Message";
import Loader from "../components/Loader";
import RazorpayButton from "../components/RazorpayButton";
import Meta from "../components/Meta";

import { useGetOrderDetailsQuery, usePayOrderPayPalMutation, useInitializeOrderRazorpayMutation, useGetPayPalClientIdQuery, useGetRazorpayApiKeyQuery, useMarkDeliveredMutation, useVerifyOrderRazorpayMutation } from "../redux/slices/api/ordersApiSlice";


const OrderPage = () => {
    const { id: orderId } = useParams();

    const { data: getOrderDetailsData, refetch: getOrderDetailsRefetch, isLoading: getOrderDetailsLoading, error: getOrderDetailsErr } = useGetOrderDetailsQuery(orderId);
    const [payOrderPayPal, { isLoading: payOrderPayPalLoading }] = usePayOrderPayPalMutation();
    const [markDelivered, { isLoading: markDeliveredLoading }] = useMarkDeliveredMutation();

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
    const { data: getPayPalClientIdData, isLoading: getPayPalClientIdLoading, error: getPayPalClientIdErr } = useGetPayPalClientIdQuery();

    const { data: getRazorpayApiKeyData, isLoading: getRazorpayApiKeyLoading, error: getRazorpayApiKeyErr } = useGetRazorpayApiKeyQuery();
    const [initializeOrderRazorpay, { isLoading: initializeOrderRazorpayLoading }] = useInitializeOrderRazorpayMutation();
    const [verifyOrderRazorpay, { isLoading: verifyOrderRazorpayLoading }] = useVerifyOrderRazorpayMutation();

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (getOrderDetailsData?.paymentMethod === "PayPal" && !getPayPalClientIdErr && !getPayPalClientIdLoading && getPayPalClientIdData.clientId) {
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

    async function onApproveTest() {
        await payOrderPayPal({ orderId, details: { payer: {} } });
        getOrderDetailsRefetch();
        toast.success("Order paid successfully");
    };

    //******************************

    function createOrderPayPal(data, actions) {
        return actions.order.create({
            purchase_units: [{ amount: { value: Number(getOrderDetailsData.totalPrice).toFixed(2) } }]
        }).then((orderId) => {
            return orderId;
        })
    };

    function onApprovePayPal(data, actions) {
        return actions.order.capture().then(async function (details) {
            try {
                await payOrderPayPal({ orderId, details }).unwrap();
                getOrderDetailsRefetch();
                toast.success("Order paid successfully");
            } catch (err) {
                toast.error(err?.data?.message || err?.message);
            }
        });
    };

    function onErrorPayPal(err) {
        toast.error(err?.message);
    };

    //******************************

    async function createOrderRazorpay() {
        if (!getOrderDetailsData?.isPaid) {
            try {
                const amount = getOrderDetailsData.totalPrice;
                const key = getRazorpayApiKeyData.razorpayApiKey;
                const orderIdDb = getOrderDetailsData?._id;
                const name = getOrderDetailsData?.user?.name
                const email = getOrderDetailsData?.user?.email

                const orderData = (await initializeOrderRazorpay({ orderIdDb, amount })).data;
                const orderIdRazorpay = orderData?.order?.id;


                const options = {
                    key,
                    amount: amount * 100,
                    currency: 'INR',
                    name: 'CommKart',
                    description: 'CommKart Order Transaction',
                    order_id: orderIdRazorpay,
                    handler: async function (orderResponse) {
                        const razorpayObject = {
                            razorpay_order_id: orderResponse?.razorpay_order_id,
                            razorpay_payment_id: orderResponse?.razorpay_payment_id,
                            razorpay_signature: orderResponse?.razorpay_signature
                        };

                        const verifyResponse = await verifyOrderRazorpay({ orderIdDb, razorpayObject }).unwrap();

                        if (verifyResponse.success) {
                            getOrderDetailsRefetch();
                            toast.success("Order paid successfully");
                        } else {
                            toast.error("Payment failed");
                        }
                    },
                    prefill: {
                        name,
                        email,
                        contact: '9999999999'
                    },
                    theme: {
                        color: '#FC4A1A'
                    },
                };

                const rzp = new Razorpay(options);
                rzp.open();
            } catch (err) {
                toast.error(err?.data?.message || err.message);
            }
        }
    };

    //******************************

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
                        <h1 style={{ color: "#3c3d40", paddingLeft: "18px", wordWrap: 'break-word' }}> Order&nbsp;{getOrderDetailsData._id}</h1>
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
                                                {payOrderPayPalLoading && <Loader />}

                                                {isPending ? <Loader /> : (
                                                    <>
                                                        {/* <div> <Button onClick={onApproveTest} style={{ marginBottom: '10px' }}> Test Pay Order </Button> </div> */}
                                                        {(getRazorpayApiKeyLoading || initializeOrderRazorpayLoading || getPayPalClientIdLoading || verifyOrderRazorpayLoading) && <Loader />}
                                                        {getOrderDetailsData?.paymentMethod === "PayPal" && <div> <PayPalButtons createOrder={createOrderPayPal} onApprove={onApprovePayPal} onError={onErrorPayPal} /> </div>}
                                                        {getOrderDetailsData?.paymentMethod === "Razorpay" && !getRazorpayApiKeyLoading && !initializeOrderRazorpayLoading && !verifyOrderRazorpayLoading && !getOrderDetailsData?.isPaid && <RazorpayButton onClick={() => createOrderRazorpay()} />}
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