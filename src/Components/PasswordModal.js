import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { API_URL } from '../Api';

const PasswordModal = ({ onClose, userId }) => {
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`${API_URL}/updatepassword/${userId}`, {
        password: newPassword
      });

      if (response.status === 200) {
        toast.success('Password updated successfully');
        onClose();
      } else {
        toast.error('Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('An error occurred while updating password');
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>&times;</span>
          <div className="password-card">
            <h3>Reset Password</h3>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <label>New Password:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ border: '1px solid black' }}
                  required
                />
              </div>
              <div className="row mt-2">
                <button type="submit" className="btn btn-success">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordModal;
