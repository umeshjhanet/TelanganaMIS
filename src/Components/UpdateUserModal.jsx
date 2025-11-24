import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { API_URL } from '../Api';

const UpdateUserModal = ({ onClose, userId }) => {
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
  const [selectedGroupName, setSelectedGroupName] = useState('');
  const [selectedLocationName, setSelectedLocationName] = useState('');
  const [selectedPrivilegeName, setSelectedPrivilegeName] = useState('');
  const [selectedStorageName, setSelectedStorageName] = useState('');
  const [setUserEmail,userEmail]=useState('');

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

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/${userId}`);
        const userData = response.data;

        setFormData({
          ...userData,
        });
        // setNewData({
        //   ...userData,
        // });
        setSelectedGroupId(userData.groups.map(group => group.id).join(', '));
        setSelectedGroupName(userData.groups.map(group => group.name).join(', '));
        setSelectedLocationId(userData.locations);
        setSelectedLocationName(userData.location_name);
        setSelectedPrivilegeId(userData.roles.map(role => role.id).join(', '));
        setSelectedPrivilegeName(userData.roles.map(role => role.name).join(', '));
        setSelectedStorageId(userData.storageLevels.map(storage => storage.id).join(', '));
        setSelectedStorageName(userData.storageLevels.map(storage => storage.name).join(', '));

      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

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
    const fetchEmail = () => {
      fetch(`${API_URL}/user_email`)
        .then(response => response.json())
        .then(data => setEmail(data))
        .catch(error => console.error(error))
    }


    const fetchReporting = () => {
      fetch(`${API_URL}/reporting`)
        .then(response => response.json())
        .then(data => setReporting(data))
        .catch(error => console.error(error))
    }
    // fetchGroup();
    // fetchEmail();
    // fetchLocation();
    // fetchPrivilege();
    // fetchStorage();
    // fetchReporting();
    // fetchLocation();
    // fetchPrivilege();
    // fetchStorage();
    // fetchReporting();
    fetchUserDetails();
  }, [userId])

  useEffect(() => {
  const fetchAllData = async () => {
    try {
      const [groupRes, locationRes, privilegeRes, storageRes, reportingRes,email] = await Promise.all([
        axios.post(`${API_URL}/group_master`),
        axios.post(`${API_URL}/locations`),
        axios.post(`${API_URL}/privilege`),
        axios.post(`${API_URL}/storage`),
        axios.post(`${API_URL}/reporting`),
       
      
      ]);

      setGroup(groupRes.data);
      setLocation(locationRes.data);
      setPrivilege(privilegeRes.data);
      setStorage(storageRes.data);
      setReporting(reportingRes.data);
     

    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };
  

  fetchAllData();
}, [userId]);



  const handleEditSubmitUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_URL}/createuserupdate/${userId}`,
        {
          user_email_id: formData.user_email_id,
          first_name: formData.first_name,
          middle_name: formData.middle_name,
          last_name: formData.last_name,
          password: formData.password,
          designation: formData.designation,
          phone_no: formData.phone_no,
          profile_picture: formData.profile_picture,
          login_disabled_date: formData.login_disabled_date,
          emp_id: formData.emp_id,
          locations: formData.locations,
          user_type: formData.user_type,
          role_id: selectedPrivilegeId, // Send selected privilege ID
          user_id: selectedReportingId, // Send selected reporting ID
          group_id: selectedGroupId, // Send selected group ID
          sl_id: selectedStorageId,
        }

      );
      onClose();

      toast.success("User Updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

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
    setSelectedLocation(name);
    setSelectedLocationId(parseInt(id));
    setShowLocation(!showLocation);
    setLocationDropdown(false);
  };
  const handleSelectGroup = (id, name) => {
    setSelectedGroup(name);
    setSelectedGroupId(parseInt(id));
    setShowGroup(!showLocation);
    setGroupDropdown(false);
  };
  const handleSelectPrivilege = (id, name) => {
    setSelectedPrivilege(name);
    setSelectedPrivilegeId(parseInt(id));
    setShowPrivilege(!showLocation);
    setPrivilegeDropdown(false);
  };
  const handleSelectStorage = (id, name) => {
    setSelectedStorage(name);
    setSelectedStorageId(parseInt(id));
    // setShowStorage(!showLocation);
    setStorageDropdown(false);
  };
  const handleSelectReporting = (id, name) => {
    setSelectedReporting(name);
    setSelectedReportingId(parseInt(id));
    setShowReporting(!showLocation);
    setReportingDropdown(false)
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value, group_id: selectedGroupId, locations: selectedLocationId, role_id: selectedPrivilegeId, sl_id: selectedStorageId, user_id: selectedReportingId });

  }
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <div className='user-form-card mt-3'>
          <div className='row'>
            <div className='col-6'>
              <div className='user-form-card'>
                <label>First Name<span style={{ color: 'red' }}>*</span></label><br />
                <input type='text' placeholder="Enter First Name" name="first_name" value={formData.first_name} style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} /><br />

                <label className='mt-1'>Middle Name</label><br />
                <input type='text' placeholder='Enter Middle Name' name="middle_name" value={formData.middle_name} style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} /><br />
                <label className='mt-1'>Last Name<span style={{ color: 'red' }}>*</span></label><br />
                <input type='text' placeholder='Enter Last Name' name="last_name" value={formData.last_name} style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} /><br />
                <label className='mt-1'>Email Address<span style={{ color: 'red' }}>*</span></label><br />
                <input type='email' placeholder='Enter Email Id' name="user_email_id" value={formData.user_email_id} style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} readOnly /><br />
                <label className='mt-1'>Employee Id</label><br />
                <input type='text' placeholder='Enter Employee Id' name="emp_id" value={formData.emp_id} style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} /><br />
                <label className='mt-1'>Mobile No.<span style={{ color: 'red' }}>*</span></label><br />
                <input type='number' placeholder='Enter Mobile No.' name="phone_no" value={formData.phone_no} style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} /><br />
                <label className='mt-1'>Password<span style={{ color: 'red' }}>*</span></label><br />
                <input type='password' placeholder='Enter Password' name="password" value={formData.password} style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} /><br />
                <label className='mt-1'>Confirm Password<span style={{ color: 'red' }}></span></label><br />
                <input type='password' placeholder='Confirm Password' name='confirmPassword' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} /><br />
                <label className='mt-1'>User Type</label>
                <select name="user_type" id="usertype" value={formData.user_type} className="form-control select2" style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange}>
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
                <input type='text' placeholder='Select Designation' name="designation" value={formData.designation} style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} /><br />

                <label className='mt-1'>Select Group<span style={{ color: 'red' }}>*</span></label><br />
                <input type='text' placeholder='Select Group' className='form-control' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} value={selectedGroupName || ''} onClick={handleGroupDropdown} onChange={handleInputChange} />
                {groupDropdown && (
                  <div className='group-dropdown'>
                    {group && group.map((elem, index) => (
                      <div key={index} className='group-card' onClick={() => handleSelectGroup(elem.group_id, `${elem.group_name}`)}>
                        <p>{elem.group_name}</p>
                      </div>
                    ))}
                  </div>
                )}
                <label className='mt-1'>Select Location <span style={{ color: 'red' }}>*</span></label><br />
                <input type='text' placeholder='Select Location' className='form-control' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} value={selectedLocationName || ''} onClick={handleLocationDropdown} onChange={handleInputChange} />
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
                <input type='text' placeholder='Select Users Privilege' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} value={selectedPrivilegeName || ''} onClick={handlePrivilegeDropdown} onChange={handleInputChange} /><br />
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
                <input type='text' placeholder='Select Storage' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} value={selectedStorageName || ''} onClick={handleStorageDropdown} onChange={handleInputChange} /><br />
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
                <input type='text' placeholder='Select Reporting To' style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} value={selectedReporting || ''} onClick={handleReportingDropdown} onChange={handleInputChange} /><br />
                {reportingDropdown && (
                  <div className='group-dropdown'>
                    {reporting && reporting.map((elem, index) => (
                      <div key={index} onClick={() => handleSelectReporting(elem.user_id, `${elem.first_name} ${elem.last_name} (${elem.user_email_id})`)}>
                        <p>{elem.first_name} {elem.last_name} ({elem.user_email_id})</p>
                      </div>
                    ))}
                  </div>
                )}
                <label className='mt-1'>Set date for disabling the user ID</label><br />
                <input type='date' placeholder='13-03-24' name="login_disabled_date" value={formData.login_disabled_date} style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} /><br />
                <label className='mt-1'>Profile Picture<span style={{ color: 'red' }}>*</span></label><br />
                <input type='file' name="profile_picture" style={{ width: '100%', height: '35px', border: '1px solid lightgray', borderRadius: '2px' }} onChange={handleInputChange} /><br />
                <input type='submit' className='mt-3' onClick={handleEditSubmitUser} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateUserModal



