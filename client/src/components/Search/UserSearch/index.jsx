import React from 'react';
import axios from 'axios';
import UserCard from './../../UserCard';
import './index.css';
import { TextField } from '@material-ui/core';

class UserSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            userSearchQuery: '',
        }
    }

    async componentDidMount() {
        await this.getUsers();
    }

    handleChange = (event) => {
        this.setState({userSearchQuery: event.target.value});
        this.getUsers();
    }

    getUsers = async () => {
        const token = localStorage.getItem('JWT');
        if (token == null) {
            this.setState({
                error: true,
                // isLoading: false,
            });
            return;
        }
        axios.get('/api/users', {
            params: {
                username: this.state.userSearchQuery,
            },
            headers: {
                Authorization: `JWT ${token}`,
            },
        }).then((res) => {
            const { data } = res;
            const {
                users,
            } = data;
            this.setState({
                users,
                error: false,
            });
        }).catch((err) => {
            console.error(err.response.data);
            this.setState({
                error: true,
            });
        });
    }


    render() {
        const {users} = this.state;
        return(
            <div className="container-lg user-search-container">
                <TextField
                id="user-search"
                className="user-search"
                placeholder="Search"
                margin="normal"
                onChange={this.handleChange}
                />
                <div className="user-search-results">
                    {users && users.map(user => <UserCard {...user} />)}
                </div>
            </div>
        );
    }
}

export default UserSearch;