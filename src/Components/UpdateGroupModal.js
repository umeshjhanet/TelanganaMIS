import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../Api';
import { ToastContainer,toast  } from 'react-toastify';

const UpdateGroupModal = ({onClose,groupId}) => {
  const [groupName,setGroupName]=useState('');
  
  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${API_URL}/updategroup/${groupId}`, { group_name: groupName });
      console.log(response.data);
      toast.success("Group updated successfully");
        onClose();
    } catch (error) {
      console.error('Error updating group name:', error);
     
    }
  };

  const handleInputChange = (e) => {
    setGroupName(e.target.value);
  };
  
  return (
    <>
    <ToastContainer/>
    <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={onClose}>&times;</span>
      <input type='text' placeholder='Enter Group Name' onChange={handleInputChange} />
      <button type='submit' className='mt-1 btn search-btn' onClick={handleUpdate} >Submit</button>
      </div>
      </div>
    </>
  )
}

export default UpdateGroupModal