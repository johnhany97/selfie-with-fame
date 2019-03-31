/* eslint-disable camelcase */
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';

import Layout from '../../components/Layout';
import {
  registerButton,
  loginButton,
  inputStyle,
  deleteButton,
  updateButton
} from '../../styles/buttonStyles';

import {
  cardPanel,
} from '../../styles/formStyles';
import LinkButton from '../../components/LinkButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Event from '../../components/Event';



class DisplayEventsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      showError: false,
      isLoading: true,
      error: false,
      event_deleted: false,
    };
  }

  async componentDidMount() {
    this.getEvents();
  }

  getEvents = (event) => {
    const token = localStorage.getItem('JWT');
    if (token == null) {
      this.setState({
        error: true,
        isLoading: false,
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
        showError,
        isLoading,
        error,
        event_deleted,
      } = data;
      this.setState({
        events,
        isLoading: false,
        error: false,
        event_deleted,
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
        isLoading: false,
        error: true,
      });
      return;
    }
    axios.delete('/api/events/deleteEvent', {
      params: {
        _id: _id,
      },
      headers: {
        Authorization: `JWT ${token}`,
      },
    }).then((res) => {
      console.log(res);
      this.getEvents();
    }).catch((err) => {
      console.error(err.response.data);
      this.setState({
        error: true,
      });
    });
  }

  // eslint-disable-next-line consistent-return
  render() {
    const {
      events,
      showErro,
      isLoading,
      error,
      event_deleted
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
        <div className="container">
          {events.map(event_iter => (
            <Event 
              key={event_iter._id}
              id={event_iter._id}
              name={event_iter.event_name}
              information={event_iter.information}
              location={event_iter.location}
              dateTime={event_iter.date_time} />

        ))}
        </div>
      </Layout>
    )
  }
}

export default DisplayEventsPage;
