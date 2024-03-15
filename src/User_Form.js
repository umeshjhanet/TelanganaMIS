import React, { useEffect, useState } from 'react'
import Header from './Components/Header'
import Footer from './Footer'

const User_Form = () => {
  const[group, setGroup] = useState();
  useEffect(() => {
    const fetchGroup = () => {
      fetch("http://localhost:5000/group_master")
      .then(response => response.json())
      .then(data => setGroup(data))
      .catch(error => console.error(error))
    }
    fetchGroup();
  },[])
  return (
    <>
      <Header />
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-lg-2 col-md-2'></div>
          <div className='col-lg-10 col-md-10'>
            <div
              className="card mt-3"
              style={{ padding: "5px", backgroundColor: "#4BC0C0" }}
            >
              <h6 className="" style={{ color: "white" }}>
                Master / Add User
              </h6>
            </div>
            <div className='user-form-card mt-3'>
              <div className='row'>
                <div className='col-6'>
                  <div className='user-form-card'>
                    <label>First Name<span style={{ color: 'red' }}>*</span></label><br />
                    <input type='text' placeholder='Enter First Name' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} /><br />
                    <label className='mt-1'>Middle Name</label><br />
                    <input type='text' placeholder='Enter Middle Name' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} /><br />
                    <label className='mt-1'>Last Name<span style={{ color: 'red' }}>*</span></label><br />
                    <input type='text' placeholder='Enter Last Name' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} /><br />
                    <label className='mt-1'>Email Address<span style={{ color: 'red' }}>*</span></label><br />
                    <input type='email' placeholder='Enter Email Id' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} /><br />
                    <label className='mt-1'>Employee Id</label><br />
                    <input type='text' placeholder='Enter Employee Id' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} /><br />
                    <label className='mt-1'>Mobile No.<span style={{ color: 'red' }}>*</span></label><br />
                    <input type='tel' placeholder='Enter Mobile No.' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} /><br />
                    <label className='mt-1'>Password<span style={{ color: 'red' }}>*</span></label><br />
                    <input type='password' placeholder='Enter Password' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} /><br />
                    <label className='mt-1'>Confirm Password<span style={{ color: 'red' }}>*</span></label><br />
                    <input type='password' placeholder='Confirm Password' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} /><br />
                    <label className='mt-1'>User Type</label><br />
                    <select name="usertype" id="usertype" class="form-control select2">
                      <option value="0" selected>Select user type</option>
                      <option value="1">Record Keeper</option>
                      <option value="2">Client User</option>
                      <option value="3">Server User</option>
                    </select>                            
                    </div>
                </div>
                <div className='col-6'>
                  <div className='user-form-card'>
                    <label>Designation<span style={{ color: 'red' }}>*</span></label><br />
                    <input type='text' placeholder='Select Designation' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} /><br />
                    <label className='mt-1'>Select Group<span style={{ color: 'red' }}>*</span></label><br />
                    <select name="usergroup" id="usergroup" class="form-control select2">
                      <option value="0" selected>Select user type</option>
                      {group && group.map((elem,index) => (
                        <option key={index} value={index + 1}>{elem.group_name}</option>
                      ))}
                    </select>                     
                    <label className='mt-1'>Select Location</label><br />
                    <input type='text' placeholder='Select Location' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} /><br />
                    <label className='mt-1'>Select User's Privilege<span style={{ color: 'red' }}>*</span></label><br />
                    <input type='text' placeholder='Select Users Privilege' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} /><br />
                    <label className='mt-1'>Select Storage</label><br />
                    <input type='text' placeholder='Select Storage' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} /><br />
                    <label className='mt-1'>Select Reporting To</label><br />
                    <input type='text' placeholder='Select Reporting To' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} /><br />
                    <label className='mt-1'>Set date for disabling the user ID</label><br />
                    <input type='date' placeholder='13-03-24' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} /><br />
                    <label className='mt-1'>Profile Picture<span style={{ color: 'red' }}>*</span></label><br />
                    <input type='file' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} /><br />
                    <input type='submit' className='mt-3' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default User_Form