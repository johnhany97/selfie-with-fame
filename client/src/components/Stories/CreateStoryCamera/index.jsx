import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Capture from '../../Capture';
import './index.css';
import{
  crudButton,
} from '../../../styles/formStyles';
class CreateStoryCamera extends Component {
  saveAndContinue = (e) => {
    e.preventDefault();
    const { nextStep } = this.props;
    nextStep();
  }

  render() {
    const { handlePhotoChange } = this.props;
    return (
      <form onSubmit={this.saveAndContinue} className="create-story-form">
        <h1 className="create-story-title">Camera</h1>
        <Capture handlePhotoChange={handlePhotoChange} />
        <button type="submit" style={crudButton} className="create-story-next-btn">Next</button>
      </form>
    );
  }
}

CreateStoryCamera.propTypes = {
  nextStep: PropTypes.func.isRequired,
  handlePhotoChange: PropTypes.func.isRequired,
};

export default CreateStoryCamera;
