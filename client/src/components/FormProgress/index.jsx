import React from 'react';
import './index.css';


/**
 * @Params
 * step => current progress step
 * size => total number of progress steps
 * 
 * @summary
 * Displays custom progress bar filled to a step size
 * passed through props
 * 
 * @returns
 * Returns JSX for progress bar
 */
class FormProgress extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        const { step, size } = this.props;
        return (
            <ul className="form-progress-container">
                {[...Array(size)].map((_, i) => 
                    <li key={i} className={"form-progress-pill " + (i < step  ? 'highlighted' : 'blah')}></li>
                )}
            </ul>
        );
    }
}

export default FormProgress;