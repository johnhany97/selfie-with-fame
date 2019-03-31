/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';

const Event = (props) => {
  const {
    event_name,
    information,
    date_time,
    location,
  } = props;

  return (
    <div>
      <p>
        Name:
        {event_name}
      </p>
      <p>
        Information:
        {information}
      </p>
      <p>
        Date/Time:
        {date_time}
      </p>
      <p>
        Location:
        {location}
      </p>
    </div>
  );
};

Event.propTypes = {
  event_name: PropTypes.string.isRequired,
  information: PropTypes.string.isRequired,
  date_time: PropTypes.string.isRequired,
  location: PropTypes.object,
};

export default Event;
