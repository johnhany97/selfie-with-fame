import React from 'react';
import { Nav } from 'react-bootstrap';
import './index.css';

/**
 * @Params
 * none
 * 
 * @summary
 * Displays nav menu for when user is not logged in
 * 
 * @returns
 * Returns JSX for nav menu when no user is currently logged in
 */
const LoggedOutNav = () => (
  <Nav>
    <Nav.Link href="/">Home</Nav.Link>
    <Nav.Link href="#about">About</Nav.Link>
    <Nav.Link href="#contact">Contact</Nav.Link>
    <hr className="menu-break" />
    <Nav.Link href="/login">Log In</Nav.Link>
    <Nav.Link href="/register" className="sign-up-txt">Sign Up</Nav.Link>
    <a href="/register" className="sign-up-btn">Sign Up</a>
  </Nav>
);

export default LoggedOutNav;
