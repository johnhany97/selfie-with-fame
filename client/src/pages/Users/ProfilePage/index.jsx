/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Redirect, withRouter } from 'react-router-dom';

import Layout from '../../../components/Layout';
import Story from '../../../components/Stories/Story';
import './index.css';
import avatar from './placeholder-avatar.jpg';

class ProfilePage extends Component {
  constructor() {
    super();

    this.state = {
      username: '',
      bio: '',
      isLoading: true,
      deleted: false,
      error: false,
      errorMessage: '',
      stories: [],
    };
  }

  componentWillMount() {
    const token = localStorage.getItem('JWT');
    if (!token) {
      // eslint-disable-next-line react/prop-types
      const { history } = this.props;
      history.replace('/login');
    }
  }

  async componentDidMount() {
    await this.getUserDetails();
    await this.getUserStories();
  }

  getUserDetails = async () => {
    const token = localStorage.getItem('JWT');
    await axios.get(`/api/users/${this.props.match.params.username}`, {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }).then((res) => {
      const { data } = res;
      const {
        // first_name,
        // last_name,
        // email,
        username,
        bio,
      } = data;
      this.setState({
        // first_name,
        // last_name,
        // email,
        bio,
        username,
        isLoading: false,
        error: false,
      });
    }).catch((err) => {
      this.setState({
        error: true,
      });
    });
  }

  getUserStories = async () => {
    const token = localStorage.getItem('JWT');
    axios.get('/api/stories', {
      headers: {
        Authorization: `JWT ${token}`,
      },
    })
      .then((res) => {
        this.setState({
          stories: res.data.stories,
        });
      })
      .catch(() => {
        this.setState({
          error: true,
          errorMessage: 'Error fetching user stories',
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
    axios.delete(`/api/users/delete/${this.props.match.params.username}`, {
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
      // first_name,
      // last_name,
      // email,
      username,
      error,
      isLoading,
      deleted,
      stories,
      bio,
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
                {bio}
              </p>
              <a href={`/updateUser/${username}`} className="update-btn">Update</a>
              <button type="button" onClick={this.deleteUser} className="delete-btn">Delete</button>
            </div>
          </div>
          <h3 className="profile-title">STORIES</h3>
          {stories && stories.map(story => <Story {...story} />)}
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

export default withRouter(ProfilePage);
