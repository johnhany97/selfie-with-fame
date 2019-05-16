import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Capture from '../../Capture';
import './index.css';
import rightArrow from './../../../images/right-arrow.png';
import {
  crudButton,
} from '../../../styles/formStyles';
import FormProgress from '../../FormProgress';

class CreateStoryCamera extends Component {
  saveAndContinue = (e) => {
    e.preventDefault();
    const { nextStep } = this.props;
    nextStep();
  }
  render() {
    const { handlePhotoChange, step, onAddPicture, removePicture, values} = this.props;
    return (
      <form onSubmit={this.saveAndContinue} className="create-story-form">
        <div className="form-navigation">
          <FormProgress size={4} step={step} />
          <button type="submit" className="navigation-btn-next">Next
            <img className="navigation-arrow" src={rightArrow} alt="Next" />
          </button>
        </div>
        <Capture handlePhotoChange={handlePhotoChange} onAddPicture={onAddPicture} removePicture={removePicture} values={values} />
      </form>
    );
  }
}

CreateStoryCamera.propTypes = {
  nextStep: PropTypes.func.isRequired,
};

export default CreateStoryCamera;
