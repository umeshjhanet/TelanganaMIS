import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye'
import { FaUserLarge } from "react-icons/fa6";
import axios from 'axios';


const Login = () => {
  const [errorMessages, setErrorMessages] = useState({});
  const [password, setPassword] = useState("");
  const [type, setType] = useState('password');
  const [icon, setIcon] = useState(eyeOff);
  const [userDB, setUserDB] = useState();
  const navigate = useNavigate();
  
  let API = "http://localhost:5000/users";
  // let API = "https://backend-nodejs-nine.vercel.app/users"
  const fetchAPIData = async(url) => {
    try{
      const res = await fetch(url);
      const data = await res.json();
      console.log("API response",data)
      setUserDB(data);
    }
    catch(error){
      console.log(error);
      
    }
  }
  useEffect(() => {
    fetchAPIData(API);
  },[])

  const errors = {
    username: "Invalid username",
    password: "Invalid password"
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { uname, password } = event.target.elements;

    const userData = userDB.find((user) => user.username === uname.value);

    if (userData) {
      if (userData.password !== password.value) {
        setErrorMessages({ name: "password", message: errors.password });
      } else {
        navigate('/dashboard')
      }
    } else {
      setErrorMessages({ name: "uname", message: errors.username });
    }
  };

  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error mt-1" style={{marginLeft:'35px'}}>{errorMessages.message}</div>
    );

    const handleToggle = () => {
      if (type==='password'){
         setIcon(eye);
         setType('text')
      } else {
         setIcon(eyeOff)
         setType('password')
      }
   }

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
                <span class="flex justify-around items-start">
                <FaUserLarge className="me-2" size={20} color="gray"/>
              </span>
                <input type='text' name='uname' placeholder='Username' className='password-inputbox' />
                </div>
                {renderErrorMessage('uname')}
                <div className="password-field mt-3 ms-2">
                <span class="flex justify-around items-start" onClick={handleToggle}>
                  <Icon class="absolute me-2" icon={icon} size={20} style={{color:'gray'}}/>
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
              <p className="text-end mt-2 me-3" style={{color:'red',fontSize:'14px'}}>Forgot Password ?</p>
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
