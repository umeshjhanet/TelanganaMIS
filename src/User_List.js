import React, { useEffect, useState } from 'react';
import Header from './Components/Header';
import Footer from './Footer';
import axios from 'axios';
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";

const User_List = () => {
  const [user, setUser] = useState([]);
  const [location, setLocation] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUser = () => {
      axios.get("http://localhost:5000/user_master")
        .then(response => setUser(response.data))
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }

    const fetchLocation = () => {
      axios.get("http://localhost:5000/locations")
        .then(response => setLocation(response.data))
        .catch(error => {
          console.error('Error fetching location data:', error);
        });
    }

    fetchUser();
    fetchLocation();

    const intervalID = setInterval(() => {
      fetchUser();
      fetchLocation();
    }, 2000);

    return () => clearInterval(intervalID);
  }, []);

  // Filter user data based on search query
  const filteredUsers = user.filter(elem =>
    elem.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    elem.user_email_id.toLowerCase().includes(searchQuery.toLowerCase())
  );
//   const getLocationNameById = (locations) => {
//     const location = location.find(loc => loc.locations === locations);
//     return location ? location.locationname : '';
//   }

  return (
    <>
      <Header />
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-lg-2 col-md-2'></div>
          <div className='col-lg-10 col-md-10'>
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
            <div className='row user-list-card mt-3 mb-5'>
              <div className='row'>
                <input
                  type='text'
                  style={{ width: '300px', height: '40px' }}
                  placeholder='Search by name or email...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                 <button className='btn search-btn mb-1'>Search</button>
              </div>
              <table className='user-tables table-bordered mt-1 mb-5'>
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
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{elem.first_name} {elem.middle_name} {elem.last_name}</td>
                      <td>{elem.designation}</td>
                      <td>{elem.user_email_id}</td>
                      <td>{elem.phone_no}</td>
                      <td></td>
                      <td>{elem.locations}</td>
                      <td><BiEdit  style={{color:'blue',fontSize:'20px'}}/> / <RiDeleteBin5Line style={{color:'red',fontSize:'20px'}}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default User_List;
