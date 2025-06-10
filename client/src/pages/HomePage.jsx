import { Row, Col } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';

import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';

import { useGetAllProductsQuery } from '../redux/slices/api/productsApiSlice';


const HomePage = () => {
    const { pageNumber, keyword } = useParams();

    const { data: allProductsData, isLoading: allProductsLoading, error: allProductsErr } = useGetAllProductsQuery({ pageNumber, keyword });

    return (
        <>
            <Meta />

            {!keyword ? <ProductCarousel /> : <Link to='/' className='btn btn-light mb-4'>Go Back</Link>}

            {allProductsLoading ? <Loader /> : (allProductsErr ? (<Message variant='danger'> {allProductsErr?.data?.message || allProductsErr.error} </Message>) : (
                <>
                    <h1>Latest Products</h1>

                    <Row>
                        {allProductsData.products.map((product) => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row >

                    <Paginate pages={allProductsData.pages} page={allProductsData.page} keyword={keyword ? keyword : ''} />
                </>
            ))}
        </>
    );
};

export default HomePage;