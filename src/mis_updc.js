import React, { useEffect,useState } from 'react'
import axios from 'axios'
import Header from './Components/Header'
import Footer from './Footer'
import ReactDatePicker from 'react-datepicker'

const MISUPDC = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });

   
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://backend-nodejs-nine.vercel.app/userinfo", formData);
            console.log("Post created:", response.data);
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };


    return (
        <>
            <Header />
           
            <div className='container'>
                <div className='row'>
                    <div className='col-1'></div>
                    <div className='col-11'>
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