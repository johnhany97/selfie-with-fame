import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';

import Layout from '../../components/Layout';
import './index.css';

import {
  inputStyle,
} from '../../styles/buttonStyles';

class LoginPage extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      loggedIn: false,
      showError: false,
      showNullError: false,
    };
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  }

  loginUser = (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    // error checking
    if (username === '' || password === '') {
      this.setState({
        showError: false,
        showNullError: true,
        loggedIn: false,
      });
      return;
    }
    // perform login request
    axios.post('/api/users/login', {
      username,
      password,
    }).then((res) => {
      localStorage.setItem('JWT', res.data.token);
      this.setState({
        loggedIn: true,
        showError: false,
        showNullError: false,
      });
    }).catch((err) => {
      if (err.response.data === 'bad username' || err.response.data === 'passwords do not match') {
        this.setState({
          showError: true,
          showNullError: false,
        });
      }
    });
  }

  render() {
    const {
      username,
      password,
      showError,
      loggedIn,
      showNullError,
    } = this.state;

    if (!loggedIn) {
      return (
        <Layout>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6" className="login-panel-form">
                <h3 className="login-panel-title">Log In</h3>
                <form onSubmit={this.loginUser} className="login-form">
                  <TextField
                    id="username"
                    label="Username"
                    value={username}
                    style={inputStyle}
                    onChange={this.handleChange('username')}
                    placeholder="Username"
                  />
                  <TextField
                    id="password"
                    label="Password"
                    value={password}
                    style={inputStyle}
                    onChange={this.handleChange('password')}
                    placeholder="Password"
                    type="password"
                  />
                  <a href="/forgotPassword" className="forgot-pass-txt">Forgot your password?</a>
                  <button className="login-btn" type="submit">Log In</button>
                </form>
                {showNullError && (
                  <div>
                    <p>The username or password cannot be empty.</p>
                  </div>
                )}
                {showError && (
                  <div>
                    <p>
                      That username or password isn&apos;t recognized. Please try
                      again or register now.
                    </p>
                  </div>
                )}
                <p className="no-acc-text">Don't have an account?</p>
                <a href="/register">Register</a>
              </div>
              <div className="col-md-6" className="login-panel-img">
              </div>
            </div>
          </div>
        </Layout>
      )
    }
    return <Redirect to={`/userProfile/${username}`} />;
  }
}

export default LoginPage;
