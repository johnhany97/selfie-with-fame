import React from 'react';
import PropTypes from 'prop-types';

import Header from '../Header';
import Footer from '../Footer';

const Layout = (props) => {
  const { title, children } = props;
  return (
    <React.Fragment>
      <Header title={title} bio="Hello111"/>
      {children}
      <Footer />
    </React.Fragment>
  );
};

Layout.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

Layout.defaultProps = {
  title: '',
  children: null,
};

export default Layout;
