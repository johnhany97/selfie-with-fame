import React, { Component } from 'react';

import Layout from './components/Layout';

class App extends Component {
  async componentWillMount() {
    fetch('/api')
      .then(res => res.json());
    // .then((json) => {
    //   console.log(JSON.stringify(json));
    // });
  }

  render() {
    return (
      <Layout>
        test
      </Layout>
    );
  }
}

export default App;
