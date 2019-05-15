/* eslint-disable */
import React from 'react';

import styles from './index.css';
import {
  noWidthBtn,
} from '../../styles/formStyles';
import recordBtn from '../../images/camera-record-btn.png';

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
