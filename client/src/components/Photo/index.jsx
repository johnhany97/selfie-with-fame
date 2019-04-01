/* eslint-disable */
import React from 'react';

const Photo = (props) => {
  const { handleSaveClick } = props;
  return (
    <div>
      <img id="photo" />
      <a id="saveButton" onClick={handleSaveClick}>Save Photo</a>
    </div>
  );
}

export default Photo;
