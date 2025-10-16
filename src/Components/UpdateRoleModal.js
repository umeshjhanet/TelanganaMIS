import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../Api';
import { ToastContainer, toast } from 'react-toastify';

const AddGroupModal = ({ onClose, roleId }) => {
  const [roleName, setRoleName] = useState('');

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${API_URL}/updaterole/${roleId}`, { user_role: roleName });

      toast.success("Role updated successfully");
      onClose();
    } catch (error) {
      console.error('Error updating role name:', error);

    }
  };

  const handleInputChange = (e) => {
    setRoleName(e.target.value);
  };

  return (
    <>
      <ToastContainer />
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>&times;</span>
          <input type='text' placeholder='Enter Role Name' onChange={handleInputChange} />
          <button type='submit' className='mt-1 btn search-btn' onClick={handleUpdate} >Submit</button>
        </div>
      </div>
    </>
  )
}

export default AddGroupModal