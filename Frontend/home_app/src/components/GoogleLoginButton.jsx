import React from "react";
import './GoogleLoginButtonStyle.css';

const GoogleLoginButton = () => {
  return (
    <a href="https://accounts.google.com/o/oauth2/v2/auth?client_id=343546592830-dnjbabc9apodjc7q4kugaorq4iiti4ci.apps.googleusercontent.com&redirect_uri=https://homeapp.ddns.net/api/users/auth/google&scope=https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/userinfo.email&response_type=code"
       className="google-login-button">
      <img
        alt="Google sign-in"
        src="https://homeapp.ddns.net/images/google_login.png"
        className="google-login-image"
      />
    </a>
  );
};

export default GoogleLoginButton;
