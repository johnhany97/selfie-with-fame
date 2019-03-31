import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Capture from '../../Capture';

class CreateStoryCamera extends Component {
  saveAndContinue = (e) => {
    e.preventDefault();
    const { nextStep } = this.props;
    nextStep();
  }

  render() {
    const { values, handlePhotoChange } = this.props;
    return (
      <form onSubmit={this.saveAndContinue}>
        <h1>Camera</h1>
        <Capture handlePhotoChange={handlePhotoChange} />
        <button type="submit">Next</button>
      </form>
    );
  }
}

CreateStoryCamera.propTypes = {
  nextStep: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  values: PropTypes.object.isRequired,
  handlePhotoChange: PropTypes.func.isRequired,
};

export default CreateStoryCamera;
