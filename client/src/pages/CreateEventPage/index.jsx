/* eslint-disable camelcase */
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

import Layout from '../../components/Layout';
import GoogleMap from '../GoogleMap';

import {
  registerButton,
  loginButton,
  inputStyle,
} from '../../styles/buttonStyles';
import LinkButton from '../../components/LinkButton';
import SubmitButton from '../../components/SubmitButton';

class CreateEventPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      event_name: '',
      information: '',
      date_time: '',
      location: [],
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


  handleLocationChange = (data) => {
    this.setState({
      location: data,
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
    console.log("the type of location is " + typeof(location) + ""  + location[0] + " " + location[1]);

    if (messageFromServer === '') {
      return (
        <Layout title="Create Event">
          <form onSubmit={this.createEvent}>
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
            
            {/* <TextField
              style={inputStyle}
              id="location"
              label="Location"
              value={location}
              onChange={this.handleChange('location')}
              placeholder="Location"
            /> */}
            
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
              buttonStyle={loginButton}
              buttonText="Create Event"
            />
            <GoogleMap
              handleLocationChange={this.handleLocationChange}
            ></GoogleMap>
          </form>
          
          {showError === true && createEventError === true && (
            <div>
              <p>event name, info, location and date/time are required fields.</p>
            </div>
          )}
        </Layout>
      );
    }
    if (messageFromServer === 'event created') {
      return (
        <Layout title="Event Creation">
          <h3>Successfully created event</h3>
          <p>{information}</p>
          <LinkButton
            buttonText="Login"
            buttonStyle={loginButton}
            link="/login"
          />
        </Layout>
      );
    }
  }
}

export default CreateEventPage;
