import React, { useState, useEffect } from "react";
import GoogleLoginButton from "../components/GoogleLoginButton";
import EmailLogin from "../components/EmailLogin";
import UserProfile from "../components/UserProfile";
import UserService from "../services/UserService";
import './ProfilePageStyle.css';

const ProfilePage = () => {
  const [token, setToken] = useState(localStorage.getItem('access_token'));

  const logout = () => {
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('access_token_expires_in');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
    window.location.reload();
  }

  useEffect(() => {
    const checkForToken = () => {
      if(!token){
        const storedToken = localStorage.getItem('access_token');
        if (storedToken) {
          setToken(storedToken);
          UserService.setTokens();
        } else {
          const accessTokenCookie = document.cookie.split(';').find(row => row.trim().startsWith('access_token='));
          if (accessTokenCookie) {
            const accessToken = accessTokenCookie.split('=')[1];
            setToken(accessToken);
            UserService.setTokens();
          }
        }
      }
      if(!token){
        setTimeout(checkForToken, 100); // wait 100ms before checking again
      }
    };

    checkForToken();
  }, [token]);

  return (
    <div className="center-content">
      {token ? (
        <>
          <UserProfile />
          <button className="logout-button" onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <EmailLogin />
          <hr />
          <GoogleLoginButton />
        </>
      )}
    </div>
  );
};

export default ProfilePage;