import React from 'react';
import './index.css';
import profilePlaceholder from './../../images/event-img-placeholder.jpg';

const UserCard = (props) => {
    const {} = props;
    return(
        <div className="user-card-container">
            <img className="user-card-profile" src={profilePlaceholder} alt="User Profile Picture"/>
            <div className="user-card-info">
                <h4 className="user-card-username">Test Username</h4>
                <p className="user-card-bio">This is test bio that is the only purpose is to be very very very long and doesn't actually contain any useful information about this person infact they don't even exist why are there no commas or full stops in this sentence.</p>
            </div>
        </div>
    )
}

export default UserCard;