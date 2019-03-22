import React from 'react';
import PropTypes from 'prop-types';

const Header = (props) => {
  const { title } = props;
  return (
    <h1>
      {title}
    </h1>
  );
};

Header.propTypes = {
  title: PropTypes.string,
};

Header.defaultProps = {
  title: '',
};

export default Header;
