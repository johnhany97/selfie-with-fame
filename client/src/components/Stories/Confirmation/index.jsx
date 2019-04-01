/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

import Event from '../../Event';
import {
  noWidthBtn,
} from '../../../styles/formStyles.js';
import './index.css';

const Confirmation = (props) => {
  const {
    values,
    createStory,
    previousStep,
  } = props;

  return (
    <React.Fragment>
      <div className="story-confirmation-container">
        {values && values.picture && <img id="photo" src={values.picture} alt="Story taken" />}
        {values && values.event && <Event {...values.event} />}
        Title: {values && values.text && <p>{values.text}</p>}
        <div>
          <button type="button" onClick={createStory} style={noWidthBtn}>Submit</button>
          <button type="button" onClick={previousStep} style={noWidthBtn}>Back</button>
        </div>
      </div>
    </React.Fragment>
  );
};

Confirmation.propTypes = {
  values: PropTypes.object.isRequired,
  createStory: PropTypes.func.isRequired,
  previousStep: PropTypes.func.isRequired,
};

export default Confirmation;
