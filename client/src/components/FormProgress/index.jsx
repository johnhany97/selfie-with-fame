import React from 'react';
import './index.css';

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