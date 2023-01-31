import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton";
import './ProfilePageStyle.css';

const ProfilePage = () => {
  const location = useLocation();
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState([]);

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
        <GoogleLoginButton>
        </GoogleLoginButton>
      )}
    </div>

  );
};

export default ProfilePage;
