import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';

import LoggedOutNav from '../LoggedOutNav';
import LoggedInNav from '../LoggedInNav';
import './index.css';


/**
 * @Params
 * none
 *
 * @summary
 * Displays header / navbar at the top of the page with links to main pages
 *
 * @returns
 * Returns JSX for header component
 */
class Header extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      loggedIn: false,
    };
  }

  async componentDidMount() {
    const token = localStorage.getItem('JWT');
    const username = localStorage.getItem('username');
    if (!token || !username) {
      this.setState({
        loggedIn: false,
        username: '',
      });
      return;
    }
    this.setState({
      loggedIn: true,
      username,
    });
  }

  render() {
    const { loggedIn, username } = this.state;
    let rightNav;

    if (!loggedIn) {
      rightNav = <LoggedOutNav />;
    } else {
      rightNav = <LoggedInNav username={username} />;
    }

    return (
      <Navbar collapseOnSelect expand="lg" variant="light" className="shadow-sm">
        <div className="container-lg">
          <Navbar.Brand href="/">Festival</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" id="burger-icon" />
          <Navbar.Collapse id="responsive-navbar-nav">
            {rightNav}
          </Navbar.Collapse>
        </div>
      </Navbar>
    );
  }
}

export default Header;
