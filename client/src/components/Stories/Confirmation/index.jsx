/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

import Event from '../../Event';

const Confirmation = (props) => {
  const {
    values,
    createStory,
    previousStep,
  } = props;

  return (
    <React.Fragment>
      {values && values.picture && <img id="photo" src={values.picture} alt="Story taken" />}
      {values && values.event && <Event {...values.event} />}
      {values && values.text && <p>{values.text}</p>}
      <button type="button" onClick={createStory}>Submit</button>
      <button type="button" onClick={previousStep}>Back</button>
    </React.Fragment>
  );
};

Confirmation.propTypes = {
  values: PropTypes.object.isRequired,
  createStory: PropTypes.func.isRequired,
  previousStep: PropTypes.func.isRequired,
};

export default Confirmation;
