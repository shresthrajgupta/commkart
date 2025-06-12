import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import FormContainer from "../components/FormContainer";
import CheckoutProgress from "../components/CheckoutProgress";
import Meta from "../components/Meta";
import Loader from "../components/Loader";

import { saveShippingAddress } from "../redux/slices/cartSlice";
import { useGetAddressQuery, useAddAddressMutation } from "../redux/slices/api/usersApiSlice";


const ShippingPage = () => {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    const { data: getAddressData, isLoading: getAddressLoading, error: getAddressErr } = useGetAddressQuery();
    const [addAddress, { isLoading: addAddressLoading, error: addAddressErr }] = useAddAddressMutation();

    const [address, setAddress] = useState(shippingAddress?.address || "");
    const [city, setCity] = useState(shippingAddress?.city || "");
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || "");
    const [country, setCountry] = useState(shippingAddress?.country || "");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (address === "") {
            setAddress(getAddressData?.address || "");
        }

        if (city === "") {
            setCity(getAddressData?.city || "");
        }

        if (postalCode === "") {
            setPostalCode(getAddressData?.postalCode || "");
        }

        if (country === "") {
            setCountry(getAddressData?.country || "");
        }
    }, [getAddressData]);

    const submitHandler = async (e) => {
        e.preventDefault();

        const addressObject = { address, city, postalCode, country };

        try {
            await addAddress(addressObject).unwrap();
            dispatch(saveShippingAddress({ address, city, postalCode, country }));
            navigate('/payment');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <Meta title="Shipping - CommKart" />

            {(getAddressLoading || addAddressLoading) ? <Loader /> :

                <FormContainer>
                    <div style={{ backgroundColor: "white", maxWidth: "500px", margin: "auto", borderRadius: "5px" }}>
                        <CheckoutProgress step1 step2 />

                        <h1 style={{ color: "#3c3d40", paddingLeft: "20px", paddingBottom: 0, marginBottom: 0 }}>Shipping</h1>

                        <Form onSubmit={submitHandler} style={{ backgroundColor: "white", padding: "20px", paddingTop: "1px", marginTop: 0 }}>
                            <Form.Group controlId="address" className="my-2">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                    className="custom-input"
                                />
                            </Form.Group>

                            <Form.Group controlId="city" className="my-2">
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter city"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                    className="custom-input"
                                />
                            </Form.Group>

                            <Form.Group controlId="postalCode" className="my-2">
                                <Form.Label>Postal Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter postal code"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    required
                                    className="custom-input"
                                />
                            </Form.Group>

                            <Form.Group controlId="country" className="my-2">
                                <Form.Label>Country</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter country"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    required
                                    className="custom-input"
                                />
                            </Form.Group>

                            <Button type="submit" variant="primary" className="my-2" style={{ backgroundColor: "#F7B733", border: "none" }}>Continue</Button>

                        </Form>
                    </div>
                </FormContainer>
            }
        </>
    )
};

export default ShippingPage;