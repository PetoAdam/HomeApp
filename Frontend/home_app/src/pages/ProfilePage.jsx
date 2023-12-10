import React, { useState, useEffect } from "react";
import GoogleLoginButton from "../components/GoogleLoginButton";
import EmailLogin from "../components/EmailLogin";
import './ProfilePageStyle.css';

const ProfilePage = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userInfo, setUserInfo] = useState([]);

  useEffect(() => {
    if(!token){
      const checkForCookie = () => {
        const token = document.cookie
          .split("; ")
          .find(row => row.startsWith("access_token="))
          ?.split("=")[1];
        if (token) {
          setToken(token);
          localStorage.setItem('token', token);
        } else {
          setTimeout(checkForCookie, 100); // wait 100ms before checking again
        }
      };
      checkForCookie();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          const res = await fetch('https://homeapp.ddns.net/api/users/1', {
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
    }
  }, [token]);
  

  

  return (
    <div className="top">
      {token ? (
        <div>
          <p>The token is: {token}</p>
          <p>The user is: {userInfo.userName}</p>
        </div>
      ) : (
        <>
          <EmailLogin>
          </EmailLogin>

          <hr />

          <GoogleLoginButton>
          </GoogleLoginButton>
        </>
      )}
    </div>

  );
};

export default ProfilePage;
