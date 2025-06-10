import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";

import Loader from "./Loader";
import Message from "./Message";

import { useGetTopProductsQuery } from "../redux/slices/api/productsApiSlice";


const ProductCarousel = () => {
    const { data: getTopProductsData, isLoading: getTopProductsLoading, error: getTopProductsErr } = useGetTopProductsQuery();

    return (
        <>
            {getTopProductsLoading ? <Loader /> : (getTopProductsErr ? <Message variant="danger">{getTopProductsErr}</Message> : (
                <Carousel pause="hover" className="bg-primary mb-4">
                    {getTopProductsData.map((product) => (

                        <Carousel.Item key={product._id}>
                            <Link to={`/product/${product._id}`}>
                                <Image src={product.image} alt={product.name} fluid />

                                <Carousel.Caption className="carousel-caption">
                                    <h2> {product.name} (${product.price}) </h2>
                                </Carousel.Caption>
                            </Link>
                        </Carousel.Item>
                    ))}
                </Carousel>
            ))}
        </>
    );
};

export default ProductCarousel;