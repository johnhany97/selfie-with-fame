/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react';
import axios from 'axios';
import socketIOClient from "socket.io-client";

import Layout from './components/Layout';
import { STORIES_STORE_NAME } from './db/db';
import './index.css';
import Banner from './components/Banner';
import Features from './components/Features';
import DiscoverEvent from './components/DiscoverEvent';
import Story from './components/Stories/Story';

const socketIOEndpoint = 'https://localhost:3001';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      loggedIn: false,
      events: [],
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
    await this.getEvents();
    await this.getStories();
    // Socket IO
    const socket = socketIOClient(socketIOEndpoint, { reconnection: true, secure: true });
    socket.on('connect', () => {
      socket.emit('connected', this.state.username);
    });
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

  getEvents = async () => {
    const token = localStorage.getItem('JWT');
    await axios.get(`/api/events/getEvents`, {
      headers: {
        Authorization: `JWT ${token}`,
      },
    })
      .then((res) => {
        this.setState({
          events: res.data.events,
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
    const { events, stories } = this.state;

    if (this.state.loggedIn) {
      return (
        <Layout title="Festival" home={home}>
          <div className="event-center-bounds">
            <div className="feed-create-btns">
              <a href="/createStory" className="create-btn">Share Story</a>
              <a href="/createEvent" className="create-btn">Create Event</a>
            </div>
            <div className="discover-events-container scrolling-wrapper">
              {events && events.map(event => <DiscoverEvent key={event._id} {...event} />)}
            </div>
          </div>
          <div className="event-center-bounds">
            {stories && stories.map(story => <Story key={story._id} {...story} />)}
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
