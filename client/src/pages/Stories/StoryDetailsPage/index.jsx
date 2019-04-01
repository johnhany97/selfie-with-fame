import React from 'react';
import PropTypes from 'prop-types';

const StoryDetails = (params) => {
  const { story } = params;
  const {
    text,
    picture,
    createdAt,
    updatedAt,
  } = story;
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

StoryDetails.propTypes = {
  story: PropTypes.shape({
    text: PropTypes.string,
    picture: PropTypes.any,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
};

export default StoryDetails;
