import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { useLogoutMutation } from '../redux/slices/api/usersApiSlice';
import { removeCredentials } from '../redux/slices/authSlice';
import { resetCart } from '../redux/slices/cartSlice';

import SearchBox from './SearchBox';

import logo from '../assets/logo.svg';


const Header = () => {
    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logout] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logout().unwrap();
            dispatch(removeCredentials());
            dispatch(resetCart());
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    return (
        <header style={{ height: "70.247px" }}>
            <Navbar style={{ backgroundColor: "#4ABDAC", padding: "9px", zIndex: "100" }} data-bs-theme="dark" expand='md' collapseOnSelect>
                <Container>
                    <LinkContainer to='/'>
                        <Navbar.Brand>
                            <img src={logo} width={40} alt="CommKart" />
                            &nbsp; <span style={{ fontSize: "25px", fontWeight: "500" }}>CommKart</span>
                        </Navbar.Brand>
                    </LinkContainer>

                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='ms-auto'>
                            <SearchBox />

                            <LinkContainer to='/cart' style={{ color: "white" }}>
                                <Nav.Link >
                                    <span>
                                        <FaShoppingCart />
                                        Cart
                                        {
                                            cartItems.length > 0 && (
                                                <Badge pill bg='danger' style={{ marginLeft: '5px' }}>
                                                    {cartItems.reduce((acc, item) => acc + Number(item.quantity), 0)}
                                                </Badge>
                                            )
                                        }
                                    </span>
                                </Nav.Link>
                            </LinkContainer>

                            {userInfo ? (
                                <NavDropdown title={<span style={{ color: "white" }}>Hi {userInfo.name.split(" ")[0]}!</span>} id='username'>
                                    <LinkContainer to='/profile' style={{ color: "white" }}>
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>

                                    <NavDropdown.Item as={Link} onClick={logoutHandler} style={{ color: "white" }}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <>
                                    <LinkContainer to='/login'>
                                        <Nav.Link> <FaUser /> Log In </Nav.Link>
                                    </LinkContainer>
                                </>
                            )}

                            {userInfo && userInfo.isAdmin && (
                                <NavDropdown title={<span style={{ color: "white" }}>Admin</span>} id='adminmenu'>
                                    <LinkContainer to='/admin/productlist' style={{ color: "white" }}>
                                        <NavDropdown.Item>Products</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/admin/orderlist' style={{ color: "white" }}>
                                        <NavDropdown.Item>Orders</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/admin/userlist' style={{ color: "white" }}>
                                        <NavDropdown.Item>Users</NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container >
            </Navbar >
        </header >
    );
};

export default Header;