import React from 'react';
import PropTypes from 'prop-types';

import Story from '../../../components/Stories/Story';

const StoryDetails = (params) => {
  const { story } = params;
  return (
    <Story {...story} />
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
