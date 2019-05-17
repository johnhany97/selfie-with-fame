/* eslint-disable react/require-default-props */
/* eslint-disable react/button-has-type */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/prop-types */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import {
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from '@material-ui/core';
import './index.css';
import leftArrow from '../../../images/left-arrow.png';
import rightArrow from '../../../images/right-arrow.png';
import FormProgress from '../../FormProgress';
import SelectEventMap from '../../SelectEventMap';
import DB from '../../../db/db';

/**
 * @Params
 * values
 * handleEventChange
 * nextStep
 * previousStep
 * step
 *
 * @summary
 * Displays page that allows the user to search and filter and select
 * an event from the map that they want to add a story to.
 *
 * @returns
 * Returns JSX component to allow the user to select event
 * from GoogleMap component
 */
class CreateStoryEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      city: '',
      location: '',
      isOffline: false,
    };
  }

  componentDidMount() {
    const token = localStorage.getItem('JWT');
    if (!token) {
      const { history } = this.props;
      history.replace('/login');
      return;
    }
    axios.get('/api/events/getEvents', {
      headers: { Authorization: `JWT ${token}` },
    })
      .then((res) => {
        this.setState({
          events: res.data.events,
        });
      })
      .catch((err) => {
        console.log(err);
        if (!err.status) { // was offline
          DB.getAllEvents().then((events) => {
            this.setState({
              events,
              isOffline: true,
            });
          });
        }
      });
  }

  saveAndContinue = (e) => {
    e.preventDefault();
    const { nextStep } = this.props;
    nextStep();
  }

  goBack = (e) => {
    e.preventDefault();
    const { previousStep } = this.props;
    previousStep();
  }

  handleCityChange = (data) => {
    this.setState({
      city: data,
    });
  };

  handleLocationChange = (data) => {
    this.setState({
      location: data,
    });
  };


  render() {
    const {
      values,
      nextStep,
      previousStep,
      step,
      topLevelEvent,
      handleEventChange,
      handleOfflineEventChange,
    } = this.props;
    const { isOffline, events } = this.state;
    if (!isOffline) {
      return (
        <div className="select-event-container">
          <div className="form-navigation">
            <button onClick={previousStep} type="button" className="navigation-btn-back">
              <img className="navigation-arrow" src={leftArrow} alt="Back" />
              Back
            </button>
            <FormProgress size={4} step={step} />
            <button onClick={nextStep} disabled={values.event === null} className="navigation-btn-next">
              Next
              <img className="navigation-arrow" src={rightArrow} alt="Next" />
            </button>
          </div>

          <SelectEventMap
            handleCityChange={this.handleCityChange}
            handleLocationChange={this.handleLocationChange}
            handleEventChange={handleEventChange}
            topLevelEvent={topLevelEvent}
          />
        </div>
      );
    }
    return (
      <React.Fragment>
        {
          events && (
            <div className="select-event-container">
              <div className="form-navigation">
                <button onClick={previousStep} type="button" className="navigation-btn-back">
                  <img className="navigation-arrow" src={leftArrow} alt="Back" />
                  Back
                </button>
                <FormProgress size={4} step={step} />
                <button onClick={nextStep} disabled={values.event === null} className="navigation-btn-next">
                  Next
                  <img className="navigation-arrow" src={rightArrow} alt="Next" />
                </button>
              </div>
              <FormControl>
                <InputLabel htmlFor="event">Event</InputLabel>
                <Select
                  value={topLevelEvent}
                  fullWidth
                  onChange={handleOfflineEventChange}
                  inputProps={{
                    name: 'event',
                    id: 'event',
                  }}
                >
                  {events.map(event => (
                    <MenuItem key={event._id} value={event}>{event.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )
        }
        {(events === null || (events && events.length === 0)) && <p>No events available</p>}
      </React.Fragment>
    );
  }
}

CreateStoryEvent.propTypes = {
  nextStep: PropTypes.func.isRequired,
  previousStep: PropTypes.func.isRequired,
  handleEventChange: PropTypes.func.isRequired,
  topLevelEvent: PropTypes.object,
  values: PropTypes.object.isRequired,
};

export default withRouter(CreateStoryEvent);
