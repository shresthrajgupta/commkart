import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";

import Loader from "./Loader";
import Message from "./Message";

import { useGetTopProductsQuery } from "../redux/slices/api/productsApiSlice";


const ProductCarousel = () => {
    const { data: getTopProductsData, isLoading: getTopProductsLoading, error: getTopProductsErr } = useGetTopProductsQuery();

    const carouselURLs = ["/carousel/macbook.webp", "/carousel/rtx.webp", "/carousel/xbox.webp"];

    return (
        <>
            {getTopProductsLoading ? <Loader /> : (getTopProductsErr ? <Message variant="danger">{getTopProductsErr}</Message> : (
                <Carousel pause="hover" className="bg-primary mb-3" style={{ zIndex: "50" }}>
                    {getTopProductsData.map((product, index) => (

                        <Carousel.Item key={product._id} style={{ background: 'linear-gradient(to right, #541e0f 0%, #FC4A1A 50%, #541e0f 100%)' }}>
                            <Link to={`/product/${product._id}`}>
                                <Image src={`/carousel/${product.image.split("/")[2]}`} alt={product.name} style={{
                                    height: '580px', // Set fixed height
                                    width: '100%',
                                    objectFit: 'cover', // This will center and crop the image
                                    objectPosition: 'center'
                                }} />

                                <Carousel.Caption className="carousel-caption">
                                    <h2 style={{ color: "#DFDCE3" }}> {product.name} </h2>
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