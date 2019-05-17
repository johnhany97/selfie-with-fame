import React from 'react';
import './index.css';
import '../../images/event-img-placeholder.jpg';

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


/**
 * @Params
 * _id => id of event
 * name => name of event
 * start_date => start date of event
 * 
 * @summary
 * Displays image and text to show summary of event on discover 
 * page.
 * 
 * @returns
 * Returns JSX for component to display event.
 */
class DiscoverEvent extends React.Component {

  convertDateFormat = (date) => {
    const createAtDate = new Date(date);
    const year = createAtDate.getFullYear();
    const month = MONTHS[createAtDate.getMonth()];
    const day = createAtDate.getDate();
    const convertedDate = `${day} ${month} ${year}`;
    return convertedDate;
  }

  render() {
    const {
      _id,
      name,
      start_date,
    } = this.props;

    return (
      <a href={`/eventPage/${_id}`}>
        <div className="discover-event-panel">
          <div className="discover-event-img" />
          <div className="discover-event-info">
            <h4 className="discover-event-date">{this.convertDateFormat(start_date)}</h4>
            <h4 className="discover-event-name">{name}</h4>
          </div>
        </div>
      </a>
    );
  }
}

export default DiscoverEvent;
