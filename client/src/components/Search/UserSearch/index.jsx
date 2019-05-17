import React from 'react';
import axios from 'axios';
import UserCard from './../../UserCard';
import { TextField } from '@material-ui/core';
import searchButton from './../../../images/round-search.png';
import './index.css';

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
    }

    handleClick = (e) => {
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
                text: this.state.userSearchQuery,
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
                <div className="user-search-row">

                    <TextField
                    id="user-search"
                    className="user-search"
                    placeholder="Search"
                    margin="normal"
                    onChange={this.handleChange}
                    />
                    <button className="search-btn-user" onClick={this.handleClick}>
                        <img className="search-icon" src={searchButton} alt="Search Location Button"/>
                    </button>
                </div>
                <div className="user-search-results">
                    {users && users.map(user => <UserCard {...user} />)}
                </div>
            </div>
        );
    }
}

export default UserSearch;