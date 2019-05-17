import React from 'react';
import './index.css';
import Layout from '../../components/Layout';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DiscoverSearch from '../../components/Search/DiscoverSearch';
import UserSearch from '../../components/Search/UserSearch';

class DiscoverPage extends React.Component {
  constructor(props) {
    super(props);

<<<<<<< HEAD
        this.state = {
            value: 0,
        }
    }

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
                                <Tab label="Stories" />
                            </Tabs>
                        </div>
                    </AppBar>
                    {value === 0 && <DiscoverSearch />}
                    {value === 1 && <div>Events</div>}
                    {value === 2 && <UserSearch />}
                    {value === 3 && <div>Stories</div>}
                </div>
            </Layout>
        );
    }
}


export default DiscoverPage;
=======
    this.state = {
      events: [],
    };
  }

  async componentDidMount() {
    await this.getEvents();
  }

  getEvents = async () => {
    const token = localStorage.getItem('JWT');
    if (token == null) {
      this.setState({
        error: true,
        // isLoading: false,
      });
      return;
    }
    axios.get('/api/events/getEvents', {
      params: {
      },
      headers: {
        Authorization: `JWT ${token}`,
      },
    }).then((res) => {
      const { data } = res;
      const {
        events,
      } = data;
      this.setState({
        events,
        // isLoading: false,
        error: false,
        // event_deleted,
      });
    }).catch((err) => {
      console.error(err.response.data);
      this.setState({
        error: true,
      });
    });
  }


  render() {
    const { events } = this.state;
    return (
      <Layout title="Event page">
        <div className="container-lg discover-container">
          <h3 className="discover-heading">Discover the lastest events</h3>
          <div className="container-discover-events scrolling-wrapper">
            {events && events.map(event => <DiscoverEvent key={event._id} {...event} />)}
          </div>
          <h3 className="discover-heading">Discover an event near you</h3>
          <div className="event-results">
            {events.map(event => (
              <div className="event-container">
                <Event
                  key={event._id}
                  {...event}
                />
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }
}

export default DiscoverPage;
>>>>>>> 39e56ce1bb6eb5820e9ca515082bf0c033244360
