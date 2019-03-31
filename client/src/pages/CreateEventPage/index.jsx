/* eslint-disable camelcase */
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import Layout from '../../components/Layout';
import {
  registerButton,
  loginButton,
  inputStyle,
} from '../../styles/buttonStyles';
import {
  formTitle, 
  formDividor,
  formSubmitButton,
} from '../../styles/formStyles';
import LinkButton from '../../components/LinkButton';
import SubmitButton from '../../components/SubmitButton';

class CreateEventPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      event_name: '',
      information: '',
      date_time: '',
      location: '',
      messageFromServer: '',
      showError: false,
      createEventError: false,
    };
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  createEvent = (event) => {
    const token = localStorage.getItem('JWT');
    if (token === null) {
      this.setState({
        showError: true,
      });
      return;
    }
    event.preventDefault();
    const {
      event_name,
      information,
      date_time,
      location,
    } = this.state;
    if (event_name === '' || date_time === '' || location === '' || information === '') {
      this.setState({
        showError: true,
        createEventError: true,
      });
      return;
    }
    axios.post(
      '/api/events/createEvent',
      {
        event_name,
        information,
        date_time,
        location,
      },
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      },
    ).then((res) => {
      this.setState({
        messageFromServer: res.data.message,
        showError: false,
        createEventError: false,
      });
    }).catch((err) => {
      this.setState({
        showError: true,
        createEventError: true,
      });
    });
  }

  // eslint-disable-next-line consistent-return
  render() {
    const {
      event_name,
      information,
      location,
      date_time,
      messageFromServer,
      showError,
      createEventError,
    } = this.state;

    if (messageFromServer === '') {
      return (
        <Layout title="Create Event">
          <div className="container">
            <h3 style={formTitle}>Create Event</h3>
            <hr style={formDividor}/>
            <form onSubmit={this.createEvent} className="panel-center">
              <TextField
                style={inputStyle}
                id="event_name"
                label="Event Name"
                value={event_name}
                onChange={this.handleChange('event_name')}
                placeholder="Event Name"
              />
              <TextField
                style={inputStyle}
                id="information"
                label="Information"
                value={information}
                onChange={this.handleChange('information')}
                placeholder="Info"
              />
              <TextField
                style={inputStyle}
                id="location"
                label="Location"
                value={location}
                onChange={this.handleChange('location')}
                placeholder="Location"
              />
              <TextField
                style={inputStyle}
                id="date_time"
                label="Date and Time of Event"
                type="datetime-local"
                onChange={this.handleChange('date_time')}
                value={date_time}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <SubmitButton
                buttonStyle={formSubmitButton}
                buttonText="Create Event"
              />
            </form>
            {showError === true && createEventError === true && (
              <div>
                <p>event name, info, location and date/time are required fields.</p>
              </div>
            )}
          </div>
        </Layout >
      );
    }
    if (messageFromServer === 'event created') {
      
      return (
        <Redirect to={`/events`} />
      );
     return null;
    }
  }
}

export default CreateEventPage;
