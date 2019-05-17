import React from 'react';
import axios from 'axios';
import DiscoverEvent from './../../DiscoverEvent';
import Event from './../../Event';
import './index.css';


/**
 * @Params
 * none
 * 
 * @summary
 * Displays discover page with most recent events
 * 
 * @returns
 * Returns JSX for displaying most recent events
 */
class DiscoverSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
        }
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
        const {events} = this.state;
        return(
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
        );
    }
}

export default DiscoverSearch;