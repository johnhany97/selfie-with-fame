/* eslint-disable */
import React from 'react';

import {
  noWidthBtn,
} from '../../styles/formStyles';
import './index.css';

const Photo = (props) => {
  const { handleSaveClick } = props;
  return (
    <div>
      <img id="photo" className="create-story-img"/>
      <a id="saveButton" onClick={handleSaveClick} style={noWidthBtn}>Save Photo</a>
    </div>
  );
}

export default Photo;
