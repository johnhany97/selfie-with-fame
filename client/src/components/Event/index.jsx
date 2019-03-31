import React, { Component } from 'react';
import axios from 'axios';
import {
    cardPanel,
    crudButton,
} from '../../styles/formStyles';

class Event extends Component {
    render() {
        return (
            <div style={cardPanel}>
                <h3>{this.props.name}</h3>
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