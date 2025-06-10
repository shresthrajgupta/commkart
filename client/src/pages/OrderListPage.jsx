import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';

import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";

import { useGetAllOrdersQuery } from "../redux/slices/api/ordersApiSlice";


const OrderListPage = () => {
    const { data: allOrdersData, isLoading: allOrdersLoading, error: allOrdersErr } = useGetAllOrdersQuery();

    return (
        <>
            <Meta title='All Orders (Admin) - CommKart' />

            <h1>Orders</h1>

            {allOrdersLoading ? <Loader /> : (allOrdersErr ? (<Message variant='danger'> {allOrdersErr?.data?.message || allOrdersErr.error} </Message>) : (
                <Table striped hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>USER</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {allOrdersData.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user && order.user.name}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                <td>${order.totalPrice}</td>
                                <td> {order.isPaid ? new Date(order.paidAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : <FaTimes style={{ color: "red" }} />} </td>
                                <td> {order.isDelivered ? new Date(order.deliveredAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : <FaTimes style={{ color: "red" }} />} </td>

                                <td>
                                    <LinkContainer to={`/order/${order._id}`}>
                                        <Button variant="light" className="btn-sm">
                                            Details
                                        </Button>
                                    </LinkContainer>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ))}
        </>
    )
};

export default OrderListPage;