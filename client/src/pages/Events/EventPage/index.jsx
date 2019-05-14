/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

import {
  loginButton,
} from '../../../styles/buttonStyles';
import {
  crudButton,
  cardPanel,
  mTop,
} from '../../../styles/formStyles';
import LinkButton from '../../../components/LinkButton';
import Layout from '../../../components/Layout';
import Story from '../../../components/Stories/Story';
import './index.css';

class EventPage extends Component {
  constructor() {
    super();

    this.state = {
      event_name: '',
      information: '',
      date_time: '',
      location: '',
      isLoading: true,
      deleted: false,
      error: false,
      stories: [],
    };
  }

  componentWillMount() {
    const token = localStorage.getItem('JWT');
    if (token === null) {
      // eslint-disable-next-line react/prop-types
      const { history } = this.props;
      history.replaceState(null, '/login');
    }
  }

  async componentDidMount() {
    await this.getEvent();
    await this.getEventStories();
  }

  getEvent = async () => {
    const token = localStorage.getItem('JWT');
    await axios.get('/api/events/findEvent', {
      params: {
        _id: this.props.match.params._id,
      },
      headers: {
        Authorization: `JWT ${token}`,
      },
    }).then((res) => {
      const { data } = res;
      const {
        event_name,
        information,
        location,
        date_time,
      } = data;
      this.setState({
        event_name,
        information,
        location,
        date_time,
        isLoading: false,
        error: false,
      });
    }).catch(() => {
      this.setState({
        error: true,
      });
    });
  }

  getEventStories = async () => {
    const token = localStorage.getItem('JWT');
    await axios.get(`/api/stories/event/${this.props.match.params._id}`, {
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

  deleteEvent = (event) => {
    const token = localStorage.getItem('JWT');
    if (token === null) {
      this.setState({
        isLoading: false,
        error: true,
      });
      return;
    }
    event.preventDefault();
    axios.delete('/api/events/deleteEvent', {
      params: {
        _id: this.props.match.params._id,
      },
      headers: {
        Authorization: `JWT ${token}`,
      },
    }).then(() => {
      this.setState({
        deleted: true,
      });
    }).catch(() => {
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
      event_name,
      information,
      location,
      date_time,
      error,
      isLoading,
      deleted,
      stories,
    } = this.state;
    if (error) {
      return (
        <Layout title="Event Page">
          <div>
            Problem fetching event data. Please try to login again.
          </div>
          <LinkButton
            buttonText="Login"
            buttonStyle={loginButton}
            link="/login"
          />
        </Layout>
      );
    }
    if (isLoading) {
      return (
        <Layout title="Event Page">
          <div>Loading...</div>
        </Layout>
      );
    }
    if (deleted) {
      return <Redirect to="/events" />;
    }

    return (
      <Layout title="Event page">
        <div className="event-header-container">
          <div className="event-center-bounds event-header">
            <div className="event-cover-img">
            </div>
            <div className="event-header-info">
              <h3 className="event-header-name">{event_name}</h3>
              <p>{information}</p>
              <p>{location}</p>
              <p>{date_time}</p>
            </div>
          </div>
        </div>
        <div className="event-center-bounds">
          {stories && stories.map(story => <Story {...story} />)}
        </div>
      </Layout>
    );
  }
}

Event.propTypes = {
  // eslint-disable-next-line react/require-default-props
  match: PropTypes.shape({
    params: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
  }),
};

export default EventPage;
