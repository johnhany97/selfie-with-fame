/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import React, { Component } from 'react';
import axios from 'axios';

import Layout from '../../../components/Layout';
import {
  loginButton,
} from '../../../styles/buttonStyles';
import {
  mTop,
  crudButton,
} from '../../../styles/formStyles';
import LinkButton from '../../../components/LinkButton';
import Event from '../../../components/Event';
import './index.css';

class DisplayEventsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      // showError: false,
      // isLoading: true,
      error: false,
      // event_deleted: false,
    };
  }

  async componentDidMount() {
    this.getEvents();
  }

  getEvents = (e) => {
   // e.preventDefault();
    const token = localStorage.getItem('JWT');
    if (token == null) {
      this.setState({
        error: true,
        // isLoading: false,
      });
      return;
    }
    axios.get('/api/events/getEvents', {
      params: {
      },
      headers: {
        Authorization: `JWT ${token}`,
      },
    }).then((res) => {
      const { data } = res;
      const {
        events,
        // showError,
        // isLoading,
        // error,
        // event_deleted,
      } = data;
      this.setState({
        events,
        // isLoading: false,
        error: false,
        // event_deleted,
      });
    }).catch((err) => {
      console.error(err.response.data);
      this.setState({
        error: true,
      });
    });
  }

  deleteEvent = (_id) => {
    const token = localStorage.getItem('JWT');
    if (token === null) {
      this.setState({
        // isLoading: false,
        error: true,
      });
      return;
    }
    axios.delete('/api/events/deleteEvent', {
      params: { _id },
      headers: { Authorization: `JWT ${token}` },
    }).then(() => {
      this.getEvents();
    }).catch(() => {
      this.setState({
        error: true,
      });
    });
  }

  // eslint-disable-next-line consistent-return
  render() {
    const {
      events,
      // showError,
      // isLoading,
      error,
      // event_deleted
    } = this.state;

    if (error) {
      return (
        <Layout title="Events">
          <div>
            Problem fetching events data. Please try to login again.
          </div>
          <LinkButton
            buttonText="Login"
            buttonStyle={loginButton}
            link="/login"
          />
        </Layout>
      );
    }

    return (
      <Layout title="Events">
        <div className="container" style={mTop}>
          <a href="/createEvent" style={crudButton} className="add-event-btn">Add Event</a>
          {events.map(event => (
            <Event
              key={event._id}
              {...event}
            />
          ))}
        </div>
      </Layout>
    );
  }
}

export default DisplayEventsPage;
