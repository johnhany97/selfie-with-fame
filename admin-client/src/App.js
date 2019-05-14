import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { blue } from '@material-ui/core/colors';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import DashboardHome from './pages/DashboardHome';
import Error404 from './pages/Error404';

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
  status: {
    danger: 'orange',
  },
  typography: {
    useNextVariants: true,
  },
});

const App = () => {
  return (
    <Router>
      <MuiThemeProvider theme={theme}>
        <Switch>
          <Route exact path="/" component={DashboardHome} />
          <Route path="*" component={Error404} />
        </Switch>
      </MuiThemeProvider>
    </Router>
  );
};

export default App;
