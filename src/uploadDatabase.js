import React, { useState } from 'react'
import Header from './Components/Header'
import Footer from './Footer'
import { API_URL } from './Api';

const UploadDatabase = () => {

    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!file) {
            setMessage('Please select a file');
            return;
        }

        setUploading(true);
        setMessage('Uploading file...');

        const currentDate = new Date();
        const dateString = currentDate.toISOString().replace(/:/g, '-').replace(/\..+/, '');
        const fileName = `${file.name}_${dateString}.${file.name.split('.').pop()}`;

        const formData = new FormData();
        formData.append('file', file, fileName);

        try {
            const response = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: formData,
            });

            // Handle response from server
            setMessage('File uploaded successfully');
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
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-lg-2 col-md-2'></div>
                    <div className='col-lg-10 col-md-10'>
                        <div
                            className="card mt-3"
                            style={{ padding: "5px", backgroundColor: "#4BC0C0" }}
                        >
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
                                    <button className='btn add-btn' onClick={handleSubmit} disabled={uploading}>
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
    )
}

export default UploadDatabase