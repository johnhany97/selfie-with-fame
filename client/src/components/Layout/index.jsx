/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from '@material-ui/core';

import Header from '../Header';
import Footer from '../Footer';
import CustomSnackbar from '../CustomSnackbar';

const Layout = (props) => {
  const {
    title,
    children,
    snackbarOpen,
    snackbarHandleClose,
    snackbarVariant,
    snackbarMessage,
  } = props;
  return (
    <React.Fragment>
      <Header title={title} />
      <div className="content">
        {children}
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={snackbarHandleClose}
      >
        <CustomSnackbar
          onClose={snackbarHandleClose}
          variant={snackbarVariant}
          message={snackbarMessage}
        />
      </Snackbar>
      <Footer />
    </React.Fragment>
  );
};

Layout.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  snackbarMessage: PropTypes.string,
  snackbarVariant: PropTypes.oneOf(['success', 'warning', 'error', 'info']),
  snackbarHandleClose: PropTypes.func,
  snackbarOpen: PropTypes.bool,
};

Layout.defaultProps = {
  title: '',
  children: null,
  snackbarOpen: false,
  snackbarMessage: '',
  snackbarVariant: 'info',
};

export default Layout;
