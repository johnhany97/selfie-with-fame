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
import LinkButton from '../../components/LinkButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';



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
    // const token = localStorage.getItem('JWT');
    // if (token == null) {
    //   this.setState({
    //     error: true,
    //     isLoading: false,
    //   });
    //   return;
    // }
    // await axios.get('/api/events/getEvents', {
    //   params: {
    //   },
    //   headers: {
    //     Authorization: `JWT ${token}`,
    //   },
    // }).then((res) => {
    //   const { data } = res;
    //   const {
    //     events,
    //     showError,
    //     isLoading,
    //     error,
    //     event_deleted,
    //   } = data;
    //   this.setState({
    //     events,
    //     isLoading: false,
    //     error: false,
    //     event_deleted,
    //   });
    // }).catch((err) => {
    //   console.error(err.response.data);
    //   this.setState({
    //     error: true,
    //   });
    // });
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

    // if (event_deleted) {
    //   console.log("event delted  render check");
    //   return ( 
    //     <Redirect to="/events" />
    //   );
    // }
    return (
      <Layout title="Events">
        {events.map(event_iter => (
          <Table key={event_iter._id} >
            <TableBody>
              <TableRow>
                <TableCell>Event Name</TableCell>
                <TableCell>{event_iter.event_name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>infor</TableCell>
                <TableCell>{event_iter.information}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Location</TableCell>
                <TableCell>{event_iter.location}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date/Time</TableCell>
                <TableCell>{event_iter.date_time}}</TableCell>
              </TableRow>
              <TableRow>
                <Button
                  style={deleteButton}
                  variant="contained"
                  color="primary"
                  onClick={() => this.deleteEvent(event_iter._id)}
                >
                DELETE
                </Button>
                <LinkButton
                  buttonStyle={updateButton}
                  buttonText="Update Event"
                  link={`/updateEvent/${event_iter._id}`}
                />
                <LinkButton
                  buttonStyle={updateButton}
                  buttonText="View Event"
                  link={`/EventPage/${event_iter._id}`}
                />
              </TableRow>
            </TableBody>
          </Table>
        ))}
      </Layout>
    )
  }
}

export default DisplayEventsPage;
