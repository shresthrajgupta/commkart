import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import Meta from "../components/Meta";

import { useGetProductDetailsQuery, useUpdateProductMutation, useUploadProductImageMutation } from "../redux/slices/api/productsApiSlice";


const ProductEditPage = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    const { data: getProductDetailsData, isLoading: getProductDetailsLoading, refetch: getProductDetailsRefetch, error: getProductDetailsErr } = useGetProductDetailsQuery(productId);
    const [updateProduct, { isLoading: updateProductLoading, error: updateProductErr }] = useUpdateProductMutation();
    const [uploadProductImage, { isLoading: uploadProductImageLoading, error: uploadProductImageErr }] = useUploadProductImageMutation();

    useEffect(() => {
        if (getProductDetailsData) {
            setName(getProductDetailsData.name);
            setPrice(getProductDetailsData.price);
            setImage(getProductDetailsData.image);
            setBrand(getProductDetailsData.brand);
            setCategory(getProductDetailsData.category);
            setCountInStock(getProductDetailsData.countInStock);
            setDescription(getProductDetailsData.description);
        }
    }, [getProductDetailsData]);

    const updateProductSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            await updateProduct({ productId, name, price, image, brand, category, countInStock, description });
            toast.success("Product updated successfully");
            navigate('/admin/productlist');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

    return (
        <>
            <Meta title="Edit Product (Admin) - CommKart" />

            <Link className="btn btn-light my-3" to="/admin/productlist"> Go Back </Link>

            <FormContainer>
                <h1> Edit Product </h1>

                {updateProductLoading && <Loader />}

                {getProductDetailsLoading ? <Loader /> : (getProductDetailsErr ? (<Message variant='danger'> {getProductDetailsErr?.data?.message || getProductDetailsErr.error} </Message>) : (
                    <Form onSubmit={updateProductSubmitHandler}>
                        <Form.Group controlId="name" className="my-2">
                            <Form.Label> Name </Form.Label>
                            <Form.Control type="name" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Group>

                        <Form.Group controlId="price" className="my-2">
                            <Form.Label> Price </Form.Label>
                            <Form.Control type="number" placeholder="Enter price" value={price} onChange={(e) => setPrice(e.target.value)} />
                        </Form.Group>

                        <Form.Group controlId="image" className="my-2">
                            <Form.Label> Image </Form.Label>
                            <Form.Control type="text" placeholder="Enter image url" value={image} onChange={(e) => setImage(e.target.value)} />

                            <Form.Control type="file" label="Choose File" onChange={uploadFileHandler} />
                        </Form.Group>

                        <Form.Group controlId="brand" className="my-2">
                            <Form.Label> Brand </Form.Label>
                            <Form.Control type="text" placeholder="Enter brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
                        </Form.Group>

                        <Form.Group controlId="countInStock" className="my-2">
                            <Form.Label> Count In Stock </Form.Label>
                            <Form.Control type="number" placeholder="Enter count" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
                        </Form.Group>

                        <Form.Group controlId="category" className="my-2">
                            <Form.Label> Category </Form.Label>
                            <Form.Control type="text" placeholder="Enter category" value={category} onChange={(e) => setCategory(e.target.value)} />
                        </Form.Group>

                        <Form.Group controlId="description" className="my-2">
                            <Form.Label> Description </Form.Label>
                            <Form.Control type="text" placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </Form.Group>

                        <Button type="submit" variant="primary" className="my-2"> Update </Button>
                    </Form>
                ))}
            </FormContainer>
        </>
    )
};

export default ProductEditPage;