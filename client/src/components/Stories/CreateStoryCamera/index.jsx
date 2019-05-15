import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Capture from '../../Capture';
import './index.css';
import rightArrow from './../../../images/right-arrow.png';
import {
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
        <div class="form-navigation">
          <button type="submit" className="navigation-btn">Next
          <img className="navigation-arrow" src={rightArrow} alt="Next" />
          </button>
        </div>
        <Capture handlePhotoChange={handlePhotoChange} />
      </form>
    );
  }
}

CreateStoryCamera.propTypes = {
  nextStep: PropTypes.func.isRequired,
  handlePhotoChange: PropTypes.func.isRequired,
};

export default CreateStoryCamera;
