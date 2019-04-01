/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react';

import Layout from './components/Layout';
import { STORIES_STORE_NAME } from './db/db';
import './index.css';
import {
  homePageButton,
} from './styles/buttonStyles';

const App = (props) => {
  return (
    <Layout title="Festival">
      <div className="front-page">
        <a href="/events" style={homePageButton}>Events</a>
      </div>
    </Layout>
  );
};

export default App;
