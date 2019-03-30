import React , {Component} from 'react';
import PropTypes from 'prop-types';
import { Navbar, Nav } from 'react-bootstrap';
import axios from 'axios';
import LoggedOutNav from '../LoggedOutNav';
import LoggedInNav from '../LoggedInNav';
import './index.css';

class Header extends Component {
  constructor(){
    super();
    this.state = {
      username: '',
      loggedIn: false,
    }
  }

  async componentDidMount() {
    const token = localStorage.getItem('JWT');
    if (token == null) {
      this.setState({
        loggedIn: false,
      });
      return;
    }
    await axios.get('/api/users/find', {
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
    }).catch((err) => {
      console.error(err.response.data);
      this.setState({
        loggedIn: false,
      });
    });
  }
  
  render() {
    const loggedIn = this.state.loggedIn;
    let rightNav;

    if (!loggedIn) {
      rightNav = <LoggedOutNav />;
    } else {
      rightNav = <LoggedInNav username={this.state.username} />;
    }
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
            <hr />
            {rightNav}
          </Navbar.Collapse>
        </div>
      </Navbar>
    )
  }
}

Header.propTypes = {
  title: PropTypes.string,
};

Header.defaultProps = {
  title: '',
};

export default Header;
