/* eslint-disable react/button-has-type */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
import React from 'react';
import axios from 'axios';
import Story from '../Stories/Story';
import './index.css';
import Layout from '../Layout';
import placeholderAvatar from './placeholder-avatar.jpg';


class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      _id: '',
      username: '',
      bio: '',
      currentlyFollowing: false,
      stories: [],
    };
  }

  async componentDidMount() {
    await this.getUserDetails();
    await this.fetchUserStory();
  }

  followUser = (e) => {
    this.setState({
      currentlyFollowing: true,
    });
    const token = localStorage.getItem('JWT');
    e.preventDefault();
    axios.post(`/api/users/${this.state.username}/follow`, {},
      { headers: { Authorization: `JWT ${token}` } })
      .then(() => {
        console.log('Follow successful');
      }).catch((error) => {
        this.setState({
          currentlyFollowing: false,
        });
      });
  }

  unfollowUser = (e) => {
    this.setState({
      currentlyFollowing: false,
    });
    const token = localStorage.getItem('JWT');
    e.preventDefault();
    axios.post(`/api/users/${this.state.username}/unfollow`, {},
      { headers: { Authorization: `JWT ${token}` } })
      .then(() => {
        console.log('Unfollow successful');
      }).catch((error) => {
        this.setState({
          currentlyFollowing: true,
        });
      });
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
        _id,
        username,
        bio,
        currentlyFollowing,
      } = data;
      this.setState({
        _id,
        username,
        bio,
        currentlyFollowing,
      });
      console.log(this.state.username);
    }).catch((err) => {
      this.setState({
        error: true,
      });
    });
  };

  fetchUserStory = () => {
    const token = localStorage.getItem('JWT');
    axios.get(`/api/users/${this.state.username}/stories`,
      { headers: { Authorization: `JWT ${token}` } })
      .then((res) => {
        // TODO: Snackbar of success
        this.setState({
          stories: res.data,
        });
        // Redirect to other page?
      }).catch((error) => {
        console.log(error);
      });
  }

  render() {
    let followStateBtn;
    if (!this.state.currentlyFollowing) {
      followStateBtn = <button onClick={this.followUser} className="follow-btn">Follow</button>;
    } else {
      followStateBtn = <button onClick={this.unfollowUser} className="following-btn">Unfollow</button>;
    }
    const { username, bio, stories } = this.state;
    return (
      <Layout title="Profile Page">
        <div className="container">
          <div className="profile-container-user">
            <img src={placeholderAvatar} className="profile-img" alt="Profile pic" />
            <div>
              <h4>{username}</h4>
              <h5>BIO</h5>
              <p>
                {bio}
              </p>
              {followStateBtn}
            </div>
          </div>
          {stories && stories.map(story => <Story {...story} />)}
        </div>
      </Layout>
    );
  }
}
export default UserProfile;
