import { useParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from "react-toastify";

import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import Meta from "../components/Meta";

import { useGetAllProductsQuery, useCreateProductMutation, useDeleteProductMutation } from "../redux/slices/api/productsApiSlice";


const ProductListPage = () => {
    const { pageNumber } = useParams();

    const { data: getAllProductsData, isLoading: getAllProductsLoading, error: getAllProductsErr, refetch: getAllProductsRefetch } = useGetAllProductsQuery({ pageNumber });
    const [createProduct, { isLoading: createProductLoading, error: createProductErr }] = useCreateProductMutation();
    const [deleteProduct, { isLoading: deleteProductLoading, error: deleteProductErr }] = useDeleteProductMutation();

    const deleteProductHandler = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(productId);
                toast.success('Product deleted successfully');
                getAllProductsRefetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const createProductHandler = async () => {
        if (window.confirm('Are you sure you want to create a new product?')) {
            try {
                await createProduct();
                getAllProductsRefetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <>
            <Meta title="All Products (Admin) - CommKart" />

            <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "5px" }}>
                <Row className="align-items-center">
                    <Col> <h1 style={{ color: "#3c3d40" }}>Products</h1> </Col>

                    <Col className="text-end">
                        <Button className="btn-sm m-3 custom-btn" onClick={createProductHandler}> <FaEdit /> Create Product </Button>
                    </Col>
                </Row>

                {createProductLoading && <Loader />}
                {deleteProductLoading && <Loader />}

                {getAllProductsLoading ? <Loader /> : (getAllProductsErr ? (<Message variant='danger'> {getAllProductsErr?.data?.message || getAllProductsErr?.error} </Message>) : (
                    <>
                        <Table striped hover responsive className="table-sm">
                            <thead>
                                <tr>
                                    <th> ID </th>
                                    <th> NAME </th>
                                    <th> PRICE </th>
                                    <th> CATEGORY </th>
                                    <th> BRAND </th>
                                    <th> </th>
                                </tr>
                            </thead>

                            <tbody>
                                {getAllProductsData?.products.map((product) => (
                                    <tr key={product._id}>
                                        <td> {product._id} </td>
                                        <td> {product.name} </td>
                                        <td> ₹{product.price} </td>
                                        <td> {product.category} </td>
                                        <td> {product.brand} </td>

                                        <td>
                                            <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                                <Button variant='light' className="btn-sm mx-2"> <FaEdit /> </Button>
                                            </LinkContainer>

                                            <Button variant='light' className="btn-sm" onClick={() => deleteProductHandler(product._id)}> <FaTrash style={{ backgroundColor: 'transparent', color: '#FC4A1A' }} /> </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        <Paginate pages={getAllProductsData?.pages} page={getAllProductsData?.page} isAdmin={true} />
                    </>
                ))}
            </div>
        </>
    )
};

export default ProductListPage;