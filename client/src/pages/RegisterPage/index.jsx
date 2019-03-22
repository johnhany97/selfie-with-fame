/* eslint-disable camelcase */
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

import Layout from '../../components/Layout';
import {
  registerButton,
  loginButton,
  inputStyle,
} from '../../styles/buttonStyles';
import LinkButton from '../../components/LinkButton';
import SubmitButton from '../../components/SubmitButton';

class RegisterPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      username: '',
      password: '',
      messageFromServer: '',
      showError: false,
      registerError: false,
      loginError: false,
    };
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
      messageFromServer,
      showError,
      loginError,
      registerError,
    } = this.state;

    if (messageFromServer === '') {
      return (
        <Layout title="Register">
          <form onSubmit={this.registerUser}>
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
              id="password"
              label="Password"
              value={password}
              onChange={this.handleChange('password')}
              placeholder="Password"
              type="password"
            />
            <SubmitButton
              buttonStyle={registerButton}
              buttonText="Register"
            />
          </form>
          {showError === true && registerError === true && (
            <div>
              <p>Username, password and email are required fields.</p>
            </div>
          )}
          {showError === true && loginError === true && (
            <div>
              <p>
                That username or email is already taken. Please choose another or login.
              </p>
              <LinkButton
                buttonText="Login"
                buttonStyle={loginButton}
                link="/login"
              />
            </div>
          )}
        </Layout>
      );
    }
    if (messageFromServer === 'user created') {
      return (
        <Layout title="Register">
          <h3>Successfully registered</h3>
          <LinkButton
            buttonText="Login"
            buttonStyle={loginButton}
            link="/login"
          />
        </Layout>
      );
    }
  }
}

export default RegisterPage;
