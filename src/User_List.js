import React, { useEffect, useState } from 'react'
import Header from './Components/Header'
import Footer from './Footer'
import axios from 'axios';

const User_List = () => {
    const[user, setUser] = useState();

    useEffect(() => {
        const fetchUser = () => {
            axios.get("http://localhost:5000/user_master")
            .then(response => setUser(response.data))
            .catch(error => {
                console.error('Error fetching data:', error);
              });
        }
        fetchUser();
        const intervalID = (fetchUser, 2000);
        return () => clearInterval(intervalID);
    }, [])
  return (
    <>
    <Header/>
    <div className='container-fluid'>
        <div className='row'>
            <div className='col-lg-2 col-md-2'></div>
            <div className='col-lg-10 col-md-10'>
                <table className='table-bordered'>
                    <thead>
                        <tr>
                            <th>All</th>
                            <th>User Name</th>
                            <th>Designation</th>
                            <th>User Email</th>
                            <th>Phone</th>
                            <th>User Role</th>
                            <th>Locations Alloted</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user && user.map((elem,index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{elem.first_name} {elem.middle_name} {elem.last_name}</td>
                                <td>{elem.designation}</td>
                                <td>{elem.user_email_id}</td>
                                <td>{elem.phone_no}</td>
                                <td></td>
                                <td></td>
                                <td>Edit/Delete</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <Footer/>
    </>
  )
}

export default User_List