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
    <div style={cardPanel}>
      <a
        href={`/eventPage/${_id}`}
        className="event-title"
      >
        {event_name}
      </a>
      <p>{information}</p>
      <p>{location}</p>
      <p>{date_time}</p>
      {selected && (
        <p>
          Selected
        </p>
      )}
      <div>
        <a href={`/updateEvent/${_id}`} style={crudButton}>Update</a>
      </div>
    </div>
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
