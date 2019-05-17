/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react';
import axios from 'axios';

import Layout from './components/Layout';
import Banner from './components/Banner';
import DiscoverEvent from './components/DiscoverEvent';
import Story from './components/Stories/Story';

import DB, { STORIES_STORE_NAME, EVENTS_STORE_NAME } from './db/db';
import IO, { EVENT_NEW_STORY } from './io/io';

import './index.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      loggedIn: false,
      events: [],
      stories: [],
      snackbarOpen: false,
      snackbarVariant: 'info',
      snackbarMessage: '',
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
      IO.setup(this.state.username);
      IO.attachToEvent(EVENT_NEW_STORY, () => {
        this.setState({
          snackbarOpen: true,
          snackbarMessage: 'Refresh the page to see the latest stories.',
          snackbarVariant: 'info',
        });
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

  snackbarHandleClose = () => {
    this.setState({
      snackbarOpen: false,
      snackbarMessage: '',
      snackbarVariant: 'info',
    });
  }

  render() {
    const { home } = this.props;
    const {
      events,
      stories,
      snackbarOpen,
      snackbarVariant,
      snackbarMessage,
    } = this.state;

    if (this.state.loggedIn) {
      return (
        <Layout
          title="Festival"
          home={home}
          snackbarOpen={snackbarOpen}
          snackbarHandleClose={this.snackbarHandleClose}
          snackbarVariant={snackbarVariant}
          snackbarMessage={snackbarMessage}
        >
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
