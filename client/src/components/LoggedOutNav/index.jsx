import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import './index.css';

const LoggedOutNav = () => (
  <Nav>
    <hr className="menu-break"></hr>
    <Nav.Link href="/login">Log In</Nav.Link>
    <Nav.Link href="/register" className="sign-up-txt">Sign Up</Nav.Link>
    <a href="/register" className="square-btn" id="sign-up-btn">Sign Up</a>
  </Nav>
);

export default LoggedOutNav;