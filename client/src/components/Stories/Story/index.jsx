/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';

const Story = (props) => {
  const {
    text,
    picture,
    createdAt,
    updatedAt,
  } = props;
  let picBuffer;
  if (picture) {
    picBuffer = new Buffer(picture).toString('base64');
    // const uint8array = new TextEncoder("utf-8").encode(picture);
    // picBuffer = new TextDecoder("utf-8").decode(uint8array);
    // picBuffer = btoa(String.fromCharCode(...new Uint8Array(picture.data)));
  }

  return (
    <div>
      {picture && (
        <React.Fragment>
          <p>Image:</p>
          <img src={`data:image/jpeg;base64,${picBuffer}`} alt="Story pic" />
        </React.Fragment>
      )}
      Caption:
      {text}
      Created at:
      {createdAt}
      Last updated at:
      {updatedAt}
    </div>
  );
};

Story.propTypes = {
  text: PropTypes.string,
  picture: PropTypes.any,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
};

export default Story;
