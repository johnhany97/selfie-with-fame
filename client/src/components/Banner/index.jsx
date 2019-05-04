import React from 'react';
import PropTypes from 'prop-types';
import './index.css';
import appImg from './placeholder.png';


const Banner = (props) => {
    return(
        <div className="banner-background">
            <div className="container-lg banner-row">
                <div className="banner-text">
                    <div className="banner-holder">
                        <h1 className="banner-title">Discover 1000's of events in your area</h1>
                        <p className="banner-info">Add your story to the hundreds of people sharing their experiences of the best festivals around the world</p>
                    </div>
                </div>
                <div className="banner-img">
                    <img className="app-img" src={appImg} alt="Image of mobile app"></img>
                </div>
            </div>
        </div>
    )
}

export default Banner;