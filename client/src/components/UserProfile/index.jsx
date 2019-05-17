import React from 'react';
import axios from 'axios';
import Story from './../../components/Stories/Story';
import './index.css';
import Layout from './../../components/Layout';
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
        }
    }

    followUser = (e) => {
        this.setState({
            currentlyFollowing: true,
        });
        const token = localStorage.getItem('JWT');
        e.preventDefault();
        axios.post(`/api/users/${this.state.username}/follow`, {},
         { headers: { Authorization: `JWT ${token}`} })
          .then(() => {
            console.log("Follow successful");
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
            { headers: { Authorization: `JWT ${token}`} })
            .then(() => {
            console.log("Unfollow successful");
            }).catch((error) => {
            this.setState({
                currentlyFollowing: true,
            });
            });
    }

    async componentDidMount() {
        await this.getUserDetails();
        await this.fetchUserStory();
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
                username: username,
                bio: bio,
                currentlyFollowing: currentlyFollowing,
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
        console.log(this.state._id);
        axios.get('/api/stories/',
            { params: {_id: this.state._id}, headers: { Authorization: `JWT ${token}`}})
            .then((res) => {
                // TODO: Snackbar of success
                console.log("Fetched Story");
                console.log(this.state.username);
                this.setState({
                    stories: res.data.stories,
                });
                console.log(this.state.username);
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
        )
    }
}
export default UserProfile;