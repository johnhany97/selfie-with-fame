import React from 'react';
import PropTypes from 'prop-types';
import { Navbar, Nav } from 'react-bootstrap';
import './index.css';

const Header = (props) => {
  const { title } = props;
  return (
    <Navbar collapseOnSelect expand="lg" variant="light" className="shadow-sm bg-white rounded">
      <div className="container-lg">
        <Navbar.Brand href="/">Festival</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" id="burger-icon" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto nav-menu">
            <Nav.Link href="#discover">Discover</Nav.Link>
            <Nav.Link href="/events">Events</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>
          </Nav>
          <Nav>
            <hr className="menu-break"></hr>
            <Nav.Link href="/login">Log In</Nav.Link>
            <Nav.Link href="/register" className="sign-up-txt">Sign Up</Nav.Link>
            <a href="/register" className="square-btn" id="sign-up-btn">Sign Up</a>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  )
};

Header.propTypes = {
  title: PropTypes.string,
};

Header.defaultProps = {
  title: '',
};

export default Header;
