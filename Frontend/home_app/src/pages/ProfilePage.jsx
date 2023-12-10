import React, { useState, useEffect } from "react";
import GoogleLoginButton from "../components/GoogleLoginButton";
import EmailLogin from "../components/EmailLogin";
import './ProfilePageStyle.css';

const ProfilePage = () => {
  const [token, setToken] = useState(localStorage.getItem('access_token'));

  useEffect(() => {
    const checkForToken = () => {
      if(!token){
        const storedToken = localStorage.getItem('access_token');
        if (storedToken) {
          setToken(storedToken);
        } else {
          const accessTokenCookie = document.cookie.split(';').find(row => row.trim().startsWith('access_token='));
          if (accessTokenCookie) {
            const accessToken = accessTokenCookie.split('=')[1];
            setToken(accessToken);
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
    <div className="top">
      {token ? (
        <div>
          <p>The token is: {token}</p>
        </div>
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
