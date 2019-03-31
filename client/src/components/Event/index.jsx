import React, { Component } from 'react';
import axios from 'axios';
import {
    cardPanel,
    crudButton,
} from '../../styles/formStyles';

class Event extends Component {
    constructor(props) {
        super(props);
    }

    deleteEvent = (_id) => {
        const token = localStorage.getItem('JWT');
        if (token === null) {
            this.setState({
                isLoading: false,
                error: true,
            });
            return;
        }
        axios.delete('/api/events/deleteEvent', {
            params: {
                _id: _id,
            },
            headers: {
                Authorization: `JWT ${token}`,
            },
        }).then((res) => {
            console.log(res);
            this.getEvents();
        }).catch((err) => {
            console.error(err.response.data);
            this.setState({
                error: true,
            });
        });
    }

    render() {
        return (
            <div style={cardPanel}>
                <h3>{this.props.name}</h3>
                <p>{this.props.information}</p>
                <p>{this.props.location}</p>
                <p>{this.props.dateTime}</p>
                <div>
                    <a href={`/updateEvent/${this.props.id}`} style={crudButton}>Update</a>
                    <button onClick={() => this.deleteEvent(this.props.id)} style={crudButton}>Delete</button>
                </div>
            </div>
        )
    }
};

export default Event;