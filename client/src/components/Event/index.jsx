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
    <a href={`/eventPage/${_id}`}>
      <div className="event-card-panel">
        <div className="event-card-img" />
        <div className="event-card-info">
          <p className="event-card-date">{start_date + '-' + end_date}</p>
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
