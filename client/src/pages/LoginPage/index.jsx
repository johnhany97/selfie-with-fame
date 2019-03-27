import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';

import Layout from '../../components/Layout';
import SubmitButton from '../../components/SubmitButton';
import LinkButton from '../../components/LinkButton';
import {
  loginButton,
  registerButton,
  inputStyle,
  forgotButton,
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
        <Layout title="Login">
          <form onSubmit={this.loginUser}>
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
            <SubmitButton
              buttonText="Login"
              buttonStyle={loginButton}
            />
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
              <LinkButton
                buttonText="Register"
                link="/register"
                buttonStyle={registerButton}
              />
            </div>
          )}
          <LinkButton
            buttonStyle={forgotButton}
            buttonText="Forgot Password?"
            link="/forgotPassword"
          />
        </Layout>
      );
    }
    return <Redirect to={`/userProfile/${username}`} />;
  }
}

export default LoginPage;
