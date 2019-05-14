/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';

import {
  cardPanel,
  crudButton,
} from '../../styles/formStyles';
import './index.css';

const Event = (props) => {
  const {
    _id,
    event_name,
    information,
    date_time,
    location,
    selected,
  } = props;

  

  return (
    <a href={`/eventPage/${_id}`}>
      <div className="event-card-panel">
        <div className="event-card-img" />
        <div className="event-card-info">
          <p className="event-card-date">{date_time}</p>
          <h3 className="event-card-title">{event_name}</h3>
          <p className="event-card-location">{location}</p>
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
};

Event.propTypes = {
  _id: PropTypes.string,
  event_name: PropTypes.string.isRequired,
  information: PropTypes.string.isRequired,
  date_time: PropTypes.string.isRequired,
  location: PropTypes.object,
  selected: PropTypes.bool,
};

export default Event;
