import React from 'react';
import axios from 'axios';
import Story from './../../components/Stories/Story';
import './index.css';
import Layout from './../../components/Layout';


class UserProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            _id: '',
            username: '',
            bio: '',
            following: false,
            stories: [],
        }
    }

    followUser = () => {
        console.log("Hhfafsdf");
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
            } = data;
            this.setState({
                ...res.data,
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
        axios.get('/api/stories/', 
            { headers: { Authorization: `JWT ${token}` } })
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
        if (this.state.following) {
            followStateBtn = <button onClick={this.followUser} className="follow-btn">Follow</button>;
        } else {
            followStateBtn = <button onClick={this.followUser} className="follow-btn">Following</button>;
        }
        const { username, bio, stories } = this.state;
        return (
            <Layout title="Profile Page">
                <div className="container">
                    <div className="profile-container-user">
                        <img className="profile-img" alt="Profile pic" />
                        <div className="profile-user-info">
                            <h4>{username}</h4>
                            <h5>BIO</h5>
                            <p>
                                {bio}
                            </p>
                            {followStateBtn}
                        </div>
                    </div>
                    <h3 className="profile-title">STORIES</h3>
                    {stories && stories.map(story => <Story {...story} />)}
                </div>
            </Layout>
        )
    }
}
export default UserProfile;