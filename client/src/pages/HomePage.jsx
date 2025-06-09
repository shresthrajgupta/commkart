import { Row, Col } from 'react-bootstrap';

import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';

import { useGetAllProductsQuery } from '../redux/slices/api/productsApiSlice';


const HomePage = () => {
    const { data: allProductsData, isLoading: allProductsLoading, error: allProductsErr } = useGetAllProductsQuery();

    return (
        <>
            {allProductsLoading ? <Loader /> : (allProductsErr ? (<Message variant='danger'> {allProductsErr?.data?.message || allProductsErr.error} </Message>) : (
                <>
                    <h1>Latest Products</h1>

                    <Row>
                        {allProductsData.map((product) => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row >
                </>
            ))}
        </>
    );
};

export default HomePage;