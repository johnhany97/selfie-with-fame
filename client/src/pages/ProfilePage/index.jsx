/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

import {
  deleteButton,
  updateButton,
  loginButton,
  logoutButton,
  linkStyle,
  forgotButton,
} from '../../styles/buttonStyles';
import LinkButton from '../../components/LinkButton';
import Layout from '../../components/Layout';

class ProfilePage extends Component {
  constructor() {
    super();

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      username: '',
      password: '',
      isLoading: true,
      deleted: false,
      error: false,
    };
  }

  async componentDidMount() {
    const token = localStorage.getItem('JWT');
    if (token == null) {
      this.setState({
        error: true,
        isLoading: false,
      });
      return;
    }
    await axios.get('/api/users/find', {
      params: {
        username: this.props.match.params.username,
      },
      headers: {
        Authorization: `JWT ${token}`,
      },
    }).then((res) => {
      const { data } = res;
      const {
        first_name,
        last_name,
        email,
        username,
      } = data;
      this.setState({
        first_name,
        last_name,
        email,
        username,
        isLoading: false,
        error: false,
      });
    }).catch((err) => {
      console.error(err.response.data);
      this.setState({
        error: true,
      });
    });
  }

  deleteUser = (event) => {
    const token = localStorage.getItem('JWT');
    if (token === null) {
      this.setState({
        isLoading: false,
        error: true,
      });
      return;
    }
    event.preventDefault();
    axios.delete('/api/users/delete', {
      params: {
        username: this.props.match.params.username,
      },
      headers: {
        Authorization: `JWT ${token}`,
      },
    }).then((res) => {
      console.log(res);
      localStorage.removeItem('JWT');
      this.setState({
        deleted: true,
      });
    }).catch((err) => {
      console.error(err.response.data);
      this.setState({
        error: true,
      });
    });
  }

  logout = (event) => {
    event.preventDefault();
    localStorage.removeItem('JWT');
  }

  render() {
    const {
      first_name,
      last_name,
      email,
      username,
      password,
      error,
      isLoading,
      deleted,
    } = this.state;

    if (error) {
      return (
        <Layout title="Profile Page">
          <div>
            Problem fetching user data. Please try to login again.
          </div>
          <LinkButton
            buttonText="Login"
            buttonStyle={loginButton}
            link="/login"
          />
        </Layout>
      );
    }
    if (isLoading) {
      return (
        <Layout title="Profile Page">
          <div>Loading...</div>
        </Layout>
      );
    }
    if (deleted) {
      return <Redirect to="/" />;
    }

    return (
      <Layout title="Profile page">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>{first_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Last Name</TableCell>
              <TableCell>{last_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>{email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>{username}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Password</TableCell>
              <TableCell style={{ WebkitTextSecurity: 'disc' }}>
                {password}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Button
          style={deleteButton}
          variant="contained"
          color="primary"
          onClick={this.deleteUser}
        >
          Delete User
        </Button>
        <LinkButton
          buttonStyle={updateButton}
          buttonText="Update User"
          link={`/updateUser/${username}`}
        />
        <LinkButton
          buttonStyle={forgotButton}
          buttonText="Update Password"
          link={`/updatePassword/${username}`}
        />
        <Button
          style={logoutButton}
          variant="contained"
          color="primary"
          onClick={this.logout}
        >
          <Link style={linkStyle} to="/">
            Logout
          </Link>
        </Button>
      </Layout>
    );
  }
}

ProfilePage.propTypes = {
  // eslint-disable-next-line react/require-default-props
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }),
  }),
};

export default ProfilePage;
