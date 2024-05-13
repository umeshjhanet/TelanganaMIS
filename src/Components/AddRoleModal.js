import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { ToastContainer,toast  } from 'react-toastify';
import { API_URL } from '../Api';

const AddRoleModal = ({onClose}) => {
  const [roleName,setRoleName]=useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/add-role`, { user_role: roleName });
      console.log("Role name created:", response.data);
      toast.success("Group updated successfully");
      onClose(); 
     
    } catch (error) {
      console.error("Error creating role:", error);
    }
  };

  const handleInputChange = (e) => {
    setRoleName(e.target.value);
  };
  
  return (
    <>
    <ToastContainer/>
    <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={onClose}>&times;</span>
      <input type='text' placeholder='Enter Role Name' onChange={handleInputChange} />
      <button type='submit' className='mt-1 btn search-btn' onClick={handleSubmit} >Submit</button>
      </div>
      </div>
    </>
  )
}

export default AddRoleModal