import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import './index.css';

import App from './App';
import NotFound from './components/NotFound';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import UpdateProfilePage from './pages/UpdateProfilePage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';

import CreateEventPage from './pages/CreateEventPage';
import DisplayEventsPage from './pages/DisplayEventsPage';


import * as serviceWorker from './serviceWorker';


const routing = (
  <Router>
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/register" component={RegisterPage} />
      <Route exact path="/reset/:token" component={ResetPasswordPage} />
      <Route exact path="/forgotPassword" component={ForgotPasswordPage} />
      <Route exact path="/userProfile/:username" component={ProfilePage} />
      <Route exact path="/updateUser/:username" component={UpdateProfilePage} />
      <Route exact path="/updatePassword/:username" component={UpdatePasswordPage} />
      <Route exact path="/createEvent" component={CreateEventPage} />
      <Route exact path="/events" component={DisplayEventsPage} />



      <Route component={NotFound} />
    </Switch>
  </Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
