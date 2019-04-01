import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

import { inputStyle } from '../../../styles/buttonStyles';
import {
  noWidthBtn,
} from '../../../styles/formStyles';
import './index.css';

const CreateStoryText = (props) => {
  const {
    handleChange,
    nextStep,
    previousStep,
  } = props;
  return (
    <form className="story-text-form">
      <h1 className="story-text-title">Add a title</h1>
      <TextField
        id="text"
        label="Text"
        style={inputStyle}
        onChange={handleChange('text')}
        placeholder="Insert text"
        type="text"
      />
      <div>
        <button type="button" onClick={nextStep} style={noWidthBtn}>Next</button>
        <button type="button" onClick={previousStep} style={noWidthBtn}>Back</button>
      </div>
    </form>
  );
};

CreateStoryText.propTypes = {
  handleChange: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  previousStep: PropTypes.func.isRequired,
};

export default CreateStoryText;
