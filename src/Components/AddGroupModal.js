import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../Api';

const AddGroupModal = ({onClose}) => {
  const [groupName,setGroupName]=useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/add-group`, { group_name: groupName });
      console.log("Group name created:", response.data);
      onClose(); 
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const handleInputChange = (e) => {
    setGroupName(e.target.value);
  };
  
  return (
    <>
    <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={onClose}>&times;</span>
      <input type='text' className='mt-5' placeholder='Enter Group Name' style={{width:'300px'}} onChange={handleInputChange} />
      <button type='submit' className='mt-1 btn search-btn' onClick={handleSubmit} >Submit</button>
      </div>
      </div>
    </>
  )
}

export default AddGroupModal