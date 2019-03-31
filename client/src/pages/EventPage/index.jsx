/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

import {
  deleteButton,
  updateButton,
  loginButton,
  logoutButton,
  linkStyle,
  forgotButton,
} from '../../styles/buttonStyles';
import LinkButton from '../../components/LinkButton';
import Layout from '../../components/Layout';

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
    };
  }

  async componentDidMount() {
    const token = localStorage.getItem('JWT');
    if (token == null) {
      this.setState({
        error: true,
        isLoading: false,
      });
      return;
    }
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
      console.log("THE VAAAAAAAAAAR NAMES AAAAAAARE" + event_name);

      this.setState({
        event_name: event_name,
        information: information,
        location: location,
        date_time: date_time,
        isLoading: false,
        error: false,
      });
    }).catch((err) => {
      console.error(err.response.data);
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
    }).then((res) => {
      console.log(res);
      this.setState({
        deleted: true,
      });
    }).catch((err) => {
      console.error(err.response.data);
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
    } = this.state;
    console.log("THE VAAAAAAAAAAR NAMES AAAAAAARE" + event_name);
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
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Event Name</TableCell>
              <TableCell>{event_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Information</TableCell>
              <TableCell>{information}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Location</TableCell>
              <TableCell>{location}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Date Time</TableCell>
              <TableCell>{date_time}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Button
          style={deleteButton}
          variant="contained"
          color="primary"
          onClick={this.deleteEvent}
        >
          Delete Event
        </Button>
        <LinkButton
          buttonStyle={updateButton}
          buttonText="Update Event"
          link={`/updateEvent/${this.props.match.params._id}`}
        />
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
