/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react';
import axios from 'axios';
import Layout from './components/Layout';
import { STORIES_STORE_NAME } from './db/db';
import './index.css';
import {
  homePageButton,
} from './styles/buttonStyles';
import Banner from './components/Banner';
import Features from './components/Features';
import Story from './components/Stories/Story';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      loggedIn: false,
      stories: [],
    }
  }

  async componentDidMount() {
    const token = localStorage.getItem('JWT');
    if (token == null) {
      this.setState({
        loggedIn: false,
      });
      return;
    }
    await axios.get('/api/users/find', {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }).then((res) => {
      const { data } = res;
      const {
        username,
      } = data;
      this.setState({
        username,
        loggedIn: true,
      });
    }).catch((err) => {
      console.error(err.response.data);
      this.setState({
        loggedIn: false,
      });
    });

    await this.getStories();
  }

  getStories = async () => {
    const token = localStorage.getItem('JWT');
    await axios.get(`/api/stories/all`, {
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
        });
      });
  }

  render() {
    const { home } = this.props;
    const { stories } = this.state;

    if (this.state.loggedIn) {
      return (
        <Layout title="Festival" home={home}>
          <div className="event-center-bounds">
            {stories && stories.map(story => <Story {...story} />)}
          </div>
        </Layout>
      )
    } else {
      return (
        <Layout title="Festival" home={home}>
          <Banner />
          <Features />
        </Layout>
      );
    }
  }
};

export default App;
