import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";

import { useForgotPasswordMutation, useVerifyOtpMutation } from "../redux/slices/api/usersApiSlice";
import { setCredentials } from "../redux/slices/authSlice";

import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { warningReload } from "../components/warningReload";
import Meta from "../components/Meta";


const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [isOtpPage, setIsOtpPage] = useState(false);
    const [otp, setOtp] = useState("");

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    warningReload(hasUnsavedChanges);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [forgotPassword, { isLoading: forgotPasswordLoading }] = useForgotPasswordMutation();
    const [verifyOtp, { isLoading: verifyOtpLoading }] = useVerifyOtpMutation();

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            if (password !== rePassword) {
                toast.error("Passwords do not match");
                return;
            }

            const res = await forgotPassword({ email, password }).unwrap();

            if (res?.message === "OTP sent successfully") {
                setIsOtpPage(true);
                setHasUnsavedChanges(true);
            }
        } catch (err) {
            toast.error(err?.data?.message || err.error);
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
            navigate("/");
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    };

    return (
        <>
            <Meta title='Reset Password - CommKart' />

            {forgotPasswordLoading ? <Loader /> :
                <>
                    {!isOtpPage ?
                        <>
                            <FormContainer>
                                <div style={{ backgroundColor: "white", borderRadius: "5px", padding: "20px", maxWidth: "400px", margin: "auto" }} className="shadow" >

                                    <h1 style={{ color: "#3c3d40" }}>Reset Password</h1>

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

                                        <Button type="submit" variant="primary" className="mt-2" disabled={forgotPasswordLoading} style={{ backgroundColor: "#F7B733", border: "none" }}>
                                            Get OTP
                                        </Button>
                                    </Form>
                                </div >
                            </FormContainer >
                        </>
                        :
                        <>
                            <FormContainer>
                                <div style={{ maxWidth: "400px", margin: "0 auto", backgroundColor: "white", padding: "20px", borderRadius: "5px" }}>
                                    <h1 style={{ color: "#3c3d40" }}>Enter OTP</h1> 

                                    <p>If the email matches with any of our registered users, you will receive an OTP on your email.</p>

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

export default ForgotPassword;