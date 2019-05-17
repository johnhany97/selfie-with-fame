/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

/**
 * @Params
 * _id
 * name
 * start_date
 * location
 * information
 * end_date
 * selected
 * 
 * @summary
 * Displays event summary on card
 * 
 * @returns
 * Returns JSX for displaying event overview card
 */
class Event extends React.Component {
  convertDateFormat(date) {
    let createAtDate = new Date(date);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = createAtDate.getFullYear();
    var month = months[createAtDate.getMonth()];
    var day = createAtDate.getDate();
    var convertedDate = day + ' ' + month + ' ' + year;
    return convertedDate;
  };

  render() {
    const {
      _id,
      name,
      start_date,
      location,
      selected,
    } = this.props;

    return (
      <a href={`/eventPage/${_id}`}>
        <div className="event-card-panel">
          <div className="event-card-img" />
          <div className="event-card-info">
            <p className="event-card-date">{this.convertDateFormat(start_date)}</p>
            <h3 className="event-card-title">{name}</h3>
            <p className="event-card-location">{location['city']}</p>
            {selected && (
              <p>
                Selected
              </p>
            )}
            <p className="event-card-going">234 people going</p>
          </div>
        </div>
      </a>
    );
  }
}

Event.propTypes = {
  _id: PropTypes.string,
  name: PropTypes.string.isRequired,
  information: PropTypes.string.isRequired,
  start_date: PropTypes.string.isRequired,
  end_date: PropTypes.string.isRequired,
  location: PropTypes.object,
  selected: PropTypes.bool,
};

export default Event;
