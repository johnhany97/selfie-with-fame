import React from 'react';
import { Nav } from 'react-bootstrap';
import './index.css';

const LoggedOutNav = () => (
  <Nav>
    <Nav.Link href="/">Home</Nav.Link>
    <Nav.Link href="/discover">Discover</Nav.Link>
    <Nav.Link href="#about">About</Nav.Link>
    <Nav.Link href="#contact">Contact</Nav.Link>
    <hr className="menu-break" />
    <Nav.Link href="/login">Log In</Nav.Link>
    <Nav.Link href="/register" className="sign-up-txt">Sign Up</Nav.Link>
    <a href="/register" className="sign-up-btn">Sign Up</a>
  </Nav>
);

export default LoggedOutNav;
