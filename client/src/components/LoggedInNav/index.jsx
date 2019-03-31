import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import './index.css';
import avatar from './placeholder-avatar.jpg';

class LoggedInNav extends Component {
  constructor(props){
    super(props);
  }
  logout = (event) => {
    event.preventDefault();
    localStorage.removeItem('JWT');
    window.location.reload();
  }

  render() {
    return (
      <Nav className="logged-in-nav">
        <img src={avatar} className="profile_img-header" />
        <NavDropdown title={this.props.username} id="basic-nav-dropdown" drop='down' alignRight>
          <NavDropdown.Item href={"/userProfile/" + this.props.username}>Profile</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#" onClick={this.logout}>Logout</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    )
  }
}

export default LoggedInNav;