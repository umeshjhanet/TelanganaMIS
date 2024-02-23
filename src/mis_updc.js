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

    // Function to handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Function to submit the form data using Axios
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
            {/* <div className='container'>
                <div className='row'>
                    <div className='col-1'></div>
                    <div className='col-11'>
                        <div className='row mt-2 mb-2'>
                            <div className='col-6'>
                                <button className='btn location-btn'>Location</button>
                            </div>
                            <div className='col-6'>
                                <span>Date : </span>
                                <ReactDatePicker placeholderText='Select Date' />
                            </div>
                        </div>
                        <div className='row mt-5'>
                            <div className='col-6'>
                                <div className='row'>
                                    <div className='col-5'>
                                        <span>Project Head Name: </span>
                                    </div>
                                    <div className='col-7'>
                                        <input type='text' placeholder='Select PH Name' style={{ width: '300px' }} /><br />
                                    </div>
                                    <div className='col-5 mt-2'>
                                        <span>Project Owner Name: </span>
                                    </div>
                                    <div className='col-7'>
                                        <input className='mt-2' type='text' placeholder='Select PO Name' style={{ width: '300px' }} /><br />
                                    </div>
                                    <div className='col-5 mt-2'>
                                        <span>Project Manager Name: </span>
                                    </div>
                                    <div className='col-7'>
                                        <input className='mt-2' type='text' placeholder='Select PM Name' style={{ width: '300px' }} /><br />
                                    </div>
                                    <div className='col-5 mt-2'>
                                        <span>Project Coordinator Name: </span>
                                    </div>
                                    <div className='col-7'>
                                        <input className='mt-2' type='text' placeholder='Select PCo Name' style={{ width: '300px' }} /><br />
                                    </div>
                                    <div className='col-5 mt-2'>
                                        <span>Site Manager Name: </span>
                                    </div>
                                    <div className='col-7'>
                                        <input className='mt-2' type='text' placeholder='Select SM Name' style={{ width: '300px' }} /><br />
                                    </div>
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className='row'>
                                    <div className='col-5'>
                                        <span>Project Head Mobile No: </span>
                                    </div>
                                    <div className='col-7'>
                                        <input type='text' placeholder='Auto-populate from PH selection' style={{ width: '300px' }} /><br />
                                    </div>
                                    <div className='col-5 mt-2'>
                                        <span>Project Owner Mobile No: </span>
                                    </div>
                                    <div className='col-7'>
                                        <input className='mt-2' type='text' placeholder='Auto-populate from PO selection' style={{ width: '300px' }} /><br />
                                    </div>
                                    <div className='col-5 mt-2'>
                                        <span>Project Manager Mobile No: </span>
                                    </div>
                                    <div className='col-7'>
                                        <input className='mt-2' type='text' placeholder='Auto-populate from PM selection' style={{ width: '300px' }} /><br />
                                    </div>
                                    <div className='col-5 mt-2'>
                                        <span>Project Coordinator Mobile No: </span>
                                    </div>
                                    <div className='col-7'>
                                        <input className='mt-2' type='text' placeholder='Auto-populate from PCo selection' style={{ width: '300px' }} /><br />
                                    </div>
                                    <div className='col-5 mt-2'>
                                        <span>Site Manager Mobile No: </span>
                                    </div>
                                    <div className='col-7'>
                                        <input className='mt-2' type='text' placeholder='Auto-populate from SM selection' style={{ width: '300px' }} /><br />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row mt-4'>
                            <h3 className='text-center'>Processing Details</h3>
                            <div className='row'>
                                <div className='col-3'>
                                    <div className='process-card'>
                                        <h5 className='text-center'>Collection</h5>
                                        <span>MP Used: </span>
                                        <input type='text' style={{ width: '100px' }} />
                                    </div>
                                </div>
                                <div className='col-3'>
                                    <div className='process-card'>
                                        <h5 className='text-center'>Bar Coding</h5>
                                        <span>MP Used: </span>
                                        <input type='text' style={{ width: '100px' }} /><br />
                                        <span>Total Files: </span>
                                        <input type='text' style={{ width: '100px' }} /><br />
                                        <span>Total Images: </span>
                                        <input type='text' style={{ width: '100px' }} />
                                    </div>
                                </div>
                                <div className='col-3'>
                                    <div className='process-card'>
                                        <h5 className='text-center'>Page Numbering</h5>
                                        <span>MP Used: </span>
                                        <input type='text' style={{ width: '100px' }} />
                                    </div>
                                </div>
                                <div className='col-3'>
                                    <div className='process-card'>
                                        <h5 className='text-center'>Preparation</h5>
                                        <span>MP Used: </span>
                                        <input type='text' style={{ width: '100px' }} /><br />
                                        <span>Total Files: </span>
                                        <input type='text' style={{ width: '100px' }} /><br />
                                        <span>Total Images: </span>
                                        <input type='text' style={{ width: '100px' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div> */}
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