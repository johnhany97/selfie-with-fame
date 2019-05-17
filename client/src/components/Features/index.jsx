import React from 'react';
import './index.css';
import FeatureItem from '../FeatureItem';

const Features = () => (
  <div>
    <div className="container-lg features-container">
      <h3 className="home-features-title">Features</h3>
      <hr className="home-features-dividor" />
    </div>
    <div className="container-lg">
      <div className="item-row">
        <FeatureItem title="Find Events" />
        <FeatureItem title="Capture The Experience" />
        <FeatureItem title="Share Your Story" />
      </div>
    </div>
  </div>
);

export default Features;
