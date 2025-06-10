import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import Meta from "../components/Meta";

import { useGetUserDetailsQuery, useUpdateUserDetailsMutation } from "../redux/slices/api/usersApiSlice";


const UserEditPage = () => {
    const { id: userId } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const { data: getUserDetailsData, isLoading: getUserDetailsLoading, refetch: getUserDetailsRefetch, error: getUserDetailsErr } = useGetUserDetailsQuery(userId);
    const [updateUserDetails, { isLoading: updateUserDetailsLoading, error: updateUserDetailsErr }] = useUpdateUserDetailsMutation();

    useEffect(() => {
        if (getUserDetailsData) {
            setName(getUserDetailsData.name);
            setEmail(getUserDetailsData.email);
            setIsAdmin(getUserDetailsData.isAdmin);
        }
    }, [getUserDetailsData]);

    const updateUserDetailsHandler = async (e) => {
        e.preventDefault();

        try {
            await updateUserDetails({ userId, name, email, isAdmin });
            toast.success("User updated successfully");
            getUserDetailsRefetch();
            navigate('/admin/userlist');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

    return (
        <>
            <Meta title="Edit User (Admin) - CommKart" />

            <Link className="btn btn-light my-3" to="/admin/userlist"> Go Back </Link>

            <FormContainer>
                <h1> Edit User </h1>

                {updateUserDetailsLoading && <Loader />}

                {getUserDetailsLoading ? <Loader /> : (updateUserDetailsErr ? (<Message variant='danger'> {updateUserDetailsErr?.data?.message || updateUserDetailsErr.error} </Message>) : (
                    <Form onSubmit={updateUserDetailsHandler}>
                        <Form.Group controlId="name" className="my-2">
                            <Form.Label> Name </Form.Label>
                            <Form.Control type="name" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="email" className="my-2">
                            <Form.Label> Email </Form.Label>
                            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="isAdmin" className="my-2">
                            <Form.Check type="checkbox" label="Is Admin" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)}></Form.Check>
                        </Form.Group>

                        <Button type="submit" variant="primary" className="my-2"> Update </Button>
                    </Form>
                ))}
            </FormContainer>
        </>
    )
};

export default UserEditPage;