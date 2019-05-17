/* eslint-disable */
import React from 'react';

import styles from './index.css';
import {
  noWidthBtn,
} from '../../styles/formStyles';
import recordBtn from '../../images/camera-record-btn.png';

/**
 * @Params
 * handleStartClick => method passed down as prop to handle capture image click
 * 
 * @summary
 * Displays video component and capture button to capture frame of video
 * 
 * @returns
 * JSX code to display video component and capture image button
 */
const Camera = (props) => {
  const { handleStartClick } = props;
  return (
    <div className="camera-container">
      <video id="video" />
      <img className="camera-capture-btn" onClick={handleStartClick} src={recordBtn} alt="Take Picture" />
    </div>
  );
};

export default Camera;
