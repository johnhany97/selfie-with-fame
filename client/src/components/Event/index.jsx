import React, { Component } from 'react';
import axios from 'axios';
import {
    cardPanel,
    crudButton,
} from '../../styles/formStyles';
import './index.css';

class Event extends Component {
    render() {
        return (
            <div style={cardPanel}>
                <a href={"/eventPage/" + this.props.id}className="event-title">{this.props.name}</a>
                <p>{this.props.information}</p>
                <p>{this.props.location}</p>
                <p>{this.props.dateTime}</p>
                <div>
                    <a href={`/updateEvent/${this.props.id}`} style={crudButton}>Update</a>
                </div>
            </div>
        )
    }
};

export default Event;