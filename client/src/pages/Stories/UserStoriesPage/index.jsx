import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import Layout from '../../../components/Layout';
import Story from '../../../components/Stories/Story';

class UserStoriesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stories: [],
      error: false,
      errorMessage: '',
    };
  }

  componentWillMount() {
    const token = localStorage.getItem('JWT');
    if (token === null) {
      // eslint-disable-next-line react/prop-types
      const { history } = this.props;
      history.replaceState(null, '/login');
    }
  }

  componentDidMount() {
    this.getUserStories();
  }

  getUserStories = () => {
    const token = localStorage.getItem('JWT');
    axios.get('/api/stories', {
      headers: {
        Authorization: `JWT ${token}`,
      },
    })
      .then((res) => {
        this.setState({
          stories: res.data.stories,
        });
      })
      .catch(() => {
        this.setState({
          error: true,
          errorMessage: 'Error fetching user stories',
        });
      });
  }

  render() {
    const {
      stories,
      error,
      errorMessage,
    } = this.state;
    return (
      <Layout title="User stories">
        {error && <h1>{errorMessage}</h1>}
        {!error && stories && stories.map(story => <Story {...story} />)}
      </Layout>
    );
  }
}

export default withRouter(UserStoriesPage);
