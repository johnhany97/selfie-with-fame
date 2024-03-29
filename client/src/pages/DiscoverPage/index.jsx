/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import './index.css';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withRouter } from 'react-router-dom';

import Layout from '../../components/Layout';
import DiscoverSearch from '../../components/Search/DiscoverSearch';
import UserSearch from '../../components/Search/UserSearch';
import DiscoverSearchEvents from '../../components/Search/DiscoverSearchEvents';

class DiscoverPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  componentWillMount() {
    const token = localStorage.getItem('JWT');
    if (!token) {
      const { history } = this.props;
      history.replace('/');
    }
  }

  handleCityChange = (data) => {
    this.setState({
      city: data,
    });
  };

  handleLocationChange = (data) => {
    this.setState({
      location: data,
    });
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    return (
      <Layout title="Event page">
        <div>
          <AppBar position="static">
            <div className="container-lg">
              <Tabs value={value} onChange={this.handleChange}>
                <Tab label="Discover" />
                <Tab label="Events" />
                <Tab label="People" />
              </Tabs>
            </div>
          </AppBar>
          {value === 0 && <DiscoverSearch />}
          {value === 1 && (
            <DiscoverSearchEvents
              handleCityChange={this.handleCityChange}
              handleLocationChange={this.handleLocationChange}
              handleEventChange={this.props.handleEventChange}
              topLevelEvent={this.props.topLevelEvent}
            />
          )}
          {value === 2 && <UserSearch />}
        </div>
      </Layout>
    );
  }
}


export default withRouter(DiscoverPage);
