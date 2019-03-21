import React, { Component } from 'react';

import Layout from './components/Layout';

class App extends Component {
  componentWillMount() {
    fetch('/api')
      .then(res => res.json());
    // .then((json) => {
    //   console.log(JSON.stringify(json));
    // });
  }

  render() {
    return (
      <Layout>
        some content
      </Layout>
    );
  }
}

export default App;
