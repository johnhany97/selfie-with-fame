/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

import Event from '../../Event';
import {
  noWidthBtn,
} from '../../../styles/formStyles.js';
import './index.css';
import leftArrow from './../../../images/left-arrow.png';
import FormProgress from '../../FormProgress';

const Confirmation = (props) => {
  const {
    values,
    createStory,
    previousStep,
    step,
  } = props;

  return (
    <React.Fragment>
      <div className="story-confirmation-container">
        <div class="form-navigation">
          <button type="submit" className="navigation-btn-back" onClick={previousStep}>
            <img className="navigation-arrow" src={leftArrow} alt="Back" />
            Back
          </button>
          <FormProgress size={4} step={step} />
        </div>
        {values && values.picture && <img id="photo" src={values.picture} alt="Story taken" />}
        {values && values.event && <Event {...values.event} />}
        Title: {values && values.text && <p>{values.text}</p>}
        <div>

          <button type="button" onClick={createStory} className="submit-story-btn">Submit</button>
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
