import React from 'react';

import Layout from '../Layout';
import TeapotImage from './teapot.jpg';

const styles = {
  backgroundImage: `url(${TeapotImage})`,
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
  width: '100%',
};

const Teapot = () => (
  <Layout>
    <div className="container-fluid">
      <div className="row">
        <div style={styles} />
      </div>
    </div>
  </Layout>
);

export default Teapot;
