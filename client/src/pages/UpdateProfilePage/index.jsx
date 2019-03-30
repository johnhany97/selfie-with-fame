/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

import {
  cancelButton,
  saveButton,
  loginButton,
  inputStyle,
} from '../../styles/buttonStyles';
import LinkButton from '../../components/LinkButton';
import SubmitButton from '../../components/SubmitButton';
import Layout from '../../components/Layout';
import './index.css';

class UpdateProfilePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      username: '',
      password: '',
      loadingUser: false,
      updated: false,
      error: false,
    };
  }

  componentDidMount() {
    this.setState({
      loadingUser: true,
    });

    const token = localStorage.getItem('JWT');
    if (token === null) {
      this.setState({
        loadingUser: false,
        error: true,
      });
    }
    axios.get('/api/users/find', {
      params: {
        username: this.props.match.params.username,
      },
      headers: { Authorization: `JWT ${token}` },
    }).then((response) => {
      // console.log(response.data);
      this.setState({
        loadingUser: false,
        first_name: response.data.first_name ? response.data.first_name : '',
        last_name: response.data.last_name ? response.data.last_name : '',
        email: response.data.email,
        username: response.data.username,
        password: response.data.password,
        error: false,
      });
    }).catch((error) => {
      console.log(error.response.data);
      this.setState({
        error: true,
      });
    });
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  updateUser = (e) => {
    const accessString = localStorage.getItem('JWT');
    if (accessString === null) {
      this.setState({
        loadingUser: false,
        error: true,
      });
    }

    e.preventDefault();
    axios.put('/api/users/updateUser', {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      username: this.state.username,
    }, {
        headers: {
          Authorization: `JWT ${accessString}`,
        },
      }).then((res) => {
        console.log(res.data);
        this.setState({
          updated: true,
          error: false,
        });
      }).catch((err) => {
        console.log(err.response.data);
        this.setState({
          loadingUser: false,
          error: true,
        });
      });
  };

  // eslint-disable-next-line consistent-return
  render() {
    const {
      first_name,
      last_name,
      email,
      username,
      password,
      updated,
      error,
      loadingUser,
    } = this.state;

    if (error) {
      return (
        <Layout title="Update Profile">
          <div className="container-lg">
            <p>
              There was a problem accessing your data. Please try to login again.
            </p>
            <LinkButton
              style={loginButton}
              buttonText="Login"
              link="/login"
            />
            <a href="/login" className="update-profile-btn">Login</a>
          </div>
        </Layout>
      );
    }
    if (loadingUser !== false) {
      return (
        <Layout title="Update Profile">
          <p>Loading user data...</p>
        </Layout>
      );
    }
    if (loadingUser === false && updated === true) {
      return <Redirect to={`/userProfile/${username}`} />;
    }
    if (loadingUser === false) {
      return (
        <Layout title="Update Profile">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6" className="update-panel-form">
                <div className="update-form-container">
                  <h3 className="update-panel-title">Update Profile</h3>
                  <hr className="update-divider" />
                  <form onSubmit={this.updateUser} className="update-user-form">
                    <TextField
                      style={inputStyle}
                      id="first_name"
                      label="first_name"
                      value={first_name}
                      onChange={this.handleChange('first_name')}
                      placeholder="First Name"
                    />
                    <TextField
                      style={inputStyle}
                      id="last_name"
                      label="last_name"
                      value={last_name}
                      onChange={this.handleChange('last_name')}
                      placeholder="Last Name"
                    />
                    <TextField
                      style={inputStyle}
                      id="email"
                      label="email"
                      value={email}
                      onChange={this.handleChange('email')}
                      placeholder="Email"
                    />
                    <TextField
                      style={inputStyle}
                      id="username"
                      label="username"
                      value={username}
                      readOnly
                      disabled
                    />
                    <TextField
                      style={inputStyle}
                      id="password"
                      label="password"
                      value={password}
                      readOnly
                      disabled
                      type="password"
                    />
                    <a href={"/updatePassword/" + username} className="forgot-pass-txt">Forgot your password?</a>
                    <button className="update-profile-btn" type="submit">Save Changes</button>
                  </form>
                  <a href={"/userProfile/" + username} className="cancel-changes-btn">Cancel</a>
                </div>
              </div>
              <div className="col-md-6" className="update-panel-img">
              </div>
            </div>
          </div>
        </Layout>
      );
    }
  }
}

UpdateProfilePage.propTypes = {
  // eslint-disable-next-line react/require-default-props
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }),
  }),
};

export default UpdateProfilePage;
