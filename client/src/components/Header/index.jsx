import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';
import axios from 'axios';

import LoggedOutNav from '../LoggedOutNav';
import LoggedInNav from '../LoggedInNav';
import './index.css';

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
    if (token == null) {
      this.setState({
        loggedIn: false,
      });
      return;
    }
    await axios.get('/api/users/me', {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }).then((res) => {
      const { data } = res;
      const {
        username,
      } = data;
      this.setState({
        username,
        loggedIn: true,
      });
    }).catch(() => {
      this.setState({
        loggedIn: false,
      });
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
