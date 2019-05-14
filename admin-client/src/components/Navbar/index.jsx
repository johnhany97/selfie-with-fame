import React, { Component } from 'react';
import classNames from 'classnames';
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Button,
} from '@material-ui/core';
import { Menu } from '@material-ui/icons';

class Navbar extends Component {
  render() {
    const {
      open,
      classes,
      title,
      handleDrawerOpen,
    } = this.props;

    return (
      <AppBar
        position="fixed"
        className={classNames(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar disableGutters={!open}>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={handleDrawerOpen}
            className={classNames(classes.menuButton, open && classes.hide)}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" color="inherit" noWrap className={classes.grow}>
            {title ? title : 'Admin Dashboard'}
          </Typography>
          <Button color="inherit" className={!open && classes.loginButton}>Login</Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default Navbar;
