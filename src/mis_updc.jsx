import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Header from './Components/Header'
import Footer from './Components/Footer'
import ReactDatePicker from 'react-datepicker'

const MISUPDC = ({ showSideBar }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });

    // Function to handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Function to submit the form data using Axios
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://192.168.3.119:81/userinfo", formData);

        } catch (error) {
            console.error("Error creating post:", error);
        }
    };


    return (
        <>

            <div className='container'>
                <div className='row'>
                    <div className={`${showSideBar ? 'col-lg-1 col-md-0' : 'col-lg-2 col-md-0'} d-none d-lg-block`}></div>
                    <div className={`${showSideBar ? 'col-lg-11 col-md-12' : 'col-lg-10 col-md-12 '} col-sm-12`}>
                        <h5>Registration form</h5>
                        <div className='form' style={{ border: '1px solid black', padding: '20px' }}>
                            <form onSubmit={handleSubmit}>
                                <div className='row'>
                                    <span>Name: </span>
                                    <input type='text' name='name' placeholder='Enter your Name' onChange={handleChange} required />
                                </div>
                                <div className='row'>
                                    <span>Email: </span>
                                    <input type='email' name='email' placeholder='Enter your Email' onChange={handleChange} required />
                                </div>
                                <div className='row'>
                                    <span>Mobile No: </span>
                                    <input type='number' name='phone' placeholder='Enter your Mobile No.' onChange={handleChange} required />
                                </div>
                                <div className='row'>
                                    <span>Password: </span>
                                    <input type='password' name='password' placeholder='Enter your Password' onChange={handleChange} required />
                                </div>
                                <div className='row'>
                                    <input type='submit' />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </>
    )
}

export default MISUPDC