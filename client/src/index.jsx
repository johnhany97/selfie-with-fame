import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import './index.css';

import App from './App';
import NotFound from './components/NotFound';

import LoginPage from './pages/Users/LoginPage';
import RegisterPage from './pages/Users/RegisterPage';
import ResetPasswordPage from './pages/Users/ResetPasswordPage';
import ForgotPasswordPage from './pages/Users/ForgotPasswordPage';
import ProfilePage from './pages/Users/ProfilePage';
import UpdateProfilePage from './pages/Users/UpdateProfilePage';
import UpdatePasswordPage from './pages/Users/UpdatePasswordPage';

import CreateEventPage from './pages/Events/CreateEventPage';
import DisplayEventsPage from './pages/Events/DisplayEventsPage';
import UpdateEventPage from './pages/Events/UpdateEventPage';
import EventPage from './pages/Events/EventPage';
import GoogleMap from './pages/GoogleMap';

import CreateStoryPage from './pages/Stories/CreateStoryPage';

import DB from './db/db';
import DiscoverPage from './pages/DiscoverPage';
import Teapot from './components/Teapot';
import UserProfile from './components/UserProfile';

// check for support indexeddb support;
let db = null;
if ('indexedDB' in window) {
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
      <Route exact path="/discover" component={DiscoverPage} />
      <Route exact path="/createEvent" component={CreateEventPage} />
      <Route exact path="/events" component={DisplayEventsPage} />
      <Route exact path="/updateEvent/:_id" component={UpdateEventPage} />
      <Route exact path="/eventPage/:_id" component={EventPage} />
      <Route path="/createStory" component={CreateStoryPage} />
      <Route exact path="/mapTest" component={GoogleMap} />
      <Route exact path="/brewCoffee" component={Teapot} />
      <Route exact path="/user/:username" component={UserProfile} />
      <Route component={NotFound} />
    </Switch>
  </Router>
);

ReactDOM.render(routing, document.getElementById('root'));
