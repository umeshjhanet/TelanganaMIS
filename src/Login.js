import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';
import { FaUserLarge } from "react-icons/fa6";
import axios from 'axios';
import { API_URL } from './Api';
import PasswordModal from './Components/PasswordModal';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessages, setErrorMessages] = useState({});
  const [type, setType] = useState('password');
  const [icon, setIcon] = useState(eyeOff);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isChangePasswordRequired, setIsChangePasswordRequired] = useState(false);
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check for empty fields
    if (!username || !password) {
      setErrorMessages({ blank: errors.blank });
      return;
    }

    // Send login request to backend
    try {
      const response = await axios.post(`${API_URL}/login`, {
        user_email_id: username,
        password: password
      });

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('user', JSON.stringify(data));

        // Set the userId and changePasswordRequired flag for the password modal
        setUserId(data.user_id);
        setIsChangePasswordRequired(data.isChangePasswordRequired);

        if (data.isChangePasswordRequired) {
          setIsModalOpen(true); // Show password modal after login
        } else {
          navigateToDestination();
        }
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          setErrorMessages({ password: errors.password }); // Invalid username or password
        } else if (status === 403) {
          setErrorMessages({ password: errors.password }); // Incorrect password
        } else if (status === 404) {
          setErrorMessages({ username: errors.username });
        } else {
          setErrorMessages({ unexpected: "An unexpected error occurred. Please try again later." });
        }
      } else {
        setErrorMessages({ unexpected: "An unexpected error occurred. Please try again later." });
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigateToDestination();
  };

  const navigateToDestination = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.user_roles && user.user_roles.includes("Cbsl User")) {
      navigate('/uploadDatabase');
    } else if (user && user.user_roles && user.user_roles.includes("Client")) {
      navigate('/locationwisereport');
    } else {
      navigate('/dashboard')
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
    <>
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
                        <input
                          type='email'
                          name='uname'
                          placeholder='Username'
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className='password-inputbox'
                        />
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
                      <p className="text-end mt-2 me-3" style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>Forgot Password?</p>
                      <input type='submit' className='btn login-btn' placeholder="Log In" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && <PasswordModal onClose={handleCloseModal} userId={userId} />}
      <ToastContainer />
    </>
  );
};

export default Login;
