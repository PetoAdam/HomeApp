import React from "react";
import './GoogleLoginButtonStyle.css';

const GoogleLoginButton = () => {
  return (
    <a href="https://accounts.google.com/o/oauth2/v2/auth?client_id=343546592830-dnjbabc9apodjc7q4kugaorq4iiti4ci.apps.googleusercontent.com&redirect_uri=http://petonet.ddns.net/api/users/auth/google&scope=https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/userinfo.email&response_type=code">
        <button className="google-login-button">
        <div className="left">
            <img
            width="20px"
            style={{ marginTop: "7px", marginRight: "8px" }}
            alt="Google sign-in"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
            />
        </div>
        Login with Google
        </button>
    </a>
  );
};

export default GoogleLoginButton;
