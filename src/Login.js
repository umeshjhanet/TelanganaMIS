import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye'
import { FaUserLarge } from "react-icons/fa6";
import axios from 'axios';
import { API_URL } from './Api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [type, setType] = useState('password');
  const [icon, setIcon] = useState(eyeOff);
  const [errorMessages, setErrorMessages] = useState({});
  const navigate = useNavigate();

  // Error messages
  const errors = {
    username: "Invalid user",
    password: "Invalid password",
    blank: "Please fill in all fields"
  };

  // Function to render error messages
  const renderErrorMessage = (name) =>
  errorMessages[name] && (
    <div className="error mt-1" style={{ marginLeft: '35px' }}>{errorMessages[name]}</div>
  );
  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { uname, password } = event.target.elements;

    // Check for empty fields
    if (!uname.value || !password.value) {
      setErrorMessages({ blank: errors.blank });
      return;
    }

    // Send login request to backend
    try {
      const response = await fetch(`${API_URL}/login`, {
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
      } else if (response.status === 401) {
        setErrorMessages({ username: errors.username }); // Invalid username or email
      } else if (response.status === 403) {
        setErrorMessages({ password: errors.password });
         // Incorrect password
      } else if (response.status === 404) {
        setErrorMessages({ password: errors.username });
      }
      else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  // Toggle password visibility
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
        backgroundImage: `url(${process.env.PUBLIC_URL + '/login-background.png'})`,
        height: "100vh",
        marginTop: "0px",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-lg-5 col-md-6 col-sm-6'></div>
            <div className='col-lg-7 col-md-6 col-sm-6'>
              <div className="form">
                <form onSubmit={handleSubmit}>
                  <div className='login-card'>
                    <div className="password-field mt-4 ms-2">
                      <span className="flex justify-around items-start">
                        <FaUserLarge className="me-2" size={20} color="gray" />
                      </span>
                      <input type='email' name='uname' placeholder='Username' className='password-inputbox' />
                    </div>
                    {renderErrorMessage('username')}
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
                    {renderErrorMessage('blank')}
                    <p className="text-end mt-2 me-3" style={{ color: 'white', fontSize: '14px',fontWeight:'500' }}>Forgot Password ?</p>
                    <input type='submit' className='btn login-btn' placeholder="Log In"></input>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;

