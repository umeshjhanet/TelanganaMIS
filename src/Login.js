import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye'
import { FaUserLarge } from "react-icons/fa6";
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [type, setType] = useState('password');
  const [icon, setIcon] = useState(eyeOff);
  const [userDB, setUserDB] = useState([]);
  const [errorMessages, setErrorMessages] = useState({});
  const navigate = useNavigate();
  const [logoutTimer, setLogoutTimer] = useState(null);

  useEffect(() => {
    // console.log("Setting up logout timer...");
  
    const resetTimeout = () => {
      if (logoutTimer) clearTimeout(logoutTimer);
      const timer = setTimeout(() => {
        console.log("Logging out due to inactivity...");
        logout();
      }, 9000000); // 3 minutes
      setLogoutTimer(timer);
    };
  
    const events = [
      "mousemove",
      "keydown",
      "mousedown",
      "touchstart",
      "scroll",
      "wheel"
    ];
  
    const resetTimeoutHandler = () => {
      // console.log("Resetting logout timer...");
      resetTimeout();
    };
  
    for (const event of events) {
      window.addEventListener(event, resetTimeoutHandler);
    }
  
    resetTimeout();
  
    return () => {
      // console.log("Cleaning up logout timer...");
      if (logoutTimer) clearTimeout(logoutTimer);
      for (const event of events) {
        window.removeEventListener(event, resetTimeoutHandler);
      }
    };
  }, [logoutTimer]);
  
  

  const logout = () => {
    console.log('Logging out due to inactivity.');
    navigate('/');
  };

  const errors = {
    username: "Invalid username",
    password: "Invalid password"
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { uname, password } = event.target.elements;
  
    // Send login request to backend
    try {
      const response = await fetch("http://192.168.10.41:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user_email_id: uname.value, password: password.value })
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Data received from backend:", data);
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/dashboard');
      }  
      else {
        if (response.status === 401) {
          setError(errors.username); // Invalid username
        } else if (response.status === 403) {
          setError(errors.password); // Incorrect password
        } else {
          setError("An unexpected error occurred. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An unexpected error occurred. Please try again later.");
    }
  };
  

  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error mt-1" style={{ marginLeft: '35px' }}>{errorMessages.message}</div>
    );

  const handleToggle = () => {
    if (type === 'password') {
      setIcon(eye);
      setType('text');
    } else {
      setIcon(eyeOff);
      setType('password');
    }
  };

  return (
    <div className="">
      <div style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + '/login_image.png'})`,
        height: "100vh",
        marginTop: "0px",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}>
        <div className='container-fluid'>
          <div className="form">
            <form onSubmit={handleSubmit}>
              <div className='login-card'>
                <div className="row">
                  <div className="sign-in text-center">
                    <h1 style={{ fontSize: '30px' }}>SIGN IN</h1>
                  </div>
                </div>
                <div className="password-field mt-4 ms-2">
                  <span className="flex justify-around items-start">
                    <FaUserLarge className="me-2" size={20} color="gray" />
                  </span>
                  <input type='email' name='uname' placeholder='Username' className='password-inputbox' />
                </div>
                {renderErrorMessage('uname')}
                <div className="password-field mt-3 ms-2">
                  <span className="flex justify-around items-start" onClick={handleToggle}>
                    <Icon className="absolute me-2" icon={icon} size={20} style={{ color: 'gray' }} />
                  </span>
                  <input
                    type={type}
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="password-inputbox"
                  />
                </div>
                {renderErrorMessage('password')}
                <p className="text-end mt-2 me-3" style={{ color: 'red', fontSize: '14px' }}>Forgot Password ?</p>
                <input type='submit' className='btn login-btn' placeholder="Log In"></input>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;
