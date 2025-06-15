import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";

import { useLoginMutation } from "../redux/slices/api/usersApiSlice";
import { setCredentials } from "../redux/slices/authSlice";

import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Meta from "../components/Meta";


const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { search } = useLocation();

    const [login, { isLoading: loginLoading }] = useLoginMutation();

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

        try {
            const res = await login({ email, password }).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate(redirect);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <>
            <Meta title='Login - CommKart' />

            {loginLoading ? <Loader /> :
                <>
                    <FormContainer>
                        <div style={{ backgroundColor: "white", borderRadius: "5px", padding: "20px", maxWidth: "400px", margin: "auto" }} className="shadow" >

                            <h1 style={{ color: "#3c3d40" }}>Log In</h1>

                            <Form onSubmit={submitHandler}>
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

                                <Button type="submit" variant="primary" className="mt-0" disabled={loginLoading} style={{ backgroundColor: "#F7B733", border: "none" }}>
                                    Log In
                                </Button>
                            </Form>

                            <Row className="pt-3">
                                <Col><Link to="/forgotpassword" style={{ textDecoration: 'none' }}>Forgot Password?</Link></Col>
                            </Row>

                            <Row className="pb-1">
                                <Col><Link to={redirect ? `/register?redirect=${redirect}` : '/register'} style={{ textDecoration: 'none' }}>New User?</Link></Col>
                            </Row>
                        </div >
                    </FormContainer >
                </>
            }
        </>
    )
};

export default LoginPage;