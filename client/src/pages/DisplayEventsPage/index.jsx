/* eslint-disable camelcase */
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

import Layout from '../../components/Layout';
import {
  registerButton,
  loginButton,
  inputStyle,
} from '../../styles/buttonStyles';
import LinkButton from '../../components/LinkButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';


class DisplayEventsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      showError: false,
      isLoading: true,
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
    await axios.get('/api/events/getEvents', {
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
      } = data;
      this.setState({
        events,
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


  // eslint-disable-next-line consistent-return
  render() {
    const {
      events,
      showErro,
      isLoading,
      error,
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
    console.log("these are the events: " + events)
    return (
      <Layout title="Events">
        {events.map(event_iter => (
          <Table key={event_iter.id} >
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
            </TableBody>
          </Table>
          ))}
        </Layout>
    )
  }
}

export default DisplayEventsPage;
