import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

import { inputStyle } from '../../../styles/buttonStyles';

const CreateStoryText = (props) => {
  const {
    handleChange,
    nextStep,
    previousStep,
  } = props;
  return (
    <form>
      <TextField
        id="text"
        label="Text"
        style={inputStyle}
        onChange={handleChange('text')}
        placeholder="Insert text"
        type="text"
      />
      <button type="button" onClick={nextStep}>Next</button>
      <button type="button" onClick={previousStep}>Back</button>
    </form>
  );
};

CreateStoryText.propTypes = {
  handleChange: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  previousStep: PropTypes.func.isRequired,
};

export default CreateStoryText;
