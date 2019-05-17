/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import MobileStepper from '@material-ui/core/MobileStepper';
import './index.css';
import rightArrow from '../../images/right-arrow.png';
import leftArrow from '../../images/left-arrow.png';

/**
 * @Params
 * pictures => array of binary for pictures
 * 
 * @summary
 * Displays multiple pictures passed as props and allows the user
 * to cycle through the images
 * 
 * @returns
 * Returns JSX component to allow the user to cycle through
 * multiple images
 */
class StoryStepper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStep: 0,
    };
  }

  handleNext = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep - 1,
    }));
  };


  render() {
    const { pictures } = this.props;
    const { activeStep } = this.state;
    const maxSteps = pictures ? pictures.length : 0;

    return (
      <div className="story-stepper">
        <img
          className="story-stepper-img"
          src={'data:image/png;base64,' + pictures[activeStep]}
          alt={pictures[activeStep]}
        />
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <button className="story-stepper-navigation" size="small" onClick={this.handleNext} disabled={activeStep === maxSteps - 1}>
              Next
              <img className="stepper-arrow" src={rightArrow} alt="Next Image" />
            </button>
          }
          backButton={
            <button className="story-stepper-navigation" size="small" onClick={this.handleBack} disabled={activeStep === 0}>
              <img className="stepper-arrow" src={leftArrow} alt="Previous Image" />
              Back
            </button>
          }
        />
      </div>
    );
  }
}
export default StoryStepper;
