import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

import {
  registerButton,
  forgotButton,
  inputStyle,
} from '../../styles/buttonStyles';
import LinkButton from '../../components/LinkButton';
import SubmitButton from '../../components/SubmitButton';
import Layout from '../../components/Layout';

class ForgotPasswordPage extends Component {
  constructor() {
    super();

    this.state = {
      email: '',
      showError: false,
      messageFromServer: '',
      showNullError: false,
    };
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  sendEmail = (e) => {
    e.preventDefault();
    const { email } = this.state;

    if (email === '') {
      this.setState({
        showError: false,
        messageFromServer: '',
        showNullError: true,
      });
      return;
    }
    axios
      .post('/api/users/forgotPassword', {
        email,
      })
      .then((res) => {
        if (res.data === 'recovery email sent') {
          this.setState({
            showError: false,
            messageFromServer: 'Recovery Email Sent',
            showNullError: false,
          });
        }
      })
      .catch((err) => {
        if (err.response.data === 'email not in db') {
          this.setState({
            showError: true,
            messageFromServer: '',
            showNullError: false,
          });
        }
      });
  };

  render() {
    const {
      email,
      messageFromServer,
      showNullError,
      showError,
    } = this.state;

    return (
      <Layout title="Forgot Password">
        <form onSubmit={this.sendEmail}>
          <TextField
            style={inputStyle}
            id="email"
            label="email"
            value={email}
            onChange={this.handleChange('email')}
            placeholder="Email Address"
          />
          <SubmitButton
            buttonStyle={forgotButton}
            buttonText="Send Password Reset Email"
          />
        </form>
        {showNullError && (
          <div>
            <p>The email address cannot be empty.</p>
          </div>
        )}
        {showError && (
          <div>
            <p>
              That email address isn&apos;t recognized. Please try again or
              register for a new account.
            </p>
            <LinkButton
              buttonText="Register"
              buttonStyle={registerButton}
              link="/register"
            />
          </div>
        )}
        {messageFromServer === 'recovery email sent' && (
          <div>
            <h3>Password Reset Email Successfully Sent!</h3>
          </div>
        )}
      </Layout>
    );
  }
}

export default ForgotPasswordPage;
