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
import './index.css';
import avatar from './placeholder-avatar.jpg';

class ProfilePage extends Component {
  constructor() {
    super();

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      username: '',
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
      error,
      isLoading,
      deleted,
    } = this.state;

    if (error) {
      return (
        <Layout title="Profile Page">
          <div className="container-lg">
            <div className="error-fetching-user-panel">
              <h6>
                Problem fetching user data. Please try to login again.
              </h6>
              <a href="/login" className="delete-btn">Login</a>
            </div>
          </div>
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
        <div className="container">
          <h3 className="profile-title">PROFILE</h3>
          <div className="profile-card">
            <img src={avatar} className="profile-img" alt="Profile pic" />
            <div className="profile-user-info">
              <h4>{username}</h4>
              <h5>BIO</h5>
              <p>
                Morbi ornare risus interdum nibh vestibulum placerat.
                Curabitur auctor sem eget volutpat bibendum.
                Fusce convallis ipsum sit amet tellus bibendum varius.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <a href={`/updateUser/${username}`} className="update-btn">Update</a>
              <button type="button" onClick={this.deleteUser} className="delete-btn">Delete</button>
            </div>
          </div>
          <h3 className="profile-title">STORIES</h3>
        </div>
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
