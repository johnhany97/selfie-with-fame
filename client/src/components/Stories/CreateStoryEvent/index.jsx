import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import Event from '../../Event';

class CreateStoryEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
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
        // TODO: Snackbar the error
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

  render() {
    const { events } = this.state;
    const { values, handleChange } = this.props;
    return (
      <div>
        <h1>Select event</h1>
        {events && events.map((event, index) => (<Event key={index} {...event} />))}
        {(events === null || (events && events.length === 0)) && <p>No events available</p>}
      </div>
    );
  }
}

CreateStoryEvent.propTypes = {
  nextStep: PropTypes.func.isRequired,
  previousStep: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default CreateStoryEvent;
