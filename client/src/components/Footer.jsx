import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="">
            <Container>
                <Row>
                    <Col className="text-center py-3">
                        <p> CommKart &copy; {year}. All rights reserved.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;