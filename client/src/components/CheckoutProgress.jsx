import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaCircleCheck } from "react-icons/fa6";


const CheckoutProgress = ({ step1, step2, step3, step4 }) => {
    return (
        <Nav className="justify-content-center mb-2 py-2">
            <Nav.Item>
                {step1 ? (
                    <LinkContainer to="/login">
                        <Nav.Link>Log In <FaCircleCheck style={{ color: "#FC4A1A" }} /></Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled>Log In</Nav.Link>
                )}
            </Nav.Item>

            <Nav.Item>
                {step2 ? (
                    <LinkContainer to="/shipping">
                        <Nav.Link>Shipping <FaCircleCheck style={{ color: "#FC4A1A" }} /></Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled>Shipping</Nav.Link>
                )}
            </Nav.Item>

            <Nav.Item>
                {step3 ? (
                    <LinkContainer to="/payment">
                        <Nav.Link>Payment <FaCircleCheck style={{ color: "#FC4A1A" }} /></Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled>Payment</Nav.Link>
                )}
            </Nav.Item>

            <Nav.Item>
                {step4 ? (
                    <LinkContainer to="/placeorder">
                        <Nav.Link>Place Order <FaCircleCheck style={{ color: "#FC4A1A" }} /></Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled>Place Order</Nav.Link>
                )}
            </Nav.Item>
        </Nav>
    )
};

export default CheckoutProgress;