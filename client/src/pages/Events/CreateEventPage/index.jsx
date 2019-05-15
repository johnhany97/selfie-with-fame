/* eslint-disable camelcase */
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import Layout from '../../../components/Layout';
import GoogleMap from '../../GoogleMap';


import {
  inputStyle,
} from '../../../styles/buttonStyles';
import {
  formTitle,
  formDividor,
  formSubmitButton,
  mTop,
  cancelLink,
  errorMessage,
} from '../../../styles/formStyles';
import SubmitButton from '../../../components/SubmitButton';

class CreateEventPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eventID: '',
      name: '',
      information: '',
      start_date: '',
      end_date: '',
      location: [],
      city,
      messageFromServer: '',
      showError: false,
      createEventError: false,
      displayedEvents: [],
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

  handleCityChange = (data) => {
    this.setState({
      city: data,
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
      name,
      information,
      start_date,
      end_date,
      location,
      city,
    } = this.state;
    if (event_name === '' || information === ''||start_date === '' || end_date === '' || location === '' || city === '') {
      this.setState({
        showError: true,
        createEventError: true,
      });
      return;
    }
    axios.post(
      '/api/events/createEvent',
      {
        name,
        information,
        start_date,
        end_date,
        location,
        city,
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
        eventID: res.data.event_id,
      });
    }).catch(() => {
      this.setState({
        showError: true,
        createEventError: true,
      });
    });
  }

  getEvents = async () => {
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
        displayedEvents: events,
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

  async componentDidMount() {
    await this.getEvents();
  }

  // eslint-disable-next-line consistent-return
  render() {
    const {
      eventID,
      event_name,
      information,
      start_date,
      end_date,
      location,
      city,
      messageFromServer,
      showError,
      createEventError,
    } = this.state;
    console.log(`the type of location is ${typeof (location)} ${location[0]} ${location[1]}`);

    if (messageFromServer === '') {
      return (
        <Layout title="Create Event">

          <div className="container" style={mTop}>
            <h3 style={formTitle}>Create Event</h3>
            <hr style={formDividor} />
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
                id="date_time"
                label="Date and Time of Event Start"
                type="datetime-local"
                onChange={this.handleChange('date_time')}
                value={start_date}
                InputLabelProps={{
                  shrink: true,
                }}
              />
               <TextField
                style={inputStyle}
                id="date_time"
                label="Date and Time of Event End"
                type="datetime-local"
                onChange={this.handleChange('date_time')}
                value={end_date}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {showError === true && createEventError === true && (
                <p
                  style={errorMessage}
                >
                  *Event name, info, location and date/time are required fields.
                </p>
              )}
              <SubmitButton
                buttonStyle={formSubmitButton}
                buttonText="Create Event"
              />
              <a href="/events" style={cancelLink}>Cancel</a>
            </form>
            <GoogleMap
              handleLocationChange={this.handleLocationChange}
              handleCityChange={this.handleCityChange}
            />
          </div>
        </Layout>
      );
    }
    if (messageFromServer === 'event created') {
      return (
        <Redirect to={`/eventPage/${eventID}`} />
      );
    }
  }
}

export default CreateEventPage;
