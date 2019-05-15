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
    name,
    information,
    start_date,
    location,
    end_date,
    selected,
  } = props;

  return (
    <div style={cardPanel}>
      <a
        href={`/eventPage/${_id}`}
        className="event-title"
      >
        {name}
      </a>
      <p>{information}</p>
      <p>{location['city']}</p>
      <p>{start_date}</p>
      <p>{end_date}</p>

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
  name: PropTypes.string.isRequired,
  information: PropTypes.string.isRequired,
  start_date: PropTypes.string.isRequired,
  end_date: PropTypes.string.isRequired,
  location: PropTypes.object,
  selected: PropTypes.bool,
};

export default Event;
