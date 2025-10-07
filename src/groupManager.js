import React, { useEffect, useState } from 'react'
import Header from './Components/Header'
import Footer from './Components/Footer'
import axios from 'axios';
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import AddGroupModal from './Components/AddGroupModal';
import { API_URL } from './Api';
import UpdateGroupModal from './Components/UpdateGroupModal';

const GroupManager = () => {
  const [group, setGroup] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupIdToEdit, setGroupIdToEdit] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [groupIdToDelete, setGroupIdToDelete] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredGroups, setfilteredGroups] = useState(null)

  const handleOpen = () => {
    setIsOpen(true);
  }

  const handleClose = () => {
    setIsOpen(false);

  }


  const handleOpenModal = (group_id) => {
    setGroupIdToEdit(group_id)
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteUserId = (group_id) => {
    setGroupIdToDelete(group_id);
    setShowConfirmation(true);
  };


  useEffect(() => {
    const fetchGroupData = () => {
      setIsLoading(true);
      axios.get(`${API_URL}/group_master`)
        .then(response => {
          setGroup(response.data)
          setIsLoading(false);
        })
        .catch(error => {
          console.error(error)
          setIsLoading(false);
        })
    }
    fetchGroupData();
  }, []);

  // const filteredGroups = group && group.filter(elem =>
  //     elem.group_name.toLowerCase().includes(searchQuery.toLowerCase()) 
  //   );

  const handleDelete = async (group_id) => {
    try {
      const response = await axios.delete(`${API_URL}/deletegroup/${group_id}`);
      setGroup(group.filter((elem) => elem.id !== group_id));
     
      setShowConfirmation(false);
    } catch (error) {
      console.error("There was an error in deleting data!", error);
    }


  }
  const Loader = () => (
    <div className="loader-overlay">
      <div className="loader"></div>
    </div>
  );


  const handleClick = () => {
    setfilteredGroups(group && group.filter(elem =>
      elem.group_name.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  }

  const handleKey = (e) => {
    switch (e.key) {
      case 'Enter':
        handleClick();
        break;
      // You can add more cases as needed
      default:
        // Optional: handle other keys
        break;
    }
  }


  return (
    <>
      {isLoading && <Loader />}
      <Header />
      <div className={`container-fluid mb-5 ${isLoading ? 'blur' : ''}`}>
        <div className='row'>
          <div className='col-lg-2 col-md-0'></div>
          <div className='col-lg-10 col-md-12'>
            <div
              className="card mt-3"
              style={{ padding: "5px", backgroundColor: "#4BC0C0" }}
            >
              <h6 className="" style={{ color: "white" }}>
                Master / Group Manager / Group List
              </h6>
            </div>
            <div className='user-form-card mt-3'>
              <div className='row'>
                <div className='col-lg-3 col-md-2'>
                  <button className='btn add-btn' onClick={handleOpen}>Add Group</button>
                </div>
                {isOpen && <AddGroupModal onClose={handleClose} />}
                <div className='col-lg-2 col-md-2'></div>
                <div className='col-lg-5 col-md-6'>
                  <input
                    type='text'
                    style={{ width: '300px', height: '40px' }}
                    placeholder='Search by Group name... '
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={handleKey}
                  />
                  <button className='btn search-btn mb-1' onClick={handleClick}>Search</button>
                </div>
              </div>
              <div className='row mt-5'>
                <table className='user-tables table-bordered '>
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Group Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGroups && filteredGroups.length > 0 ? (
                      filteredGroups.map((elem, index) => (
                        <tr key={index}>
                          <td style={{ textAlign: 'left' }}>{index + 1}</td>
                          <td style={{ textAlign: 'left' }}>{elem?.group_name}</td>
                          <td style={{ textAlign: 'left' }}>
                            <BiEdit onClick={() => handleOpenModal(elem?.group_id)} style={{ color: 'blue', fontSize: '20px' }} />
                            / <RiDeleteBin5Line onClick={() => handleDeleteUserId(elem?.group_id)} style={{ color: 'red', fontSize: '20px' }} />
                          </td>
                        </tr>
                      ))
                    ) : (
                      // Fallback to show all groups or a message
                      group && group.map((elem, index) => (
                        <tr key={index}>
                          <td style={{ textAlign: 'left' }}>{index + 1}</td>
                          <td style={{ textAlign: 'left' }}>{elem?.group_name}</td>
                          <td style={{ textAlign: 'left' }}>
                            <BiEdit onClick={() => handleOpenModal(elem?.group_id)} style={{ color: 'blue', fontSize: '20px' }} />
                            / <RiDeleteBin5Line onClick={() => handleDeleteUserId(elem?.group_id)} style={{ color: 'red', fontSize: '20px' }} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {showConfirmation && (
                  <div className="confirmation-dialog">
                    <div className="confirmation-content">
                      <p className="fw-bold">Are you sure you want to delete?</p>
                      <button className="btn btn-success mt-3 ms-5" onClick={() => handleDelete(groupIdToDelete)}>Yes</button>
                      <button className="btn btn-danger ms-3 mt-3" onClick={() => setShowConfirmation(false)}>No</button>
                    </div>
                  </div>
                )}
              </div>
              {isModalOpen && <UpdateGroupModal groupId={groupIdToEdit} onClose={handleCloseModal} />}

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default GroupManager