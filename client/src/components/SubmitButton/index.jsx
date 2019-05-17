import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

/**
 * @Params
 * buttonText => text to display on button
 * buttonStyle => custom button styling
 * 
 * @summary
 * Displays a custom submit button with custom styling
 * 
 * @returns
 * Returns JSX for submit button
 * a text field
 */
const SubmitButton = (props) => {
  const { buttonText, buttonStyle } = props;
  return (
    <Fragment>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        style={buttonStyle}
      >
        {buttonText}
      </Button>
    </Fragment>
  );
};

SubmitButton.propTypes = {
  buttonText: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  buttonStyle: PropTypes.object.isRequired,
};

export default SubmitButton;
