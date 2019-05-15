import React from 'react';
import MobileStepper from '@material-ui/core/MobileStepper';

class StoryStepper extends React.Component {
    constructor(props){
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
                    src={pictures[activeStep]}
                    alt={pictures[activeStep]}
                />
                <MobileStepper
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    nextButton={
                        <button size="small" onClick={this.handleNext} disabled={activeStep === maxSteps - 1}>
                            Next
                        </button>
                    }
                    backButton={
                        <button size="small" onClick={this.handleBack} disabled={activeStep === 0}>
                            Back
                        </button>
                    }
                />
            </div>
        );
    }
}
export default StoryStepper;