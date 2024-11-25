import React, { useEffect, useState } from 'react'
import Header from './Components/Header'
import Footer from './Components/Footer'
import DatePicker from 'react-datepicker';
import { ProcessCardData } from './ProcessCardData';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import readXlsxFile from 'read-excel-file';
import { API_URL } from './Api';
import { ToastContainer, toast } from 'react-toastify';

const MIS_Form = () => {
  const [blrData, setBLRData] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [location, setLocation] = useState();
  const [manager, setManager] = useState();
  const [showLocation, setShowLocation] = useState(false);
  const [designation, setDesignation] = useState();
  const [usermaster, setUsermaster] = useState();
  const [projectHead, showProjectHead] = useState();
  const [projectOwner, showProjectOwner] = useState();
  const [projectMan, showProjectMan] = useState();
  const [selectedPH, setSelectedPH] = useState(null);
  const [selectedPHId, setSelectedPHId] = useState('');
  const [selectedPM, setSelectedPM] = useState(null);
  const [selectedPMId, setSelectedPMId] = useState('');
  const [siteMan, showSiteMan] = useState();
  const [selectedSMId, setSelectedSMId] = useState('');
  const [selectedSM, setSelectedSM] = useState(null);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [status, setStatus] = useState();
  const [manpowerForm, setManpowerForm] = useState({
    PH_Id: '', PM_Id: '', Coll_Index_MP: '', Barc_MP: '', Barc_TF: '', Barc_TI: '', Page_No_MP: '', Prepare_MP: '',
    Prepare_TF: '', Prepare_TI: '', Scan_MP: '', Cover_Page_MP: '', Cover_Page_TF: '', Rescan_MP: '', Image_QC_MP: '',
    Doc_MP: '', Index_MP: '', CBSL_QA_MP: '', Ready_Cust_QA_MP: '', Cust_QA_Done_MP: '', PDF_Export_MP: '',
    Refilling_Files_MP: '', Inventory_MP: '', Scaning_Target_A3: '',
    Scaning_Capacity_A3: '', Scaning_Capacity_A4: '', QC_Target: '', Post_QC_Target: '', Location_ID: '', 
    EntryDate: '',
    expected_volume: ''

  })
  const [newData, setNewData] = useState({ PH_Id: '', PM_Id: '', Location_Id: '', });
  const [formData, setFormData] = useState({ Desig_ID: '', Desig_name: '' })
  const [errorMessage, setErrorMessage] = useState('');
  const [excelData, setExcelData] = useState(null);

  useEffect(() => {

    const locationData = () => {
      fetch(`${API_URL}/locations`)
        .then(respsone => respsone.json())
        .then(data => setLocation(data))
        .catch(error => console.error(error))
      console.log("Locations", location);
    }
    const ManagerData = () => {
      fetch(`${API_URL}/getmanager`)
        .then(respsone => respsone.json())
        .then(data => setManager(data))
        .catch(error => console.error(error))
      console.log("Manager", manager);
    }
    const designationData = () => {
      fetch(`${API_URL}/designations`)
        .then(respsone => respsone.json())
        .then(data => setDesignation(data))
        .catch(error => console.error(error))
    }
    const usermasterData = () => {
      fetch(`${API_URL}/usermaster`)
        .then(respsone => respsone.json())
        .then(data => setUsermaster(data))
        .catch(error => console.error(error))
      console.log("Designations", usermaster);
    }
    const fetchLastInsertedData = async () => {
      try {
        const response = await axios.get(`${API_URL}/site_MPData`);
        const site_MPData = response.data;
        console.log("Manpower Data", site_MPData);
        setFormData({
          // PM_Id: site_MPData.PM_Id || '',
          // SM_Name: site_MPData.SM_Name || '',
          Coll_Index_MP: site_MPData.Coll_Index_MP || ''
        });
        console.log("PM_ID", site_MPData);
      } catch (error) {
        console.error("Error fetching last inserted data:", error);
      }
    };
    fetchLastInsertedData();
    locationData();
    ManagerData();
    designationData();
    usermasterData();

  }, [])
  const handleShowLocation = () => {
    setShowLocation(!showLocation);
  }
  const handleShowProjectHead = () => {
    showProjectHead(!projectHead);
  }
  const handleShowProjectOwner = () => {
    showProjectOwner(!projectOwner);
  }
  const handleShowProjectMan = () => {
    showProjectMan(!projectMan);
  }
  const handleShowSiteMan = () => {
    showSiteMan(!siteMan);
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value); // Log the name and value to verify
    setFormData({ ...formData, [name]: value });
    setNewData({ ...newData, [name]: value });
  };
  const handleSelectPH = (id, name) => {
    setSelectedPH(name);
    setSelectedPHId(parseInt(id));
    showProjectHead(!projectHead);
  };
  const handleSelectPM = (id, name) => {
    setSelectedPM(name);
    setSelectedPMId((id));
    showProjectMan(!projectMan);
  };
  const handleSelectSM = (id, name) => {
    setSelectedSM(name);
    setSelectedSMId(parseInt(id));
    showSiteMan(!siteMan);
  };
  const handleSelectLocation = (id, name) => {
    setSelectedLocation(name);
    setSelectedLocationId(parseInt(id));
    setShowLocation(!showLocation);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Check if the field being updated is EntryDate
    const formattedValue =
      name === "EntryDate" && value
        ? new Date(value).toISOString().split("T")[0] // Format the date to YYYY-MM-DD
        : value; // Use the value as-is for other fields

    setManpowerForm((prevState) => ({
      ...prevState,
      [name]: formattedValue,
      PM_Id: selectedPMId,
      PH_Id: selectedPHId,
      Location_ID: selectedLocationId,
    }));
  };

  const handleManPowerForm = async () => {
    const formData = new FormData();
    formData.append('file', excelData);

    // Append other fields to 
    formData.append('PH_Id', selectedPHId);
    formData.append('PO_Id', 23);
    formData.append('PM_Id', selectedPMId);
    formData.append('PCo_Id', '59');
    formData.append('SM_Id', selectedSMId);
    formData.append('Location_ID', selectedLocationId);
    

    // Append manpowerForm fields to FormData if not using Excel data
    if (!excelData) {
      Object.entries(manpowerForm).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    try {
      let response;
      if (excelData) {
        // If an Excel file is uploaded, call the uploadExcel API
        response = await axios.post(`${API_URL}/uploadExcel`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log("Data from Excel file submitted:", response.data);
      } else {
        // If no Excel file is uploaded, submit the form with manually entered data using the site_MP API
        response = await axios.post(`${API_URL}/site_MP`, manpowerForm);


      }
      if (response.status === 200) {
        toast.success("Data Submitted Successfully");
      } else {
        throw new Error("Failed to submit data");
      }
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error submitting data. Please try again.');
      console.error("Error submitting data:", error);
    }
  };
  const handleFileUpload = (e) => {
    setExcelData(e.target.files[0]);
  };
  console.log("IDs",selectedPHId,selectedPMId,selectedLocationId );
  return (
    <>
      <Header />
      <ToastContainer />
      <div className='container '>
        <div className='row'>
          <div className='col-2'></div>
          <div className='col-10'>
            <h3 className='text-center'>Telangana MIS</h3>
            <h5 className='text-center'>Input Screen for user at site to enter the data on daily basis</h5>
            <div className='row mt-4 process-card'>
              <div className='row'>
              <div className='col-3'>
                <span>Select Date: </span>
                <input
                  type="date"
                  name="EntryDate"
                  value={manpowerForm.EntryDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className='col-3'>
                <span style={{marginLeft:'-5px'}}>Select Location: </span>
                <input type='text' 
                placeholder='Location' 
                name='Location_Id' 
                value={selectedLocation || ''} 
                onClick={handleShowLocation} 
                onChange={handleInputChange} 
                style={{marginLeft:'-5px'}}/>
                {showLocation && (
                  <>
                    <div className='locations-card'>
                      {location && location.map((elem, index) => (
                        <div key={index} onClick={() => handleSelectLocation(elem.LocationID, `${elem.LocationName}`)}>
                          <p>{elem.LocationName}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className='col-3'>
                <span style={{marginLeft:'-10px'}}>Project Head Name: </span>
                <input type='text' 
                placeholder='Select PH Name' 
                name='PH_Id' 
                value={selectedPH || ''} 
                onClick={handleShowProjectHead} 
                onChange={handleInputChange} required 
                style={{marginLeft:'-10px'}}
                />
                {projectHead && (
                  <div className='dropdown-card'>
                    {usermaster.filter(user => user.designation.toLowerCase() === "project head").map((elem, index) => (
                      <div key={index} onClick={() => handleSelectPH(elem.user_id, `${elem.first_name} ${elem.last_name}`)}>
                        <p>{elem.first_name} {elem.last_name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className='col-3'>
                <span style={{marginLeft:'-15px'}}>Project Manager Name: </span>
                <input type='text' 
                placeholder='Select PM Name' 
                name='PM_Id' 
                value={selectedPM || ''} 
                onClick={handleShowProjectMan} 
                onChange={handleInputChange} 
                style={{marginLeft:'-15px'}}
                />
                {projectMan && (
                  <div className='pm-card'>
                    {manager && manager.map((elem, index) => (
                      <div key={index} onClick={() => handleSelectPM(elem.id, `${elem.Manager_Name}`)}>
                        <p>{elem.Manager_Name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              </div>
              {/* <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} /> */}
              <div className='row '>
                <div className='row'>
                  <div className='col-3'>
                    <span>Collection MP: </span>
                    <input type='text' name='Coll_Index_MP' onChange={handleInputChange} required /><br />
                  </div>
                  <div className='col-3'>
                    <span>Barcoding MP: </span>
                    <input type='text' name='Barc_MP' onChange={handleInputChange} required /><br />
                  </div>
                  <div className='col-3 '>
                    <span>Barcoding Files: </span>
                    <input type='text' name='Barc_TF' onChange={handleInputChange} required />
                  </div>
                  <div className='col-3'>
                    <span>Barcoding Images: </span>
                    <input type='text' name='Barc_TI' onChange={handleInputChange} required />
                  </div>
                </div>
                <div className='row'>
                  <div className='col-3'>
                    <span>Page Numbering MP: </span>
                    <input type='text' name='Page_No_MP' onChange={handleInputChange} required /><br />
                  </div>
                  <div className='col-3'>
                    <span>Preparation MP: </span>
                    <input type='text' name='Prepare_MP' onChange={handleInputChange} required /><br />
                  </div>
                  <div className='col-3'>
                    <span>Preparation Files: </span>
                    <input type='text' name='Prepare_TF' onChange={handleInputChange} required />
                  </div>
                  <div className='col-3'>
                    <span>Preparation Images: </span>
                    <input type='text' name='Prepare_TI' onChange={handleInputChange} required />
                  </div>
                </div>
                <div className='row'>
                  <div className='col-3'>
                    <span>Scanning MP: </span>
                    <input type='text' name='Scan_MP' onChange={handleInputChange} required /><br />
                  </div>
                  <div className='col-3'>
                    <span>Cover Page Scanning MP: </span>
                    <input type='text' name='Cover_Page_MP' onChange={handleInputChange} required /><br />
                  </div>
                  <div className='col-3'>
                    <span>Cover Page Scanning Files: </span>
                    <input type='text' name='Cover_Page_TF' onChange={handleInputChange} required />
                  </div>
                  <div className='col-3'>
                    <span>Rescanning MP: </span>
                    <input type='text' name='Rescan_MP' onChange={handleInputChange} required /><br />
                  </div>
                </div>
                <div className='row'>
                  <div className='col-3'>
                    <span>Image QC MP: </span>
                    <input type='text' name='Image_QC_MP' onChange={handleInputChange} required /><br />
                  </div>
                  <div className='col-3'>
                    <span>Flagging MP: </span>
                    <input type='text' name='Doc_MP' onChange={handleInputChange} required /><br />
                  </div>
                  <div className='col-3'>
                    <span>Indexing MP: </span>
                    <input type='text' name='Index_MP' onChange={handleInputChange} required /><br />
                  </div>
                  <div className='col-3'>
                    <span>CBSL QA MP: </span>
                    <input type='text' name='CBSL_QA_MP' onChange={handleInputChange} required /><br />
                  </div>
                </div>
                <div className='row'>
                  <div className='col-3'>
                    <span>Ready for Custom QA MP: </span>
                    <input type='text' name='Ready_Cust_QA_MP' onChange={handleInputChange} required /><br />
                  </div>
                  <div className='col-3'>
                    <span>Customer QA Done MP: </span>
                    <input type='text' name='Cust_QA_Done_MP' onChange={handleInputChange} required /><br />
                  </div>
                  <div className='col-3'>
                    <span>DMS Upload MP: </span>
                    <input type='text' name='PDF_Export_MP' onChange={handleInputChange} required /><br />
                  </div>
                  <div className='col-3'>
                    <span>Inventory Out MP: </span>
                    <input type='text' name='Inventory_MP' onChange={handleInputChange} required /><br />
                  </div>
                </div>
                <div className='row'>
                  <div className='col-3'>
                    <span>Refilling MP: </span>
                    <input type='text' name='Refilling_Files_MP' onChange={handleInputChange} required /><br />
                  </div>
                  <div className='col-3'>
                    <span>Refilling Files: </span>
                    <input type='text' name='Refilling_Files_TF' onChange={handleInputChange} required />
                  </div>
                  <div className='col-3'>
                    <span>Refilling Images: </span>
                    <input type='text' name='Refilling_Files_TI' onChange={handleInputChange} required />
                  </div>
                  <div className='col-3'>
                    <span>Scanning Target: </span>
                    <input type='text' name='Scaning_Target_A3' onChange={handleInputChange} required /><br />
                  </div>
                </div>
                <div className='row'>
                  <div className='col-3'>
                    <span>Scanning Capacity A3: </span>
                    <input type='text' name='Scaning_Capacity_A3' onChange={handleInputChange} required /><br />
                  </div>
                  <div className='col-3'>
                    <span>Scanning Capacity A4: </span>
                    <input type='text' name='Scaning_Capacity_A4' onChange={handleInputChange} required /><br />
                  </div>
                  <div className='col-3'>
                    <span>QC Target: </span>
                    <input type='text' name='QC_Target' onChange={handleInputChange} required /><br />
                  </div>
                  <div className='col-3'>
                    <span>Target: </span>
                    <input type='text' name='Post_QC_Target' onChange={handleInputChange} required /><br />
                  </div>
                </div>
                <div className='row'>
                  <div className='col-3'>
                    <span>Expected Volume: </span>
                    <input type='text' name='expected_volume' onChange={handleInputChange} required /><br />
                  </div>
                </div>
              </div>
            </div>
            <div className='row mt-3 btn-row'>
              {errorMessage && <span className="error-message" style={{ color: 'red' }}>{errorMessage}</span>}
              <button className='btn process-btn me-2' onClick={handleManPowerForm}>Submit</button>
            </div>
          </div>
        </div>
      </div >

      <Footer />
    </>
  )
}


export default MIS_Form;