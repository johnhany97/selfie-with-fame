/* eslint-disable prefer-template */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import React from 'react';
import './index.css';

const FormProgress = (props) => {
  const {
    step,
    size,
  } = props;
  return (
    <ul className="form-progress-container">
      {[...Array(size)].map((_, i) => <li key={i} className={'form-progress-pill ' + (i < step ? 'highlighted' : 'blah')} />)}
    </ul>
  );
};

export default FormProgress;
