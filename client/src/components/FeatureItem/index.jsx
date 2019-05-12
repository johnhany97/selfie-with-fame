import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

const FeatureItem = (props) => {
    return(
        <div className="feature-item-container">
            <img className="feature-item-img" src=""/>
            <h5 className="feature-item-title">{props.title}</h5>
            <p className="feature-item-info">This is some sample text that gives a description of the feature. This text will need to be changed at a later date.</p>
        </div>
    )
}

export default FeatureItem;