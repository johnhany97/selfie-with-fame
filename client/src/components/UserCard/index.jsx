import React from 'react';
import './index.css';
import profilePlaceholder from './../../images/event-img-placeholder.jpg';

const UserCard = (props) => {
    const {_id, username, bio} = props;
    return(
        <a href={`/users/${_id}`}>
            <div className="user-card-container">
                <img className="user-card-profile" src={profilePlaceholder} alt="User Profile Picture"/>
                <div className="user-card-info">
                    <h4 className="user-card-username">{username}</h4>
                    <p className="user-card-bio">{bio}</p>
                </div>
            </div>
        </a>
    )
}

export default UserCard;