import { useState, useEffect } from 'react';
import { Table, Form, Row, Button, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';

import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';

import { useUpdateProfileMutation } from '../redux/slices/api/usersApiSlice';
import { setCredentials } from '../redux/slices/authSlice';
import { useGetMyOrdersQuery } from '../redux/slices/api/ordersApiSlice';


const ProfilePage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');

    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);

    const [updateProfile, { isLoading: updateProfileLoading }] = useUpdateProfileMutation();
    const { data: getMyOrdersData, isLoading: getMyOrdersLoading, error: getMyOrdersErr } = useGetMyOrdersQuery();

    useEffect(() => {
        setName(userInfo.name);
        setEmail(userInfo.email);
    }, [userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password !== rePassword) {
            toast.error('Passwords do not match');
        } else {
            try {
                const res = await updateProfile({ _id: userInfo._id, name, email, password }).unwrap();
                dispatch(setCredentials({ ...res }));
                toast.success('Profile updated successfully');
            } catch (error) {
                toast.error(error?.data?.message || error.error);
            }
        }
    };

    return (
        <>
            <Meta title='My Profile - CommKart' />

            <Row>
                <Col md={3}>
                    <h2>User Profile</h2>

                    <Form onSubmit={submitHandler}>
                        <Form.Group className='my-2' controlId='name'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type='name' placeholder='Enter name' value={name} onChange={(e) => setName(e.target.value)} ></Form.Control>
                        </Form.Group>

                        <Form.Group className='my-2' controlId='email'>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control disabled type='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)} ></Form.Control>
                        </Form.Group>

                        <Form.Group className='my-2' controlId='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)} ></Form.Control>
                        </Form.Group>

                        <Form.Group className='my-2' controlId='rePassword'>
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type='password' placeholder='Confirm password' value={rePassword} onChange={(e) => setRePassword(e.target.value)} ></Form.Control>
                        </Form.Group>

                        <Button type='submit' variant='primary' className='my-2'> Update </Button>

                        {updateProfileLoading && <Loader />}
                    </Form>
                </Col>

                <Col md={9}>
                    <h2> My Orders </h2>

                    {getMyOrdersLoading ? <Loader /> : getMyOrdersErr ? (<Message variant='danger'>{getMyOrdersErr?.data?.message || getMyOrdersErr.error}</Message>) : (
                        <>
                            <Table striped hover responsive className='table-sm'>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>DATE</th>
                                        <th>TOTAL</th>
                                        <th>PAID</th>
                                        <th>DELIVERED</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {getMyOrdersData.map((order) => (
                                        <tr key={order._id}>
                                            <td>{order._id}</td>
                                            <td>{order.createdAt.substring(0, 10)}</td>
                                            <td>{order.totalPrice}</td>
                                            <td>{order.isPaid ? order.paidAt.substring(0, 10) : <FaTimes style={{ color: 'red' }} />}</td>
                                            <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : <FaTimes style={{ color: 'red' }} />}</td>

                                            <td>
                                                <LinkContainer to={`/order/${order._id}`}>
                                                    <Button className='btn-sm' variant='light'> Details </Button>
                                                </LinkContainer>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    )}
                </Col>
            </Row>
        </>
    )
};

export default ProfilePage;