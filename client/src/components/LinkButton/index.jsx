import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

import { linkStyle } from '../../styles/buttonStyles';

const LinkButton = ({ buttonText, buttonStyle, link }) => (
  <Fragment>
    <Link
      style={linkStyle}
      to={link}
    >
      <Button
        variant="contained"
        color="primary"
        style={buttonStyle}
      >
        {buttonText}
      </Button>
    </Link>
  </Fragment>
);

LinkButton.propTypes = {
  buttonText: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  buttonStyle: PropTypes.object.isRequired,
  link: PropTypes.string,
};

LinkButton.defaultProps = {
  link: '/',
  buttonText: 'Button',
};

export default LinkButton;
