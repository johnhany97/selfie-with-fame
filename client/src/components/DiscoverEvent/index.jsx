import React from 'react';
import './index.css';
import './../../images/event-img-placeholder.jpg';

class DiscoverEvent extends React.Component {
    constructor(props) {
        super(props);
    }

    convertDateFormat(date) {
        let createAtDate = new Date(date);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = createAtDate.getFullYear();
        var month = months[createAtDate.getMonth()];
        var date = createAtDate.getDate();
        var convertedDate = date + ' ' + month + ' ' + year;
        return convertedDate;
    }

    render() {
        const {
            _id,
            event_name,
            date_time,
        } = this.props;

        return (
            <a href={`/eventPage/${_id}`}>
                <div className="discover-event-panel">
                    <div className="discover-event-img" />
                    <div className="discover-event-info">
                        <h4 className="discover-event-date">{this.convertDateFormat(date_time)}</h4>
                        <h4 className="discover-event-name">{event_name}</h4>
                    </div>
                </div>
            </a>
        );
    }
}

export default DiscoverEvent;