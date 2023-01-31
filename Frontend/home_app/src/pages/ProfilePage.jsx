import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import './ProfilePageStyle.css';

const ProfilePage = () => {
  const location = useLocation();
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    setToken(token);
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://petonet.ddns.net:5001/api/users/1', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        const json = await res.json();
        setUserInfo(json);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [token]);
  

  

  return (
    <div className="top">
      {token ? (
        <div>
          <p>The token is: {token}</p>
          <p>The user is: {userInfo.userName}</p>
        </div>
      ) : (
        <a href="https://accounts.google.com/o/oauth2/v2/auth?client_id=343546592830-dnjbabc9apodjc7q4kugaorq4iiti4ci.apps.googleusercontent.com&redirect_uri=http://petonet.ddns.net:5001/api/users/auth&scope=https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/userinfo.email&response_type=code">
          Sign in with Google
        </a>
      )}
    </div>
  );
};

export default ProfilePage;
