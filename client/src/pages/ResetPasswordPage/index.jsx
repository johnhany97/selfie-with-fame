import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';

import {
  updateButton,
  loginButton,
  forgotButton,
  inputStyle,
} from '../../styles/buttonStyles';
import LinkButton from '../../components/LinkButton';
import SubmitButton from '../../components/SubmitButton';
import Layout from '../../components/Layout';
import './index.css';

class ResetPasswordPage extends Component {
  constructor() {
    super();

    this.state = {
      username: '',
      password: '',
      updated: false,
      isLoading: true,
      error: false,
    };
  }

  async componentDidMount() {
    const { match } = this.props;
    const { params } = match;
    const { token } = params;
    await axios.get('/api/users/reset', {
      params: {
        resetPasswordToken: token,
      },
    }).then((res) => {
      if (res.data.message === 'Password successfully reset') {
        this.setState({
          username: res.data.username,
          updated: false,
          isLoading: false,
          error: false,
        });
      }
    }).catch((err) => {
      console.log(err.response.data);
      this.setState({
        updated: false,
        isLoading: false,
        error: true,
      });
    });
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  updatePassword = (event) => {
    event.preventDefault();
    const {
      username,
      password,
    } = this.state;
    const { match } = this.props;
    const { params } = match;
    const { token } = params;
    axios.put('/api/users/updatePasswordViaEmail', {
      username,
      password,
      resetPasswordToken: token,
    }).then((res) => {
      if (res.data.message === 'password updated') {
        this.setState({
          updated: true,
          error: false,
        });
      } else {
        this.setState({
          updated: false,
          error: true,
        });
      }
    }).catch((err) => {
      console.log(err.response.data);
      this.setState({
        updated: false,
        error: true,
      });
    });
  };

  render() {
    const {
      password,
      error,
      isLoading,
      updated,
    } = this.state;

    if (error) {
      return (
        <Layout title="Reset Password">
          <div className="container-lg">
            <div>
              <h4>Problem resetting password. Please send another reset link.</h4>
              <LinkButton
                buttonStyle={forgotButton}
                buttonText="Forgot Password?"
                link="/forgotPassword"
              />
            </div>
          </div>
        </Layout>
      );
    }
    if (isLoading) {
      return (
        <Layout title="Reset Password">
          <div>Loading User Data...</div>
        </Layout>
      );
    }
    return (
      <Layout title="Reset Password">
        <div className="container-lg">
          <form onSubmit={this.updatePassword}>
            <TextField
              style={inputStyle}
              id="password"
              label="password"
              onChange={this.handleChange('password')}
              value={password}
              type="password"
            />
            <button className="update-pass-btn" type="submit">Update Password</button>
          </form>

          {updated && (
            <div>
              <p>
                Your password has been successfully reset, please try logging in again.
            </p>
              <LinkButton
                buttonStyle={loginButton}
                buttonText="Login"
                link="/login"
              />
            </div>
          )}
        </div>
      </Layout>
    );
  }
}

ResetPasswordPage.propTypes = {
  // eslint-disable-next-line react/require-default-props
  match: PropTypes.shape({
    params: PropTypes.shape({
      token: PropTypes.string.isRequired,
    }),
  }),
};

export default ResetPasswordPage;
