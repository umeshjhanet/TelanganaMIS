import React, { useState } from 'react';
import Header from './Components/Header';
import Footer from './Footer';
import { API_URL } from './Api';
import { ToastContainer, toast } from 'react-toastify';

const UploadDatabase = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const userLog = JSON.parse(localStorage.getItem("user"));
    console.log("User's Info", userLog);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        setMessage('');

        if (!file) {
            setMessage('Please select a file');
            return;
        }

        if (!userLog || !userLog.locations || userLog.locations.length === 0) {
            setMessage('User location information not available');
            return;
        }

        const locationCodeFromFilename = file.name.substring(9, 12);
        console.log("Extracted Location Code:", locationCodeFromFilename);

        let authorized = false;

        userLog.locations.forEach(location => {
            const locationIdStr = location.id.toString();
            console.log("Comparing with Location ID:", locationIdStr);
            if (locationIdStr === locationCodeFromFilename) {
                authorized = true;
            }
        });

        if (!authorized) {
            toast.error('You are not authorized to upload this file');
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_URL}/uploadSql`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload file');
            }

            toast.success("File Uploaded successfully");
        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('Error uploading file');
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <Header />
            <ToastContainer />
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-lg-2 col-md-0'></div>
                    <div className='col-lg-10 col-md-12'>
                        <div className="card mt-3" style={{ padding: "5px", backgroundColor: "#4BC0C0" }}>
                            <h6 className="" style={{ color: "white" }}>
                                Store Management / Upload Document
                            </h6>
                        </div>
                        <div className='user-form-card mt-3'>
                            <h5>SELECT FILE:</h5>
                            <div className='row'>
                                <div className='col-3'>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div className='col-3'>
                                    <button
                                        className='btn add-btn'
                                        onClick={handleSubmit}
                                        disabled={uploading}
                                    >
                                        {uploading ? 'Uploading...' : 'Upload'}
                                    </button>
                                    <p>{message}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default UploadDatabase;
