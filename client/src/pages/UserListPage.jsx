import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from 'react-bootstrap';
import { FaTimes, FaTrash, FaEdit, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';

import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";

import { useGetAllUsersQuery, useDeleteUserMutation } from "../redux/slices/api/usersApiSlice";


const UserListPage = () => {
    const { data: getAllUsersData, isLoading: getAllUsersLoading, error: getAllUsersErr, refetch: getAllUsersRefetch } = useGetAllUsersQuery();
    const [deleteUser, { isLoading: deleteUserLoading, error: deleteUserErr }] = useDeleteUserMutation();

    const deleteHandler = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId);
                toast.success('User deleted successfully');
                getAllUsersRefetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    }

    return (
        <>
            <Meta title="All Users (Admin) - CommKart" />

            <h1>Users</h1>

            {deleteUserLoading && <Loader />}

            {getAllUsersLoading ? <Loader /> : (getAllUsersErr ? (<Message variant='danger'> {getAllUsersErr?.data?.message || getAllUsersErr.error} </Message>) : (
                <Table striped hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>ADMIN</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {getAllUsersData.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td> <a href={`mailto:${user.email}`}></a> {user.email} </td>
                                <td> {user.isAdmin ? <FaCheck style={{ color: "green" }} /> : <FaTimes style={{ color: "red" }} />} </td>

                                <td>
                                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                        <Button variant="light" className="btn-sm">
                                            <FaEdit />
                                        </Button>
                                    </LinkContainer>

                                    <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(user._id)}>
                                        <FaTrash style={{ color: "white" }} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ))}
        </>
    )
};

export default UserListPage;