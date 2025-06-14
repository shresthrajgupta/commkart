import { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Col } from "react-bootstrap";

import FormContainer from "../components/FormContainer";
import CheckoutProgress from "../components/CheckoutProgress";
import Meta from "../components/Meta";

import { savePaymentMethod } from "../redux/slices/cartSlice";


const PaymentMethodPage = () => {
    const [paymentMethod, setPaymentMethod] = useState("Razorpay");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    useEffect(() => {
        if (!shippingAddress) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    }

    return (
        <>
            <Meta title="Payment Method - CommKart" />

            <FormContainer>
                <div style={{ backgroundColor: "white", maxWidth: "500px", margin: "auto", borderRadius: "5px", padding: "20px" }}>

                    <CheckoutProgress step1 step2 step3 />

                    <h1 style={{ color: "#3c3d40" }}>Payment Method</h1>

                    <Form onSubmit={submitHandler}>
                        <Form.Group>
                            <Form.Label as="legend">Select Method</Form.Label>

                            <Col>
                                <Form.Check
                                    type="radio"
                                    className="my-2 custom-checkbox"
                                    label="PayPal (Use dollar)"
                                    id="PayPal"
                                    name="paymentMethod"
                                    value="PayPal"
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                            </Col>

                            <Col>
                                <Form.Check
                                    type="radio"
                                    className="my-2 custom-checkbox"
                                    label="Razorpay"
                                    id="Razorpay"
                                    name="paymentMethod"
                                    value="Razorpay"
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                            </Col>
                        </Form.Group>

                        <Button type="submit" variant="primary" style={{ backgroundColor: "#F7B733", border: "none", borderRadius: "20px" }}> Continue </Button>
                    </Form>
                </div>
            </FormContainer>
        </>
    )
};

export default PaymentMethodPage;