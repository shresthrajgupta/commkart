import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";

import { useRegisterMutation, useVerifyOtpMutation } from "../redux/slices/api/usersApiSlice";
import { setCredentials } from "../redux/slices/authSlice";

import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { warningReload } from "../components/warningReload";
import Meta from "../components/Meta";


const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [isOtpPage, setIsOtpPage] = useState(false);
    const [otp, setOtp] = useState("");

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    warningReload(hasUnsavedChanges);


    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { search } = useLocation();

    const [register, { isLoading: registerLoading }] = useRegisterMutation();
    const [verifyOtp, { isLoading: verifyOtpLoading }] = useVerifyOtpMutation();

    const { userInfo } = useSelector((state) => state.auth);

    const sp = new URLSearchParams(search);
    const redirect = sp.get("redirect") || "/";

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password !== rePassword) {
            toast.error("Passwords do not match");
            return;
        } else {
            try {
                const res = await register({ name, email, password }).unwrap();

                if (res?.message === "OTP sent successfully") {
                    setIsOtpPage(true);
                    setHasUnsavedChanges(true);
                }
            } catch (error) {
                toast.error(error?.data?.message || error.error);
            }
        }

    };

    const verifyOTPHandler = async (e) => {
        e.preventDefault();

        if (otp.length !== 6 || (parseInt(otp) < 100000 || parseInt(otp) > 999999)) {
            toast.error("Please enter a valid OTP");
            return;
        }

        try {
            const res = await verifyOtp(otp).unwrap();
            dispatch(setCredentials({ ...res }));
            setHasUnsavedChanges(false);
            navigate(redirect);
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    }

    return (
        <>
            <Meta title="Register - CommKart" />

            {registerLoading ? <Loader /> :
                <>
                    {!isOtpPage ?
                        <>
                            <FormContainer>
                                <div style={{ maxWidth: "400px", margin: "0 auto", backgroundColor: "white", padding: "20px", borderRadius: "5px" }}>
                                    <h1 style={{ color: "#3c3d40" }}>Sign Up</h1>

                                    <Form onSubmit={submitHandler}>
                                        <Form.Group controlId="name" className="my-3">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                                className="custom-input"
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="email" className="my-3">
                                            <Form.Label>Email Address</Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="Enter email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="custom-input"
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="password" className="my-3">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Enter password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="custom-input"
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="rePassword" className="my-3">
                                            <Form.Label>Confirm Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Confirm password"
                                                value={rePassword}
                                                onChange={(e) => setRePassword(e.target.value)}
                                                required
                                                className="custom-input"
                                            />
                                        </Form.Group>

                                        <Button type="submit" variant="primary" className="mt-2" disabled={registerLoading} style={{ backgroundColor: "#F7B733", border: "none" }}>
                                            Sign Up
                                        </Button>
                                    </Form>

                                    <Row className="py-3">
                                        <Col>
                                            Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
                                        </Col>
                                    </Row>
                                </div>
                            </FormContainer>
                        </>
                        :
                        <>
                            <FormContainer>
                                <div style={{ maxWidth: "400px", margin: "0 auto", backgroundColor: "white", padding: "20px", borderRadius: "5px" }}>
                                    <h1 style={{ color: "#3c3d40" }}>Enter OTP</h1>

                                    <Form onSubmit={verifyOTPHandler}>
                                        <Form.Group controlId="name" className="my-3">
                                            <Form.Label>OTP</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter OTP"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                required
                                                className="custom-input"
                                            />
                                        </Form.Group>

                                        <Button type="submit" variant="primary" className="mt-2" disabled={verifyOtpLoading} style={{ backgroundColor: "#F7B733", border: "none" }}>
                                            Verify OTP
                                        </Button>
                                    </Form>
                                </div>
                            </FormContainer>
                        </>
                    }
                </>
            }
        </>
    )
};

export default RegisterPage;