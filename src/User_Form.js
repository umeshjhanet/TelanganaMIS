import React, { useEffect, useState, useRef } from 'react';
import Header from './Components/Header';
import Footer from './Footer';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { API_URL } from './Api';

const User_Form = () => {
  const [group, setGroup] = useState();
  const [email, setEmail] = useState();
  const [location, setLocation] = useState();
  const [privilege, setPrivilege] = useState();
  const [storage, setStorage] = useState();
  const [reporting, setReporting] = useState();
  const [groupDropdown, setGroupDropdown] = useState();
  const [locationDropdown, setLocationDropdown] = useState();
  const [privilegeDropdown, setPrivilegeDropdown] = useState();
  const [storageDropdown, setStorageDropdown] = useState();
  const [reportingDropdown, setReportingDropdown] = useState();
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [selectedLocations, setSelectedLocations] = useState([]);
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
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneNoError, setPhoneNoError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [designationError, setDesignationError] = useState(false);
  const [groupError, setGroupError] = useState(false);
  const [privilegeError, setPrivilegeError] = useState(false);

  const [formData, setFormData] = useState({
    user_email_id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    password: '',
    confirmPassword: '',
    designation: '',
    phone_no: '',
    profile_picture: '',
    login_disabled_date: '',
    emp_id: '',
    locations: '',
    user_type: '',
    role_id: '',
    user_id: '',
    group_id: '',
    sl_id: '',
  });

  const groupDropdownRef = useRef(null);
  const locationDropdownRef = useRef(null);
  const privilegeDropdownRef = useRef(null);
  const storageDropdownRef = useRef(null);
  const reportingDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        groupDropdownRef.current &&
        !groupDropdownRef.current.contains(event.target)
      ) {
        setGroupDropdown(false);
      }
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target)
      ) {
        setLocationDropdown(false);
      }
      if (
        privilegeDropdownRef.current &&
        !privilegeDropdownRef.current.contains(event.target)
      ) {
        setPrivilegeDropdown(false);
      }
      if (
        storageDropdownRef.current &&
        !storageDropdownRef.current.contains(event.target)
      ) {
        setStorageDropdown(false);
      }
      if (
        reportingDropdownRef.current &&
        !reportingDropdownRef.current.contains(event.target)
      ) {
        setReportingDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.keyCode === 8 && !e.target.value) {
      switch (e.target.name) {
        case 'selectedGroup':
          setSelectedGroup(null);
          setSelectedGroupId('');
          break;
        case 'selectedLocation':
          setSelectedLocations(null);
          setSelectedLocationId('');
          break;
        case 'selectedPrivilege':
          setSelectedPrivilege(null);
          setSelectedPrivilegeId('');
          break;
        case 'selectedStorage':
          setSelectedStorage(null);
          setSelectedStorageId('');
          break;
        case 'selectedReporting':
          setSelectedReporting(null);
          setSelectedReportingId('');
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    const fetchGroup = () => {
      fetch(`${API_URL}/group_master`)
        .then(response => response.json())
        .then(data => setGroup(data))
        .catch(error => console.error(error))
    }
    const fetchLocation = () => {
      fetch(`${API_URL}/locations`)
        .then(response => response.json())
        .then(data => setLocation(data))
        .catch(error => console.error(error))
    }
    const fetchPrivilege = () => {
      fetch(`${API_URL}/privilege`)
        .then(response => response.json())
        .then(data => setPrivilege(data))
        .catch(error => console.error(error))
    }
    const fetchStorage = () => {
      fetch(`${API_URL}/storage`)
        .then(response => response.json())
        .then(data => setStorage(data))
        .catch(error => console.error(error))
    }
    const fetchReporting = () => {
      fetch(`${API_URL}/reporting`)
        .then(response => response.json())
        .then(data => setReporting(data))
        .catch(error => console.error(error))
    }
    fetchGroup();
    fetchLocation();
    fetchPrivilege();
    fetchStorage();
    fetchReporting();
  }, [])

  const handleGroupDropdown = () => {
    setGroupDropdown(!groupDropdown);
  }

  const handleLocationDropdown = () => {
    setLocationDropdown(!locationDropdown);
  }

  const handlePrivilegeDropdown = () => {
    setPrivilegeDropdown(!privilegeDropdown);
  }

  const handleStorageDropdown = () => {
    setStorageDropdown(!storageDropdown);
  }

  const handleReportingDropdown = () => {
    setReportingDropdown(!reportingDropdown);
  }

  const handleSelectLocation = (id, name) => {
    const index = selectedLocations.findIndex(loc => loc.id === id);
    if (index === -1) {
      setSelectedLocations([...selectedLocations, { id, name }]);
    } else {
      const updatedLocations = [...selectedLocations];
      updatedLocations.splice(index, 1);
      setSelectedLocations(updatedLocations);
    }
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    const locationIds = selectedLocations.map(loc => loc.id);
    const updatedFormData = { ...formData, locations: locationIds };
    toast.info("Creating user, please wait...", { autoClose: false });
    try {
      const response = await axios.post(`${API_URL}/createuser`, updatedFormData);
      console.log("Post created:", response.data);
      toast.success("User created successfully");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("error creating post");
      } else {
        console.error("Error creating post:", error);
        toast.error("Email already exists");
      }
    }
  }
  const handleRemoveLocation = (indexToRemove) => {
    setSelectedLocations(prevLocations => prevLocations.filter((_, index) => index !== indexToRemove));
  };


  const validateForm = () => {
    let valid = true;

    if (!formData.first_name) {
      setFirstNameError(true);
      valid = false;
    } else {
      setFirstNameError(false);
    }

    if (!formData.last_name) {
      setLastNameError(true);
      valid = false;
    } else {
      setLastNameError(false);
    }

    if (!formData.user_email_id) {
      setEmailError(true);
      valid = false;
    } else {
      setEmailError(false);
    }

    if (!formData.phone_no) {
      setPhoneNoError(true);
      valid = false;
    } else {
      setPhoneNoError(false);
    }

    if (!formData.password) {
      setPasswordError(true);
      valid = false;
    } else {
      setPasswordError(false);
    }

    if (!formData.confirmPassword) {
      setConfirmPasswordError(true);
      valid = false;
    } else {
      setConfirmPasswordError(false);
    }
    if (!formData.designation) {
      setDesignationError(true);
      valid = false;
    } else {
      setDesignationError(false);
    }
   

    return valid;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "selectedLocation") {
      // Handle location selection
      const [id, locationName] = value.split('|'); // Assuming value is in the format "id|name"
      handleSelectLocation(id, locationName);
    } else {

      setFormData({ ...formData, [name]: value, group_id: selectedGroupId, locations: selectedLocationId, role_id: selectedPrivilegeId, sl_id: selectedStorageId, user_id: selectedReportingId });
    }
  }

  return (
    <>
      <Header />
      <ToastContainer />
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-lg-2 col-md-0'></div>
          <div className='col-lg-10 col-md-12'>
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
                    <input type='text' placeholder='Enter First Name' name="first_name" style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} /><br />
                    {firstNameError && <span style={{ color: 'red' }}>First name is required<br /></span>}
                    <label className='mt-1'>Middle Name</label><br />
                    <input type='text' placeholder='Enter Middle Name' name="middle_name" style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} /><br />
                    <label className='mt-1'>Last Name<span style={{ color: 'red' }}>*</span></label><br />
                    <input type='text' placeholder='Enter Last Name' name="last_name" style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} /><br />
                    {lastNameError && <span style={{ color: 'red' }}>Last name is required<br /></span>}
                    <label className='mt-1'>Email Address<span style={{ color: 'red' }}>*</span></label><br />
                    <input type='email' placeholder='Enter Email Id' name="user_email_id" style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} /><br />
                    {emailError && <span style={{ color: 'red' }}>Email ID is required<br /></span>}
                    <label className='mt-1'>Employee Id</label><br />
                    <input type='text' placeholder='Enter Employee Id' name="emp_id" style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} /><br />
                    <label className='mt-1'>Mobile No.<span style={{ color: 'red' }}>*</span></label><br />
                    <input type='tel' placeholder='Enter Mobile No.' name="phone_no" style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} /><br />
                    {phoneNoError && <span style={{ color: 'red' }}>Mobile no. is required<br /></span>}
                    <label className='mt-1'>Password<span style={{ color: 'red' }}>*</span></label><br />
                    <input type='password' placeholder='Enter Password' name="password" style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} /><br />
                    {passwordError && <span style={{ color: 'red' }}>Password is required<br /></span>}
                    <label className='mt-1'>Confirm Password<span style={{ color: 'red' }}>*</span></label><br />
                    <input type='password' placeholder='Confirm Password' name='confirmPassword' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} /><br />
                    {confirmPasswordError && <span style={{ color: 'red' }}>Confirm Password is required<br /></span>}
                    <label className='mt-1'>User Type</label>
                    <select name="user_type" id="usertype" class="form-control select2" style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange}>
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
                    {designationError && <span style={{ color: 'red' }}>Designation is required<br /></span>}
                    <label className='mt-1'>Select Group<span style={{ color: 'red' }}>*</span></label><br />
                    <input
                      ref={groupDropdownRef}
                      type="text"
                      placeholder="Select Group"
                      className="form-control"
                      style={{ width: "100%", height: "35px", border: "1px solid lightgray", borderRadius: "2px" }}
                      value={selectedGroup || ""}
                      onClick={handleGroupDropdown}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      name="selectedGroup"
                    />
                    {groupError && <span style={{ color: 'red' }}>Group is required<br /></span>}
                    {groupDropdown && (
                      <div className='group-dropdown' >
                        {group && group.map((elem, index) => (
                          <div key={index} className='group-card' onClick={() => handleSelectGroup(elem.group_id, `${elem.group_name}`)}>
                            <p>{elem.group_name}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <label className='mt-1'>Select Location</label><br />
                    <div>
                      {selectedLocations.map((location, index) => (
                        <span key={index} style={{color:'#107393'}}>
                          {location.name}
                          <button className='close-btn' onClick={() => handleRemoveLocation(index)}>&times;</button> {/* Delete button */}
                        </span>
                      ))}
                    </div>
                    <input
                      ref={locationDropdownRef}
                      type="text"
                      placeholder="Select Location"
                      className="form-control"
                      style={{ width: "100%", height: "35px", border: "1px solid lightgray", borderRadius: "2px" }}
                      
                      onClick={handleLocationDropdown}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                    />
                    {/* <input ref={locationDropdownRef} type='text' placeholder='Select Location' className='form-control' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} value={selectedLocation || ''} onClick={handleLocationDropdown} onChange={handleInputChange} onKeyDown={handleKeyDown} /> */}
                    {locationDropdown && (
                      <div className='group-dropdown'>
                        {location && location.map((elem, index) => (
                          <div key={index} className='group-card' onClick={() => handleSelectLocation(elem.LocationID, `${elem.LocationName}`)} >
                            <p>{elem.LocationName}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <label className='mt-1'>Select User's Privilege<span style={{ color: 'red' }}>*</span></label><br />
                    <input ref={privilegeDropdownRef} type='text' placeholder='Select Users Privilege' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} value={selectedPrivilege || ''} onClick={handlePrivilegeDropdown} onChange={handleInputChange} onKeyDown={handleKeyDown} /><br />
                    {privilegeError && <span style={{ color: 'red' }}>Privilege is required<br /></span>}
                    {privilegeDropdown && (
                      <div className='group-dropdown'>
                        {privilege && privilege.map((elem, index) => (
                          <div key={index} className='group-card' onClick={() => handleSelectPrivilege(elem.role_id, `${elem.user_role}`)}>
                            <p>{elem.user_role}</p>

                          </div>
                        ))}

                      </div>

                    )}
                    <label className='mt-1'>Select Storage</label><br />
                    <input ref={storageDropdownRef} type='text' placeholder='Select Storage' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} value={selectedStorage || ''} onClick={handleStorageDropdown} onChange={handleInputChange} onKeyDown={handleKeyDown} /><br />
                    {storageDropdown && (
                      <div className='group-dropdown'>
                        {storage && storage.map((elem, index) => (
                          <div key={index} className='group-card' onClick={() => handleSelectStorage(elem.sl_id, `${elem.sl_name}`)}>
                            <p>{elem.sl_name}</p>
                          </div>
                        ))}
                      </div>

                    )}
                    <label className='mt-1'>Select Reporting To</label><br />
                    <input ref={reportingDropdownRef} type='text' placeholder='Select Reporting To' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} value={selectedReporting || ''} onClick={handleReportingDropdown} onChange={handleInputChange} onKeyDown={handleKeyDown} />
                    {reportingDropdown && (
                      <div className='group-dropdown'>
                        {reporting && reporting.map((elem, index) => (
                          <div key={index} className='group-card' onClick={() => handleSelectReporting(elem.user_id, `${elem.first_name} ${elem.last_name} (${elem.user_email_id})`)}>
                            <p>{elem.first_name} {elem.last_name} ({elem.user_email_id})</p>
                          </div>
                        ))}
                      </div>
                    )
                    }
                    <label className='mt-1'>Set date for disabling the user ID</label><br />
                    <input type='date' placeholder='13-03-24' name="login_disabled_date" style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} /><br />
                    <label className='mt-1'>Profile Picture</label><br />
                    <input type='file' name="profile_picture" style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} /><br />
                    <input type='submit' className='mt-3' onClick={handleFormSubmit} />
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

