import React, { useEffect, useState } from 'react'
import Header from './Components/Header'
import Footer from './Footer'
import axios from 'axios';


const User_Form = () => {
  const[group, setGroup] = useState();
  const[email, setEmail] = useState();
  const[location,setLocation]=useState();
  const[privilege,setPrivilege]=useState();
  const[storage,setStorage]=useState();
  const[reporting,setReporting]=useState();
  const[groupDropdown, setGroupDropdown] = useState();
  const[locationDropdown,setLocationDropdown]=useState();
  const[privilegeDropdown,setPrivilegeDropdown]=useState();
  const[storageDropdown,setStorageDropdown]=useState();
  const[reportingDropdown,setReportingDropdown]=useState();
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showLocation, setShowLocation] = useState(false);
  const [selectedPrivilegeId, setSelectedPrivilegeId] = useState('');
  const [selectedPrivilege, setSelectedPrivilege] = useState(null);
  const [showPrivilege, setShowPrivilege] = useState(false);
  const [selectedStorageId, setSelectedStorageId] = useState('');
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [showStorage, setShowStorage] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showGroup, setShowGroup] = useState(false);
  const [selectedReportingId, setSelectedReportingId] = useState('');
  const [selectedReporting, setSelectedReporting] = useState(null);
  const [showReporting, setShowReporting] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

