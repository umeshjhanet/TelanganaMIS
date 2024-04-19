import React from 'react';
import { useState } from 'react';
import axios from 'axios';

const AddGroupModal = ({onClose}) => {
  const [groupName,setGroupName]=useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/add-group", { group_name: groupName });
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
      <input type='text' placeholder='Enter Group Name' onChange={handleInputChange} />
      <button type='submit' className='mt-1 btn search-btn' onClick={handleSubmit} >Submit</button>
      </div>
      </div>
    </>
  )
}

export default AddGroupModal