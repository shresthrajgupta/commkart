import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";

import { useRegisterMutation } from "../redux/slices/api/usersApiSlice";
import { setCredentials } from "../redux/slices/authSlice";

import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Meta from "../components/Meta";


const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { search } = useLocation();

    const [register, { isLoading: registerLoading }] = useRegisterMutation();

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
                dispatch(setCredentials({ ...res }));
                navigate(redirect);
            } catch (error) {
                toast.error(error?.data?.message || error.error);
            }
        }

    };

    return (
        <>
            <Meta title="Register - CommKart" />

            <FormContainer>
                <h1>Sign Up</h1>

                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="name" className="my-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
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
                        />
                    </Form.Group>

                    <Button type="submit" variant="primary" className="mt-2" disabled={registerLoading}>
                        Sign Up
                    </Button>

                    {registerLoading && <Loader />}
                </Form>

                <Row className="py-3">
                    <Col>
                        Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
                    </Col>
                </Row>

            </FormContainer>
        </>
    )
};

export default RegisterPage;