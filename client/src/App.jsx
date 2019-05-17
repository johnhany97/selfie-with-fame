/* eslint-disable react/prop-types */
import React from 'react';

import Layout from './components/Layout';
import './index.css';
import Banner from './components/Banner';
import Features from './components/Features';

const App = (props) => {
  const { home } = props;
  return (
    <Layout title="Festival" home={home}>
      <Banner />
      <Features />
    </Layout>
  );
};

export default App;