const [formData,setFormData]=useState({
    user_email_id:'',
    first_name:'', 
    middle_name:'', 
    last_name:'', 
    password:'',
    confirmPassword:'',
    designation:'',
    phone_no:'', 
    profile_picture:'',
    login_disabled_date:'', 
    emp_id:'', 
    locations:'', 
    user_type:'', 
    role_id:'',
    user_id:'',
    group_id:'', 
    sl_id:'',
    
    
    
});




  useEffect(() => {
    const fetchGroup = () => {
      fetch("http://localhost:5000/group_master")
      .then(response => response.json())
      .then(data => setGroup(data))
      .catch(error => console.error(error))
    }
    const fetchLocation = () => {
      fetch("http://localhost:5000/locations")
      .then(response => response.json())
      .then(data => setLocation(data))
      .catch(error => console.error(error))
    }
    const fetchPrivilege = () => {
      fetch("http://localhost:5000/privilege")
      .then(response => response.json())
      .then(data => setPrivilege(data))
      .catch(error => console.error(error))
    }
    const fetchStorage = () => {
      fetch("http://localhost:5000/storage")
      .then(response => response.json())
      .then(data => setStorage(data))
      .catch(error => console.error(error))
    }
    // const fetchEmail = () => {
    //   fetch("http://localhost:5000/user_email")
    //   .then(response => response.json())
    //   .then(data => setEmail(data))
    //   .catch(error => console.error(error))
    // }
   
   
    const fetchReporting = () => {
      fetch("http://localhost:5000/reporting")
      .then(response => response.json())
      .then(data => setReporting(data))
      .catch(error => console.error(error))
    }
    fetchGroup();
    // fetchEmail();
    fetchLocation();
    fetchPrivilege();
    fetchStorage();
    fetchReporting();
    fetchLocation();
    fetchPrivilege();
    fetchStorage();
    fetchReporting();
  },[])

 


  const handleGroupDropdown = () => {
    setGroupDropdown(!groupDropdown);
  }
 
  const handleLocationDropdown=()=>{
    setLocationDropdown(!locationDropdown);
  }

  const handlePrivilegeDropdown=()=>{
    setPrivilegeDropdown(!privilegeDropdown);
  }

  const handleStorageDropdown=()=>{
    setStorageDropdown(!storageDropdown);
  }

  const handleReportingDropdown=()=>{
    setReportingDropdown(!reportingDropdown);
  }

  const handleSelectLocation = (id, name) => {
    setSelectedLocation(name);
    setSelectedLocationId(parseInt(id));
    setShowLocation(!showLocation);
    setLocationDropdown(false);
  };
  const handleSelectGroup = (id, name) => {
    setSelectedGroup(name);
    setSelectedGroupId(parseInt(id));
    setShowGroup(!showGroup);
    setGroupDropdown(false);
  };
  const handleSelectPrivilege = (id, name) => {
    setSelectedPrivilege(name);
    setSelectedPrivilegeId(parseInt(id));
    setShowPrivilege(!showPrivilege);
    setPrivilegeDropdown(false);
  };
  const handleSelectStorage = (id, name) => {
    setSelectedStorage(name);
    setSelectedStorageId(parseInt(id));
    setShowStorage(!showStorage);
    setStorageDropdown(false);
  };
  const handleSelectReporting = (id, name) => {
    setSelectedReporting(name);
    setSelectedReportingId(parseInt(id));
    setShowReporting(!showReporting);
    setReportingDropdown(false)
  };

  console.log(formData)

  const handleFormSubmit = async (e) => {
   
    e.preventDefault();
  if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/createuser", formData);
      console.log("Post created:", response.data);
    } catch (error) {
     
      if (error.response && error.response.status === 409) {
        alert("Email already exists");
      } else {
        console.error("Error creating post:", error);
        alert("Email already exists");
      }
    }
  
  }




  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value, group_id: selectedGroupId, locations:selectedLocationId,role_id: selectedPrivilegeId, sl_id: selectedStorageId, user_id: selectedReportingId});
  }
  console.log("group id",selectedGroupId);
  console.log("locations",selectedLocationId);
  console.log("role id",selectedPrivilegeId);
  console.log("user id",selectedReportingId);
  console.log("storage id",selectedStorageId);

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
                    <input type='text' placeholder='Enter First Name' name="first_name" style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange}/><br />
                    
                    <label className='mt-1'>Middle Name</label><br />
                    <input type='text' placeholder='Enter Middle Name' name="middle_name" style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} /><br />
                    <label className='mt-1'>Last Name<span style={{ color: 'red' }}>*</span></label><br />
                    <input type='text' placeholder='Enter Last Name' name="last_name" style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} /><br />
                    <label className='mt-1'>Email Address<span style={{ color: 'red' }}>*</span></label><br />
                    <input type='email' placeholder='Enter Email Id' name="user_email_id" style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange}/><br />
                    <label className='mt-1'>Employee Id</label><br />
                    <input type='text' placeholder='Enter Employee Id' name="emp_id" style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} /><br />
                    <label className='mt-1'>Mobile No.<span style={{ color: 'red' }}>*</span></label><br />
                    <input type='tel' placeholder='Enter Mobile No.' name="phone_no" style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} /><br />
                    <label className='mt-1'>Password<span style={{ color: 'red' }}>*</span></label><br />
                    <input type='password' placeholder='Enter Password' name="password" style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} /><br />
                    <label className='mt-1'>Confirm Password<span style={{ color: 'red' }}></span></label><br />
                    <input type='password' placeholder='Confirm Password' name='confirmPassword' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} /><br />
                    <label className='mt-1'>User Type</label>
                    <select name="user_type" id="usertype" class="form-control select2" style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }}  onChange={handleInputChange}>
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
                    <input type='text' placeholder='Select Designation' name="designation" style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} /><br />
                   
                    <label className='mt-1'>Select Group<span style={{ color: 'red' }}>*</span></label><br />
                       <input type='text' placeholder='Select Group' className='form-control' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} value={selectedGroup|| ''} onClick={handleGroupDropdown} onChange={handleInputChange}/>
                      {groupDropdown && (
                       <div className='group-dropdown'>
                        {group && group.map((elem,index) => (
                             <div key={index} className='group-card' onClick={() => handleSelectGroup(elem.group_id, `${elem.group_name}`)}>
                            <p>{elem.group_name}</p>
                                     </div>
                                    ))}
                          </div>
                            )}
                          <label className='mt-1'>Select Location <span style={{ color: 'red' }}>*</span></label><br />
                          <input type='text' placeholder='Select Location' className='form-control' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} value={selectedLocation || ''} onClick={handleLocationDropdown} onChange={handleInputChange}/>
                                {locationDropdown &&(
                                <div className='group-dropdown'>
                                  {location && location.map((elem,index)=>(
                                <div key={index} className='group-card' onClick={() => handleSelectLocation(elem.LocationID, `${elem.LocationName}`)} >
                                         <p>{elem.LocationName}</p>
                                               </div>
                                              ))}
                                        </div>
                                    )}

                    <label className='mt-1'>Select User's Privilege<span style={{ color: 'red' }}>*</span></label><br />
                    <input type='text' placeholder='Select Users Privilege' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} value={selectedPrivilege || ''} onClick={handlePrivilegeDropdown} onChange={handleInputChange} /><br />
                    {privilegeDropdown && (
                      <div className='group-dropdown'>
                        {privilege && privilege.map((elem,index)=>(
                          <div key={index} className='group-card' onClick={() => handleSelectPrivilege(elem.role_id, `${elem.user_role}`)}>
                            <p>{elem.user_role}</p>

                          </div>
                        ))}

                      </div>

                    )}
                    <label className='mt-1'>Select Storage</label><br />
                    <input type='text' placeholder='Select Storage' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }}value={selectedStorage || ''} onClick={handleStorageDropdown} onChange={handleInputChange} /><br />
                    {storageDropdown && (
                      <div className='group-dropdown'>
                        {storage && storage.map((elem,index)=>(
                          <div key={index} className='group-card' onClick={() => handleSelectStorage(elem.sl_id, `${elem.sl_name}`)}>
                            <p>{elem.sl_name}</p>
                          </div>
                        ))}
                        </div>

                    )}
                    <label className='mt-1'>Select Reporting To</label><br />
                    <input type='text' placeholder='Select Reporting To' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} value={selectedReporting || ''} onClick={handleReportingDropdown} onChange={handleInputChange} />
                    {reportingDropdown && (
                      <div className='group-dropdown'>
                        {reporting && reporting.map((elem,index)=>(
                          <div key={index} className='group-card' onClick={() => handleSelectReporting(elem.user_id, `${elem.first_name} ${elem.last_name} (${elem.user_email_id})`)}>
                            <p>{elem.first_name} {elem.last_name} ({elem.user_email_id})</p>
                          </div>
                        ))}
                      </div>

                    )

                    }
                    <label className='mt-1'>Set date for disabling the user ID</label><br />
                    <input type='date' placeholder='13-03-24' name="login_disabled_date" style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange}/><br />
                    <label className='mt-1'>Profile Picture<span style={{ color: 'red' }}>*</span></label><br />
                    <input type='file' name="profile_picture" style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange}/><br />
                    <input type='submit' className='mt-3' onClick={handleFormSubmit}  />
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

