import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

/*
const Header = () => (<h1>Selfie With Fame - Header</h1>);
*/

class Header extends React.Component{
    render(){
        return(
            <Navbar collapseOnSelect expand="lg" variant="light" className="shadow-sm p-3 mb-5 bg-white rounded">
                <div className="lg-container">
                    <Navbar.Brand href="#home">Festival</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" id="burger-icon"/>
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto nav-menu">
                        <Nav.Link href="#discover">Discover</Nav.Link>
                        <Nav.Link href="#events">Events</Nav.Link>
                        <Nav.Link href="#about">About</Nav.Link>
                        <Nav.Link href="#contact">Contact</Nav.Link>
                        </Nav>
                        <Nav>
                            <hr className="menu-break"></hr>
                            <Nav.Link href="#log-in">Log In</Nav.Link>
                            <Nav.Link href="#sign-up" className="sign-up-txt">Sign Up</Nav.Link>
                            <button href="#" className="square-btn" id="sign-up-btn">Sign Up</button>
                        </Nav>
                    </Navbar.Collapse>
                </div>
            </Navbar>
        )
    }
}

export default Header;
