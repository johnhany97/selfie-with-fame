/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react';

import Layout from './components/Layout';
import { STORIES_STORE_NAME } from './db/db';

const App = (props) => {
  // props.db.set(STORIES_STORE_NAME, {
  //   postedBy: 'test',
  //   text: 'test',
  //   picture: 'pic',
  // }).then((e) => {
  //   console.log(e);
  // }).catch((e) => {
  //   console.log(e);
  // });
  // props.db.getAllStories().then(e => console.log(e));
  return (
    <Layout title="Festival">
      test
    </Layout>
  );
};

export default App;
