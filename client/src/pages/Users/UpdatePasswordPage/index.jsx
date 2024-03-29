/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

import {
  loginButton,
  inputStyle,
} from '../../../styles/buttonStyles';
import LinkButton from '../../../components/LinkButton';
import Layout from '../../../components/Layout';
import './index.css';

class UpdatePasswordPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
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

    const accessString = localStorage.getItem('JWT');
    if (accessString === null) {
      this.setState({
        loadingUser: false,
        error: true,
      });
      return;
    }
    axios.get(`/api/users/${this.props.match.params.username}`, {
      headers: {
        Authorization: `JWT ${accessString}`,
      },
    }).then((res) => {
      const { data } = res;
      const {
        username,
        password,
      } = data;
      this.setState({
        loadingUser: false,
        username,
        password,
        error: false,
      });
    }).catch((err) => {
      console.error(err.response.data);
      this.setState({
        loadingUser: false,
        error: true,
      });
    });
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  updatePassword = (e) => {
    const accessString = localStorage.getItem('JWT');
    if (accessString === null) {
      this.setState({
        loadingUser: false,
        error: true,
      });
      return;
    }
    e.preventDefault();
    axios.put(
      `/api/users/${this.state.username}/password`,
      {
        password: this.state.password,
      },
      {
        headers: {
          Authorization: `JWT ${accessString}`,
        },
      },
    ).then((res) => {
      this.setState({
        updated: true,
        error: false,
        loadingUser: false,
      });
    }).catch((err) => {
      this.setState({
        updated: false,
        error: true,
        loadingUser: false,
      });
    });
  };

  // eslint-disable-next-line consistent-return
  render() {
    const {
      username,
      password,
      updated,
      error,
      loadingUser,
    } = this.state;

    if (error) {
      return (
        <Layout title="Update Password">
          <p>
            There was a problem accessing your data. Please go login again.
          </p>
          <LinkButton
            style={loginButton}
            buttonText="Go Login"
            link="/login"
          />
        </Layout>
      );
    }
    if (loadingUser !== false) {
      return (
        <Layout title="Update Password">
          <p>Loading user data...</p>
        </Layout>
      );
    }
    if (loadingUser === false && updated === true) {
      return <Redirect to={`/userProfile/${username}`} />;
    }
    if (loadingUser === false) {
      return (
        <Layout title="Update Password">
          <div className="container-lg">
            <form onSubmit={this.updatePassword} className="update-pass-form">
              <TextField
                style={inputStyle}
                id="password"
                label="password"
                value={password}
                onChange={this.handleChange('password')}
                type="password"
              />
              <button type="submit" className="update-pass-btn">Save Changes</button>
              <a href={`/userProfile/${username}`} className="cancel-update-pass-btn">Cancel</a>
            </form>
          </div>
        </Layout>
      );
    }
  }
}

UpdatePasswordPage.propTypes = {
  // eslint-disable-next-line react/require-default-props
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }),
  }),
};

export default UpdatePasswordPage;
