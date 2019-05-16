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
import './index.css';

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
      city: '',
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
    console.log("handle location change" + this.state.location)

  };

  handleCityChange = (data) => {
    this.setState({
      city: data,
    });
    console.log("handle city change" + this.state.city)

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
    if (name === '' || information === ''||start_date === '' || end_date === '' || location === '' || city === '') {
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
      name,
      information,
      start_date,
      end_date,
      location,
      city,
      messageFromServer,
      showError,
      createEventError,
    } = this.state;

    if (messageFromServer === '') {
      return (
        <Layout title="Create Event">

          <div className="container" style={mTop}>
            <h3 className="create-event-title">Create Event</h3>
            <hr className="create-event-divider" />
            <form onSubmit={this.createEvent} className="panel-center">
              <TextField
                style={inputStyle}
                id="name"
                label="Event Name"
                value={name}
                onChange={this.handleChange('name')}
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
                id="start_date"
                label="Date and Time of Event Start"
                type="datetime-local"
                onChange={this.handleChange('start_date')}
                value={start_date}
                InputLabelProps={{
                  shrink: true,
                }}
              />
               <TextField
                style={inputStyle}
                id="end_date"
                label="Date and Time of Event End"
                type="datetime-local"
                onChange={this.handleChange('end_date')}
                value={end_date}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <GoogleMap
                handleLocationChange={this.handleLocationChange}
                handleCityChange={this.handleCityChange}
              />

              {showError === true && createEventError === true && (
                <p
                  style={errorMessage}
                >
                  *Event name, info, location and date/time are required fields.
                </p>
              )}
              <button className="create-event-btn" type="submit">Submit</button>
              <a href="/events" style={cancelLink}>Cancel</a>
            </form>
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
