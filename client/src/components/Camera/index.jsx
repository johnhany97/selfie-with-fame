/* eslint-disable */
import React from 'react';

import styles from './index.module.css';

const Camera = (props) => {
  const { handleStartClick } = props;
  return (
    <div>
      <video id="video" />
      <a
        id="startButton"
        onClick={handleStartClick}
      >
        Take Photo
    </a>
    </div>
  );
};

export default Camera;
