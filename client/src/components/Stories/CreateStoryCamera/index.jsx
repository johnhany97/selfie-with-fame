import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Capture from '../../Capture';
import './index.css';
import rightArrow from './../../../images/right-arrow.png';
import FormProgress from '../../FormProgress';

/**
 * @Params
 * nextStep => function passed down to handle changing to
 * the next step in the create story process
 * 
 * @summary
 * Displays page capturing images using the camera component 
 * which uses WebRTC. It also allows the user to take multiple
 * photos and remove multiple photos
 * 
 * @returns
 * Returns JSX for capturing photos from the users camera
 */
class CreateStoryCamera extends Component {
  saveAndContinue = (e) => {
    e.preventDefault();
    const { nextStep } = this.props;
    nextStep();
  }
  render() {
    const { handlePhotoChange, step, onAddPicture, removePicture, values } = this.props;
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
