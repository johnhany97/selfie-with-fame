/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

import {
  cancelButton,
  saveButton,
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
import Layout from '../../components/Layout';

class UpdateEventPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      event_name: '',
      information: '',
      date_time: '',
      location: '',
      event_id: '',
      loadingEvent: false,
      updated: false,
      error: false,
    };
  }

  componentDidMount() {
    this.setState({
      loadingEvent: true,
      event_id: this.props.match.params._id,
    });

    const token = localStorage.getItem('JWT');
    if (token === null) {
      this.setState({
        loadingEvent: false,
        error: true,
      });
    }
    axios.get('/api/events/findEvent', {
      params: {
        _id: this.props.match.params._id,
      },
      headers: { Authorization: `JWT ${token}` },
    }).then((response) => {
      // console.log(response.data);
      this.setState({
        loadingEvent: false,
        event_name: response.data.event_name ? response.data.event_name : '',
        information: response.data.information ? response.data.information : '',
        location: response.data.location,
        date_time: response.data.date_time,
        error: false,
      });
    }).catch((error) => {
      console.log(error.response.data);
      this.setState({
        error: true,
      });
    });
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  updateEvent = (e) => {
    const token = localStorage.getItem('JWT');
    if (token === null) {
      this.setState({
        loadingEvent: false,
        error: true,
      });
    }
    e.preventDefault();
    axios.put('/api/events/updateEvent', {
      _id: this.state.event_id,
      event_name: this.state.event_name,
      information: this.state.information,
      location: this.state.location,
      date_time: this.state.date_time,
    }, {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }).then((res) => {
        console.log(res.data);
        this.setState({
          updated: true,
          error: false,
        });
      }).catch((err) => {
        console.log(err.response.data);
        this.setState({
          loadingEvent: false,
          error: true,
        });
      });
  };

  // eslint-disable-next-line consistent-return
  render() {
    const {
      event_name,
      information,
      date_time,
      location,
      updated,
      error,
      loadingEvent,
    } = this.state;

    if (error) {
      return (
        <Layout title="Update Event">
          <p>
            There was a problem accessing your data. Please try to login again.
          </p>
          <LinkButton
            style={loginButton}
            buttonText="Login"
            link="/login"
          />
        </Layout>
      );
    }
    if (loadingEvent !== false) {
      return (
        <Layout title="Update Event">
          <p>Loading event data...</p>
        </Layout>
      );
    }
    if (loadingEvent === false && updated === true) {
      return <Redirect to={`/eventPage/${this.state.event_id}`} />;
    }
    if (loadingEvent === false) {
      return (
        <Layout title="Update Event">
          <div className="container">
            <h3 style={formTitle}>Update Event</h3>
            <hr style={formDividor}/>
            <form className="panel-center" onSubmit={this.updateEvent}>
              <TextField
                style={inputStyle}
                id="event_name"
                label="event_name"
                value={event_name}
                onChange={this.handleChange('event_name')}
                placeholder="Event Name"
              />
              <TextField
                style={inputStyle}
                id="information"
                label="information"
                value={information}
                onChange={this.handleChange('information')}
                placeholder="information"
              />
              <TextField
                style={inputStyle}
                id="location"
                label="location"
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
                buttonText="Save Changes"
              />
            </form>
            <LinkButton
              buttonStyle={cancelButton}
              buttonText="Cancel Changes"
              link={`/eventPage/${this.props.match.params._id}`}
            />
          </div>
        </Layout>
      );
    }
  }
}

UpdateEventPage.propTypes = {
  // eslint-disable-next-line react/require-default-props
  match: PropTypes.shape({
    params: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
  }),
};

export default UpdateEventPage;
