/* eslint-disable camelcase */
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

import Layout from '../../../components/Layout';
import './index.css';
import {
  inputStyle,
} from '../../../styles/buttonStyles';
import {
  errorMessage,
} from '../../../styles/formStyles';

class RegisterPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      username: '',
      password: '',
      bio: '',
      messageFromServer: '',
      showError: false,
      registerError: false,
      loginError: false,
    };
  }

  componentWillMount() {
    const token = localStorage.getItem('JWT');
    if (token) {
      const { history } = this.props;
      history.replace('/');
    }
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  registerUser = (event) => {
    event.preventDefault();
    const {
      first_name,
      last_name,
      username,
      password,
      email,
      bio,
    } = this.state;
    if (username === '' || password === '' || email === '' || first_name === '' || last_name === '') {
      this.setState({
        showError: true,
        loginError: false,
        registerError: true,
      });
      return;
    }
    axios.post('/api/users/register', {
      first_name,
      last_name,
      email,
      username,
      password,
      bio,
    }).then((res) => {
      this.setState({
        messageFromServer: res.data.message,
        showError: false,
        loginError: false,
        registerError: false,
      });
    }).catch((err) => {
      if (err.response.data === 'username or email already taken') {
        this.setState({
          showError: true,
          loginError: true,
          registerError: false,
        });
      }
    });
  }

  // eslint-disable-next-line consistent-return
  render() {
    const {
      first_name,
      last_name,
      email,
      username,
      password,
      bio,
      messageFromServer,
      showError,
      loginError,
      registerError,
    } = this.state;

    if (messageFromServer === '') {
      return (
        <Layout title="Register">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6 register-panel-form">
                <div className="register-form-container">
                  <h3 className="register-panel-title">Sign Up</h3>
                  <hr className="register-divider" />
                  <form onSubmit={this.registerUser} className="register-form">
                    <TextField
                      style={inputStyle}
                      id="first_name"
                      label="First Name"
                      value={first_name}
                      onChange={this.handleChange('first_name')}
                      placeholder="First Name"
                    />
                    <TextField
                      style={inputStyle}
                      id="last_name"
                      label="Last Name"
                      value={last_name}
                      onChange={this.handleChange('last_name')}
                      placeholder="Last Name"
                    />
                    <TextField
                      style={inputStyle}
                      id="email"
                      label="Email"
                      value={email}
                      onChange={this.handleChange('email')}
                      placeholder="Email"
                    />
                    <TextField
                      style={inputStyle}
                      id="username"
                      label="Username"
                      value={username}
                      onChange={this.handleChange('username')}
                      placeholder="Username"
                    />
                    <TextField
                      style={inputStyle}
                      id="bio"
                      label="bio"
                      value={bio}
                      onChange={this.handleChange('bio')}
                      placeholder="Biography"
                    />
                    <TextField
                      style={inputStyle}
                      id="password"
                      label="Password"
                      value={password}
                      onChange={this.handleChange('password')}
                      placeholder="Password"
                      type="password"
                    />
                    {showError === true && registerError === true && (
                      <p style={errorMessage}>*Username, password and email are required fields.</p>
                    )}
                    {showError === true && loginError === true && (
                      <div>
                        <p style={errorMessage}>
                          *That username or email is already taken. Please choose another or login.
                        </p>
                        <a href="/login">Login</a>
                      </div>
                    )}
                    <button className="register-btn" type="submit">Sign Up</button>
                    <p className="existing-acc-text">Already have an account? <a href="/login">Login</a></p>
                  </form>
                </div>
              </div>
              <div className="col-md-6 register-panel-img" />
            </div>
          </div>
        </Layout>
      );
    }
    if (messageFromServer === 'user created') {
      return (
        <Layout title="Register">
          <div className="container-lg">
            <div className="register-success">
              <h3 className="register-panel-title">Successfully registered</h3>
              <a href="/login">Login</a>
            </div>
          </div>
        </Layout>
      );
    }
  }
}

export default RegisterPage;
