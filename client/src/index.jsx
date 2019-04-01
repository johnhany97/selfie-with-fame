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
import UpdateEventPage from './pages/UpdateEventPage';
import EventPage from './pages/EventPage';
import GoogleMap from './pages/GoogleMap';

import CreateStoryPage from './pages/Stories/CreateStoryPage';

import DB from './db/db';

// check for support indexeddb support;
let db = null;
if ('indexedDB' in window) {
  console.log('another yet');
  db = new DB();
} else {
  console.log('This browser doesn\'t support IndexedDB');
}

const routing = (
  <Router>
    <Switch>
      <Route exact path="/" component={() => <App db={db} />} />
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/register" component={RegisterPage} />
      <Route exact path="/reset/:token" component={ResetPasswordPage} />
      <Route exact path="/forgotPassword" component={ForgotPasswordPage} />
      <Route exact path="/userProfile/:username" component={ProfilePage} />
      <Route exact path="/updateUser/:username" component={UpdateProfilePage} />
      <Route exact path="/updatePassword/:username" component={UpdatePasswordPage} />
      <Route exact path="/createEvent" component={CreateEventPage} />
      <Route exact path="/events" component={DisplayEventsPage} />
      <Route exact path="/updateEvent/:_id" component={UpdateEventPage} />
      <Route exact path="/eventPage/:_id" component={EventPage} />
      <Route path="/createStory" component={CreateStoryPage} />
      <Route exact path="/mapTest" component={GoogleMap} />
      <Route component={NotFound} />
    </Switch>
  </Router>
);

ReactDOM.render(routing, document.getElementById('root'));
