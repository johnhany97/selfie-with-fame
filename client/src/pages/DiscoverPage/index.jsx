import React from 'react';
import './index.css';
import Layout from '../../components/Layout';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DiscoverSearch from '../../components/Search/DiscoverSearch';
import UserSearch from '../../components/Search/UserSearch';
import DiscoverSearchEvents from '../../components/Search/DiscoverSearchEvents';

class DiscoverPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0,
            city: 'Sheffield',
            

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
                                <Tab label="Stories" />
                            </Tabs>
                        </div>
                    </AppBar>
                    {value === 0 && <DiscoverSearch />}
                    {value === 1 && <DiscoverSearchEvents
                        handleCityChange= {this.handleCityChange} 
                        handleLocationChange = {this.handleLocationChange}
                        handleEventChange = {this.props.handleEventChange}
                        topLevelEvent = {this.props.topLevelEvent} />}
                    {value === 2 && <UserSearch />}
                    {value === 3 && <div>Stories</div>}
                </div>
            </Layout>
        );
    }
}


export default DiscoverPage;