import React, { useEffect, useState } from "react";
import Header from "./Components/Header";
import Footer from "./Footer";
import axios from "axios";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import UpdateUserModal from "./Components/UpdateUserModal";
import { ToastContainer } from "react-toastify";
import { API_URL } from "./Api";

const User_List = () => {
  const [user, setUser] = useState([]);
  const [location, setLocation] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationsMap, setLocationsMap] = useState({});
  const [privileges, setPrivileges] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); // Set users per page
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [userIdToEdit, setUserIdToEdit] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    user_email_id: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    password: "",
    designation: "",
    phone_no: "",
    profile_picture: "",
    login_disabled_date: "",
    emp_id: "",
    locations: "",
    user_type: "",
    role_id: "",
    user_id: "",
    group_id: "",
    sl_id: "",
  });

  const handleDeleteUser = async (user_id) => {
    try {
      const response = await axios.delete(
        `${API_URL}/createuserdelete/${user_id}`
      );
      setUser(user.filter((elem) => elem.user_id !== user_id));
      console.log("User Deleted:", response.data);
      setShowConfirmation(false);
    } catch (error) {
      console.error("There was an error in deleting data!", error);
    }
  };

  // const handleEditUserId=(user_id)=>{
  //   setUserIdToEdit(user_id);

  // }

  const handleDeleteUserId = (user_id) => {
    setUserIdToDelete(user_id);
    setShowConfirmation(true);
  };

  const handleOpenModal = (user_id) => {
    setUserIdToEdit(user_id)
    setIsModalOpen(true);

  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserIdToEdit(null);
  };

  useEffect(() => {
    const fetchUser = () => {
      setIsLoading(true);
      axios
        .get(`${API_URL}/user_master`)
        .then((response) => {setUser(response.data)
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setIsLoading(false);
        });
    };
    const fetchLocation = () => {
      setIsLoading(true);
      axios
        .get(`${API_URL}/locations`)
        .then((response) => {
          // Convert locations array into a map where LocationID is the key
          const map = {};
          response.data.forEach((location) => {
            map[location.LocationID] = location.LocationName;
          });

          console.log("Locations map:", map);
          console.log(response.data);
          setLocationsMap(map);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching location data:", error);
          setIsLoading(false);
        });
    };

    fetchUser();
    fetchLocation();
  }, []);


  const filteredUsers = user.filter(
    (elem) =>
      elem.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      elem.user_email_id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const getLocationNameById = (locations) => {
    const locationArray = locations.split(",");
    let result = "";
    for (let i = 0; i < locationArray.length; i++) {
      const location = locationArray[i].trim();
      if (locationsMap.hasOwnProperty(location)) {
        result += locationsMap[location];
        if (i < locationArray.length - 1) {
          result += ",";
        }
      }
    }
    return result;
  };
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const renderUsers = () => {
    if (searchQuery) {
      // If there's a search query, render filtered users and hide pagination
      return (
        <tbody>
          {filteredUsers.map((elem, index) => (
            <tr key={elem.user_id}>
              <td>{index + 1}</td>
              <td>
                {elem.first_name} {elem.middle_name} {elem.last_name}
              </td>
              <td>{elem.designation}</td>
              <td>{elem.user_email_id}</td>
              <td>{elem.phone_no}</td>
              <td>{elem.user_role}</td>
              <td>{getLocationNameById(elem.locations)}</td>
              <td>
                <BiEdit onClick={() => handleOpenModal(elem.user_id)} style={{ color: 'blue', fontSize: '20px' }} />
                /
                <RiDeleteBin5Line onClick={() => handleDeleteUserId(elem.user_id)} style={{ color: 'red', fontSize: '20px' }} />
              </td>
            </tr>
          ))}
        </tbody>
      );
    } else {
      // If there's no search query, render paginated users with pagination
      return (
        <tbody>
          {currentUsers.map((elem, index) => (
            <tr key={elem.user_id}>
              <td>{index + 1}</td>
              <td>
                {elem.first_name} {elem.middle_name} {elem.last_name}
              </td>
              <td>{elem.designation}</td>
              <td>{elem.user_email_id}</td>
              <td>{elem.phone_no}</td>
              <td>{elem.user_roles}</td>
              <td>{getLocationNameById(elem.locations)}</td>
              <td>
                <BiEdit onClick={() => handleOpenModal(elem.user_id)} style={{ color: 'blue', fontSize: '20px' }} />
                /
                <RiDeleteBin5Line onClick={() => handleDeleteUserId(elem.user_id)} style={{ color: 'red', fontSize: '20px' }} />
              </td>
            </tr>
          ))}
        </tbody>
      );
    }
  };
  const Loader = () => (
    <div className="loader-overlay">
      <div className="loader"></div>
    </div>
  );

  return (
    <>
    {isLoading && <Loader/>}
      <Header />
      <div className={`container-fluid mb-5 ${isLoading ? 'blur' : ''}`}>
        <div className="row">
          <div className="col-lg-2 col-md-0"></div>
          <div className="col-lg-10 col-md-12">
            <div className="row mt-4 me-1">
              <div
                className="card"
                style={{ padding: "5px", backgroundColor: "#4BC0C0" }}
              >
                <h6 className="text-center" style={{ color: "white" }}>
                  Masters / User List
                </h6>
              </div>
            </div>
            <div className="row user-list-card mt-3 mb-5">
              <div className="row">
                <input
                  type='text'
                  style={{ width: '300px', height: '40px' }}
                  placeholder='Search by name or email...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className='btn search-btn mb-1'>Search</button>
              </div>
              {isLoading ? (
                  <>
                    <div className="loader-container">
                      <div className="loader"></div>
                    </div>
                  </>
                ) : (
                  <>
                    <table className='user-tables table-bordered mt-1 mb-4'>
                      <thead>
                        <tr>
                          <th>All</th>
                          <th>User Name</th>
                          <th>Designation</th>
                          <th>User Email</th>
                          <th>Phone</th>
                          <th>User Role</th>
                          <th>Locations Allotted</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((elem, index) => (
                          <tr key={elem.user_id}>
                            <td>{index + 1}</td>
                            <td>
                              {elem.first_name} {elem.middle_name} {elem.last_name}
                            </td>
                            <td>{elem.designation}</td>
                            <td>{elem.user_email_id}</td>
                            <td>{elem.phone_no}</td>
                            <td>{elem.user_roles}</td>
                            <td>{getLocationNameById(elem.locations)}</td>
                            <td>
                              <BiEdit onClick={() => handleOpenModal(elem.user_id)} style={{color:'blue', fontSize:'20px'}} />
                              / 
                              <RiDeleteBin5Line onClick={() => handleDeleteUserId(elem.user_id)} style={{color:'red', fontSize:'20px'}} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!searchQuery && (
                      <div className="row">
                        <ul className="pagination justify-content-center">
                          {user.length > usersPerPage && Array(Math.ceil(user.length / usersPerPage)).fill().map((_, index) => (
                            <li
                              key={index}
                              className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                            >
                              <button
                                className="page-link"
                                onClick={() => paginate(index + 1)}
                              >
                                {index + 1}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              {showConfirmation && (
                <div className="confirmation-dialog">
                  <div className="confirmation-content">
                    <p className="fw-bold">Are you sure you want to delete?</p>
                    <button className="btn btn-success mt-3 ms-5" onClick={() => handleDeleteUser(userIdToDelete)}>Yes</button>
                    <button className="btn btn-danger ms-3 mt-3" onClick={() => setShowConfirmation(false)}>No</button>
                  </div>
                </div>
              )}
              {isModalOpen && <UpdateUserModal userId={userIdToEdit} onClose={handleCloseModal} />}
            </div>
          </div>
        </div>
        
      </div>
      <ToastContainer />
      <Footer />
    </>
  );

};

export default User_List;

