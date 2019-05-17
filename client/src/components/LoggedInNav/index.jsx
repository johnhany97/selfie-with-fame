/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import './index.css';
import avatar from './placeholder-avatar.jpg';

/**
 * @Params
 * username => currently logged in username
 *
 * 
 * @summary
 * Displays nav menu for when user if logged in 
 * with functionality to log user out
 * 
 * @returns
 * Returns JSX for nav menu when user is logged in
 */
class LoggedInNav extends Component {
  logout = (event) => {
    event.preventDefault();
    localStorage.removeItem('JWT');
    localStorage.removeItem('username');
    window.location.reload();
  }

  render() {
    return (
      <Nav className="logged-in-nav">
        <Nav.Link href="/">Home</Nav.Link>
        <Nav.Link href="/discover">Discover</Nav.Link>
        <Nav.Link href="#about">About</Nav.Link>
        <Nav.Link href="#contact">Contact</Nav.Link>
        <NavDropdown.Divider />
        <div className="profile-container">
          <img src={avatar} className="profile_img-header" alt="avatar" />
          <NavDropdown title={this.props.username} id="basic-nav-dropdown" drop="down" alignRight>
            <NavDropdown.Item href={`/userProfile/${this.props.username}`}>Profile</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#" onClick={this.logout}>Logout</NavDropdown.Item>
          </NavDropdown>
        </div>
      </Nav>
    );
  }
}

export default LoggedInNav;
