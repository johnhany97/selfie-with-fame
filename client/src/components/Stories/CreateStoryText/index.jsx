import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

import { inputStyle } from '../../../styles/buttonStyles';
import './index.css';
import leftArrow from '../../../images/left-arrow.png';
import rightArrow from '../../../images/right-arrow.png';
import FormProgress from '../../FormProgress';


/**
 * @Params
 * handleChange,
   nextStep,
   previousStep,
   step 
 * 
 * @summary
 * Displays page that allows the user to add a caption to their story
 * 
 * @returns
 * Returns JSX component to allow the user to add a caption using
 * a text field
 */
const CreateStoryText = (props) => {
  const {
    handleChange,
    nextStep,
    previousStep,
    step,
  } = props;
  return (
    <form className="story-text-form">
      <div className="form-navigation">
        <button onClick={previousStep} type="button" className="navigation-btn-back">
          <img className="navigation-arrow" src={leftArrow} alt="Back" />
          Back
        </button>
        <FormProgress size={4} step={step} />
        <button onClick={nextStep} className="navigation-btn-next">Next
            <img className="navigation-arrow" src={rightArrow} alt="Next" />
        </button>
      </div>
      <TextField
        id="text"
        label="Add a caption"
        style={inputStyle}
        onChange={handleChange('text')}
        placeholder="Add a caption"
        type="text"
      />
    </form>
  );
};

CreateStoryText.propTypes = {
  handleChange: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  previousStep: PropTypes.func.isRequired,
};

export default CreateStoryText;
