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
  const pic = Buffer.from(picture, 'base64');

  return (
    <div>
      Image:
      <img src={pic} alt="Story pic" />
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
