import React, { useEffect, useState } from 'react';
import './UserProfileStyle.css';
import UserService from '../services/UserService';
import Loading from './Loading';

const UserProfile = () => {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkForUserId = () => {
      if(!userId){
        setUserId(localStorage.getItem('user_id') || null);
      }
      if(!userId){
        setTimeout(checkForUserId, 100); // wait 100ms before checking again
      } else {
        UserService.getUserInfo(userId)
        .then(response => setUserData(response))
        .catch(error => console.error('Error fetching user data:', error));
      }
    };

    checkForUserId();
  }, [userId]);



  if (!userData) {
    // Render loading state or handle accordingly
    return <Loading />;
  }

  return (
    <div className="user-profile">
      <div className="welcome-message">
        <h1>Welcome back, {userData.userName}!</h1>
      </div>
      <div className="user-data-card">
        <div className="user-data-row">
          <span className="user-data-key">Username:</span>
          <span className="user-data-value">{userData.userName}</span>
        </div>
        <div className="user-data-row">
          <span className="user-data-key">Email Confirmed:</span>
          <span className="user-data-value">{userData.emailConfirmed ? 'Yes' : 'No'}</span>
        </div>
        <div className="user-data-row">
          <span className="user-data-key">Two Factor Enabled:</span>
          <span className="user-data-value">{userData.twoFactorEnabled ? 'Yes' : 'No'}</span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;