import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import Rating from "./Rating";


const Product = ({ product }) => {
    return (
        <Card className="mt-2 mb-3 rounded">
            <Link to={`/product/${product._id}`}>
                <Card.Img src={product.image} variant="top" style={{ overflow: "hidden", height: "260px", objectFit: "cover" }} />
            </Link>

            <Card.Body style={{ padding: "7px" }}>
                <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                    <Card.Title as='div' className="product-title"> <strong>{product.name}</strong> </Card.Title>
                </Link>

                <Card.Text as='div'> <Rating value={product.rating} text={`${product.numReviews} reviews`} /> </Card.Text>

                <Card.Text as='h3'> ₹{product.price} </Card.Text>
            </Card.Body>
        </Card>
    )
};

export default Product;