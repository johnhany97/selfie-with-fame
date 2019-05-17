/* eslint-disable react/prop-types */
import React from 'react';
import './index.css';
import profilePlaceholder from '../../images/event-img-placeholder.jpg';

/**
 * @Params
 * _id => id of user
 * username => username of user
 * bio => bio of user
 * 
 * @summary
 * Displays a custom component for a user card showing the user image,
 * username and user bio
 * 
 * @returns
 * Returns JSX component to display user information
 */
const UserCard = (props) => {
  const {
    username,
    bio,
  } = props;
  return (
    <a href={`/user/${username}`}>
      <div className="user-card-container">
        <img className="user-card-profile" src={profilePlaceholder} alt="User Profile" />
        <div className="user-card-info">
          <h4 className="user-card-username">{username}</h4>
          <p className="user-card-bio">{bio}</p>
        </div>
      </div>
    </a>
  );
};

export default UserCard;
