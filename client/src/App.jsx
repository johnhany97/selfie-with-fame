/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react';
import axios from 'axios';

import Layout from './components/Layout';
import Banner from './components/Banner';
import Features from './components/Features';
import DiscoverEvent from './components/DiscoverEvent';
import Story from './components/Stories/Story';

import DB, { STORIES_STORE_NAME, EVENTS_STORE_NAME } from './db/db';
import IO, { EVENT_CONNECT, EVENT_NEW_STORY, EMIT_EVENT_CONNECTED } from './io/io';

import './index.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      loggedIn: false,
      events: [],
      stories: [],
    };
  }

  async componentDidMount() {
    const token = localStorage.getItem('JWT');
    if (token == null) {
      this.setState({
        loggedIn: false,
      });
      return;
    }
    await axios.get('/api/users/me', {
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
      console.log(res.data);
      IO.setup(this.state.username);
      IO.attachToEvent(EVENT_NEW_STORY, () => {
        console.log('New stories, refresh man');
      });
    }).catch(() => {
      this.setState({
        loggedIn: false,
      });
    });
    await this.getEvents();
    await this.getStories();
  }

  getStories = async () => {
    const token = localStorage.getItem('JWT');
    await axios.get('/api/stories/timeline', {
      headers: {
        Authorization: `JWT ${token}`,
      },
    })
      .then((res) => {
        this.setState({
          stories: res.data.stories,
        });
        // Store locally in IndexedDB
        res.data.stories.forEach(story => DB.set(STORIES_STORE_NAME, story));
      })
      .catch(() => {
        this.setState({
          error: true,
        });
      });
  }

  getEvents = async () => {
    const token = localStorage.getItem('JWT');
    await axios.get('/api/events/getEvents', {
      headers: {
        Authorization: `JWT ${token}`,
      },
    })
      .then((res) => {
        this.setState({
          events: res.data.events,
        });
        // Store locally in IndexedDB
        res.data.events.forEach(event => DB.set(EVENTS_STORE_NAME, event));
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
      );
    }
    return (
      <Layout title="Festival" home={home}>
        <Banner />
      </Layout>
    );
  }
};

export default App;
