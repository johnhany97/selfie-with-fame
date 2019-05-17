/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import './index.css';
import leftArrow from '../../../images/left-arrow.png';
import rightArrow from '../../../images/right-arrow.png';
import FormProgress from '../../FormProgress';
import SelectEventMap from '../../SelectEventMap';
import DB from '../../../db/db';

class CreateStoryEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      city: '',
      location: '',
    };
  }

  componentDidMount() {
    const token = localStorage.getItem('JWT');
    if (token === null) {
      console.log('unauthorized');
      // TODO: REDIRET to login page
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
        if (!err.status) {
          DB.getAllEvents().then((events) => {
            this.setState({
              events,
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
    const { events } = this.state;
    const { values, handleEventChange, nextStep, previousStep, step } = this.props;
    return (
      <div className="select-event-container">
        <div className="form-navigation">
          <button onClick={previousStep} type="button" className="navigation-btn-back">
            <img className="navigation-arrow" src={leftArrow} alt="Back" />
            Back
          </button>
          <FormProgress size={4} step={step} />
          <button onClick={nextStep} disabled={values.event === null} className="navigation-btn-next">Next
            <img className="navigation-arrow" src={rightArrow} alt="Next" />
          </button>
        </div>

        <SelectEventMap
          handleCityChange= {this.handleCityChange} 
          handleLocationChange = {this.handleLocationChange}
          handleEventChange = {this.props.handleEventChange}
          topLevelEvent = {this.props.topLevelEvent}
        />
        

        {/* {events && events.map((event, index) => (
          <React.Fragment>
            <Event key={index} {...event} selected={values && values.event && values.event._id === event._id} />
            <button onClick={() => handleEventChange(event)} type="button" style={noWidthBtn}>Select</button>
          </React.Fragment>
        ))}
        {(events === null || (events && events.length === 0)) && <p>No events available</p>} */}
      </div>
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

export default CreateStoryEvent;
