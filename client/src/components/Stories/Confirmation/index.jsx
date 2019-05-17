/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

import './index.css';
import leftArrow from '../../../images/left-arrow.png';
import FormProgress from '../../FormProgress';
import Photo from '../../Photo';

/**
 * @Params
 * values
 * createStory
 * previousStep
 * step
 * disableButton
 * 
 * @summary
 * Displays confimation screen at the end of create story process
 * 
 * @returns
 * Returns JSX component giving the user an overview of the story
 * they are about to submit
 */
const Confirmation = (props) => {
  const {
    values,
    createStory,
    previousStep,
    step,
    disableButton,
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
        <div className="thumbnails-container">
          {values.pictures.map((data, index) =>
            <Photo key={index} data={data} confirmation={true}/>
          )}
        </div>
        <h5 className="confirmation-event-heading">Event</h5>
        {values && values.event && <p>{values.event.name} </p>}
        <h5 className="confirmation-caption-heading">Caption</h5>
        {values && values.text && <p>{values.text}</p>}
        <div>
          <button type="button" onClick={createStory} className="submit-story-btn" disabled={disableButton}>Submit</button>
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
