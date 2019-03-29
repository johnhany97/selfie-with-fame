import React from 'react';
import PropTypes from 'prop-types';

const Header = (props) => {
  const { title, bio} = props;
  return (
    <div>
      <h1>
        {title}
      </h1>
      <p>
        {bio}
      </p>
    </div>
  );
};

Header.propTypes = {
  title: PropTypes.string,
};

Header.defaultProps = {
  title: '',
};

export default Header;
