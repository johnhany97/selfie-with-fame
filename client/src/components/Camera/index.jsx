/* eslint-disable */
import React from 'react';

import styles from './index.module.css';
import {
  noWidthBtn,
} from '../../styles/formStyles';

const Camera = (props) => {
  const { handleStartClick } = props;
  return (
    <div>
      <video id="video" />
      <a
        id="startButton"
        onClick={handleStartClick}
        style={noWidthBtn}
      >
        Take Photo
    </a>
    </div>
  );
};

export default Camera;
