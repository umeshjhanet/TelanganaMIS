import React, { useEffect, useState } from 'react'
import Header from './Components/Header'
import Footer from './Components/Footer'
import axios from 'axios';
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import AddRoleModal from './Components/AddRoleModal';
import UpdateRoleModal from './Components/UpdateRoleModal';
import { API_URL } from './Api';

const UserRole = () => {
    const [role,setRole] = useState();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roleIdToEdit, setRoleIdToEdit] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [roleIdToDelete, setRoleIdToDelete] = useState(null);
    const[isOpen,setIsOpen]=useState(false);
    const[isLoading,setIsLoading]=useState(true);

    const handleOpen=()=>{
      setIsOpen(true);
    }

    const handleClose=()=>{
      setIsOpen(false);
      
    }
   

    const handleOpenModal = (role_id) => {
      setRoleIdToEdit(role_id);
        setIsModalOpen(true);
      };
      const handleCloseModal = () => {
        setIsModalOpen(false);
        // setRoleIdToEdit(null);
      };

      const handleDeleteRoleId = (role_id) => {
        setRoleIdToDelete(role_id);
        setShowConfirmation(true);
      };
    


    useEffect(() => {
        const fetchRoleData = () => {
          setIsLoading(true);
            axios.get(`${API_URL}/user_role`)
            .then(response => {setRole(response.data)
              setIsLoading(false);
            })
            .catch(error => {console.error(error)
              setIsLoading(false);
            })
        }
        fetchRoleData();
        
    },[]);

    const handleDelete = async(role_id)=>{
      try{
        const response = await axios.delete(`${API_URL}/deleterole/${role_id}`);
        setRole(role.filter((elem) => elem.id !== role_id));
        console.log("Role Deleted:", response.data);
        setShowConfirmation(false); 
        } catch (error) {
        console.error("There was an error in deleting data!", error);
      }

      
    }


    const filteredRoles = role && role.filter(elem =>
        elem.user_role.toLowerCase().includes(searchQuery.toLowerCase()) 
      );
      const Loader = () => (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      );
      

  return (
    <>
    {isLoading && <Loader/>}
    <Header/>
    <div className='container-fluid'>
        <div className='row'>
            <div className='col-lg-2 col-md-0'></div>
            <div className='col-lg-10 col-md-12'>
            <div
              className="card mt-3"
              style={{ padding: "5px", backgroundColor: "#4BC0C0" }}
            >
              <h6 className="" style={{ color: "white" }}>
                Master / User Role / User Role List
              </h6>
            </div>
            <div className='user-form-card mt-3'>
                <div className='row'>
                    <div className='col-lg-3 col-md-2'>
                        <button className='btn add-btn' onClick={handleOpen}>Add Role</button>
                    </div>
                    {isOpen && <AddRoleModal onClose={handleClose} />}
                    <div className='col-lg-2 col-md-2'></div>
                    <div className='col-lg-5 col-md-6'>
                    <input
                  type='text'
                  style={{ width: '300px', height: '40px' }}
                  placeholder='Search by Role name... '
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                        <button className='btn search-btn mb-1'>Search</button>
                    </div>
                </div>
                <div className='row mt-5'>
                    <table className='user-tables table-bordered'>
                        <thead>
                            <tr>
                                <th>Sr. No.</th>
                                <th>Role Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRoles && filteredRoles.map((elem,index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{elem.user_role}</td>
                                    <td><BiEdit onClick={() => handleOpenModal(elem.role_id)}   style={{color:'blue',fontSize:'20px'}}/> 
                                    / <RiDeleteBin5Line onClick={() => handleDeleteRoleId(elem.role_id)} style={{color:'red',fontSize:'20px'}}/></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {showConfirmation && (
                <div className="confirmation-dialog">
                  <div className="confirmation-content">
                    <p className="fw-bold">Are you sure you want to delete?</p>
                    <button className="btn btn-success mt-3 ms-5" onClick={() => handleDelete(roleIdToDelete)}>Yes</button>
                    <button className="btn btn-danger ms-3 mt-3" onClick={() => setShowConfirmation(false)}>No</button>
                  </div>
                </div>
              )}
                </div>
                {isModalOpen && <UpdateRoleModal roleId={roleIdToEdit} onClose={handleCloseModal} />}
            </div>
            </div>
        </div>
    </div>
    <Footer/>
    </>
  )
}

export default UserRole