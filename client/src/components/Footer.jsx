import { Container, Row, Col } from 'react-bootstrap';


const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer style={{ backgroundColor: "#212121", color: "white", height: "70px" }}>
            <Container style={{ height: "70px" }}>
                <Row style={{ height: "70px" }}>
                    <Col className="text-center" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <p style={{ margin: 0 }}> CommKart &copy; {year}. All rights reserved.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;