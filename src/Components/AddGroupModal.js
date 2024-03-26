import React from 'react'

const AddGroupModal = ({onClose}) => {
  return (
    <>
    <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={onClose}>&times;</span>
      <input type='text' placeholder='Enter Group Name'/>
      <button type='submit' className='mt-1 btn search-btn'>Submit</button>
      </div>
      </div>
    </>
  )
}

export default AddGroupModal