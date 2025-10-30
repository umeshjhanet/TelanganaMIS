import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import DatePicker from 'react-datepicker';
import { ProcessCardData } from '../ProcessCardData';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import readXlsxFile from 'read-excel-file';
import { API_URL } from '../Api';
import { ToastContainer, toast } from 'react-toastify';

const MIS_Form = ({ showSideBar }) => {
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
  const [selectedPH, setSelectedPH] = useState('');
  const [selectedPHId, setSelectedPHId] = useState('');
  const [selectedPM, setSelectedPM] = useState('');
  const [selectedPMId, setSelectedPMId] = useState('');
  const [siteMan, showSiteMan] = useState();
  const [selectedSMId, setSelectedSMId] = useState('');
  const [selectedSM, setSelectedSM] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [lastInsertedData, setLastInsertedData] = useState('');
  const [status, setStatus] = useState();
  const [manpowerData, setManpowerData] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [manpowerForm, setManpowerForm] = useState({
    PH_Id: '', PM_Id: '', Coll_Index_MP: '', Barc_MP: '', Barc_TF: '', Barc_TI: '', Page_No_MP: '', Prepare_MP: '',
    Prepare_TF: '', Prepare_TI: '', Scan_MP: '', Cover_Page_MP: '', Cover_Page_TF: '', Rescan_MP: '', Image_QC_MP: '',
    Doc_MP: '', Index_MP: '', CBSL_QA_MP: '', Ready_Cust_QA_MP: '', Cust_QA_Done_MP: '', PDF_Export_MP: '',
    Refilling_Files_MP: '', Inventory_MP: '', Scaning_Target_A3: '',
    Scaning_Capacity_A3: '', Scaning_Capacity_A4: '', QC_Target: '', Post_QC_Target: '', Location_ID: '',
    EntryDate: '',
    expected_volume: '', Inv_Out_Files: ''

  })
  const [newData, setNewData] = useState({ PH_Id: '', PM_Id: '', Location_Id: '', });
  const [formData, setFormData] = useState('')
  const [errorMessage, setErrorMessage] = useState('');
  const [excelData, setExcelData] = useState(null);

  useEffect(() => {

    const locationData = () => {
      fetch(`${API_URL}/locations`)
        .then(respsone => respsone.json())
        .then(data => setLocation(data))
        .catch(error => console.error(error))

    }
    const ManagerData = () => {
      fetch(`${API_URL}/getmanager`)
        .then(respsone => respsone.json())
        .then(data => setManager(data))
        .catch(error => console.error(error))

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

    }

    const fetchManpowerData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/manpower_data`);
        setManpowerData(response.data);
      } catch (err) {
        setError('Error fetching report data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    const fetchLastInsertedData = async (locationId) => {
      try {
        const response = await fetch(`${API_URL}/manpower_data?locationname=${selectedLocationId}`);
        const data = await response.json();

        if (data) {
          setLastInsertedData(data);
        } else {
          setLastInsertedData(null);
        }
      } catch (error) {
        console.error('Error fetching last inserted data:', error);
      }
    };

    fetchManpowerData();
    fetchLastInsertedData();
    locationData();
    ManagerData();
    designationData();
    usermasterData();

  }, [selectedLocationId])

  useEffect(() => {
    if (lastInsertedData) {

      setFormData({
        PH_Id: selectedPHId,
        PM_Id: selectedPMId,
        Location_ID: selectedLocationId,
        Coll_Index_MP: lastInsertedData.Coll_Index_MP,
        Barc_MP: lastInsertedData.Barc_MP,
        Barc_TF: lastInsertedData.Barc_TF,
        Barc_TI: lastInsertedData.Barc_TI,
        Page_No_MP: lastInsertedData.Page_No_MP,
        Prepare_MP: lastInsertedData.Prepare_MP,
        Prepare_TF: lastInsertedData.Prepare_TF,
        Prepare_TI: lastInsertedData.Prepare_TI,
        Scan_MP: lastInsertedData.Scan_MP,
        Cover_Page_MP: lastInsertedData.Cover_Page_MP,
        Cover_Page_TF: lastInsertedData.Cover_Page_TF,
        Rescan_MP: lastInsertedData.Rescan_MP,
        Image_QC_MP: lastInsertedData.Image_QC_MP,
        Doc_MP: lastInsertedData.Doc_MP,
        Index_MP: lastInsertedData.Index_MP,
        CBSL_QA_MP: lastInsertedData.CBSL_QA_MP,
        Ready_Cust_QA_MP: lastInsertedData.Ready_Cust_QA_MP,
        Cust_QA_Done_MP: lastInsertedData.Cust_QA_Done_MP,
        PDF_Export_MP: lastInsertedData.PDF_Export_MP,
        Refilling_Files_MP: lastInsertedData.Refilling_Files_MP,
        Inventory_MP: lastInsertedData.Inventory_MP,
        Scaning_Target_A3: lastInsertedData.Scaning_Target_A3,
        Scaning_Capacity_A3: lastInsertedData.Scaning_Capacity_A3,
        Scaning_Capacity_A4: lastInsertedData.Scaning_Capacity_A4,
        QC_Target: lastInsertedData.QC_Target,
        Post_QC_Target: lastInsertedData.Post_QC_Target,
        EntryDate: manpowerForm.EntryDate,
        expected_volume: lastInsertedData.expected_volume,
        Inv_Out_Files: lastInsertedData.Inv_Out_Files
      });
    }
  }, [lastInsertedData, selectedLocationId]);
  const handleShowLocation = () => {
    setShowLocation(!showLocation);
  }
  const handleShowProjectHead = () => {
    showProjectHead(!projectHead);
  }
  const handleShowProjectMan = () => {
    showProjectMan(!projectMan);
  }
  const handleChange = (e) => {
    const { name, value } = e.target;

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

    setFormData((formData) => ({
      ...formData,
      [name]: formattedValue,
      PM_Id: selectedPMId,
      PH_Id: selectedPHId,
      Location_ID: selectedLocationId,
    }));
  };

  const handleManPowerForm = async () => {
    try {
      const response = await axios.post(`${API_URL}/site_MP`, formData);
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

  return (
    <>

      <ToastContainer />
      <div className='container '>
        <div className='row'>
          <div className={`${showSideBar ? 'col-lg-1 col-md-0' : 'col-lg-2 col-md-0'} d-none d-lg-block`}></div>
          <div className={`${showSideBar ? 'col-lg-11 col-md-12' : 'col-lg-10 col-md-12 '} col-sm-12`}>
            <h3 className='text-center'>Telangana MIS</h3>
            <h5 className='text-center'>Input Screen for user at site to enter the data on daily basis</h5>
            <div className='row mt-4 process-card'>
              <div className='row'>
                <div className='col-3'>
                  <span>Select Date: </span>
                  <input
                    type="date"
                    name="EntryDate"
                    value={formData.EntryDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='col-3'>
                  <span style={{ marginLeft: '-5px' }}>Select Location: </span>
                  <input type='text'
                    placeholder='Location'
                    name='Location_Id'
                    value={selectedLocation || ''}
                    onClick={handleShowLocation}
                    onChange={handleInputChange}
                    style={{ marginLeft: '-5px' }} />
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
                  <span style={{ marginLeft: '-10px' }}>Project Head Name: </span>
                  <input type='text'
                    placeholder='Select PH Name'
                    name='PH_Id'
                    value={selectedPH || ''}
                    onClick={handleShowProjectHead}
                    onChange={handleInputChange} required
                    style={{ marginLeft: '-10px' }}
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
                  <span style={{ marginLeft: '-15px' }}>Project Manager Name: </span>
                  <input type='text'
                    placeholder='Select PM Name'
                    name='PM_Id'
                    value={selectedPM || ''}
                    onClick={handleShowProjectMan}
                    onChange={handleInputChange}
                    style={{ marginLeft: '-15px' }}
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
                    <input type='text' name='Coll_Index_MP'
                      value={formData.Coll_Index_MP}
                      onChange={(e) => setFormData({ ...formData, Coll_Index_MP: e.target.value })} required /><br />
                  </div>
                  <div className='col-3'>
                    <span>Scanning MP: </span>
                    <input type='text' name='Scan_MP' value={formData.Scan_MP}
                      onChange={(e) => setFormData({ ...formData, Scan_MP: e.target.value })} required /><br />
                  </div>
                  <div className='col-3'>
                    <span>Image QC MP: </span>
                    <input type='text' name='Image_QC_MP' value={formData.Image_QC_MP}
                      onChange={(e) => setFormData({ ...formData, Image_QC_MP: e.target.value })} required /><br />
                  </div>
                  <div className='col-3'>
                    <span>Flagging MP: </span>
                    <input type='text' name='Doc_MP' value={formData.Doc_MP}
                      onChange={(e) => setFormData({ ...formData, Doc_MP: e.target.value })} required /><br />
                  </div>

                </div>
                <div className='row'>
                  <div className='col-3'>
                    <span>Indexing MP: </span>
                    <input type='text' name='Index_MP' value={formData.Index_MP}
                      onChange={(e) => setFormData({ ...formData, Index_MP: e.target.value })} required /><br />
                  </div>
                  <div className='col-3'>
                    <span>CBSL QA MP: </span>
                    <input type='text' name='CBSL_QA_MP' value={formData.CBSL_QA_MP}
                      onChange={(e) => setFormData({ ...formData, CBSL_QA_MP: e.target.value })} required /><br />
                  </div>
                  <div className='col-3'>
                    <span>Customer QA Done MP: </span>
                    <input type='text' name='Cust_QA_Done_MP' value={formData.Cust_QA_Done_MP}
                      onChange={(e) => setFormData({ ...formData, Cust_QA_Done_MP: e.target.value })} required /><br />
                  </div>
                  <div className='col-3'>
                    <span>DMS Upload MP: </span>
                    <input type='text' name='PDF_Export_MP' value={formData.PDF_Export_MP}
                      onChange={(e) => setFormData({ ...formData, PDF_Export_MP: e.target.value })} required /><br />
                  </div>
                </div>
                <div className='row'>

                  <div className='col-3'>
                    <span>Inventory Out MP: </span>
                    <input type='text' name='Inventory_MP' value={formData.Inventory_MP}
                      onChange={(e) => setFormData({ ...formData, Inventory_MP: e.target.value })} required /><br />
                  </div>
                  <div className='col-3'>
                    <span>Inventory Out Files: </span>
                    <input type='text' name='Inv_Out_Files' value={formData.Inv_Out_Files}
                      onChange={(e) => setFormData({ ...formData, Inv_Out_Files: e.target.value })} required /><br />
                  </div>
                  <div className='col-3'>
                    <span>Target: </span>
                    <input type='text' name='Scaning_Target_A3' value={formData.Scaning_Target_A3}
                      onChange={(e) => setFormData({ ...formData, Scaning_Target_A3: e.target.value })} required /><br />
                  </div>
                  <div className='col-3'>
                    <span>Scanner Availability: </span>
                    <input type='text' name='Scaning_Capacity_A3' value={formData.Scaning_Capacity_A3}
                      onChange={(e) => setFormData({ ...formData, Scaning_Capacity_A3: e.target.value })} required /><br />
                  </div>

                </div>
                <div className='row'>



                  <div className='col-3'>
                    <span>System Availability: </span>
                    <input type='text' name='Scaning_Capacity_A4' value={formData.Scaning_Capacity_A4}
                      onChange={(e) => setFormData({ ...formData, Scaning_Capacity_A4: e.target.value })} required /><br />
                  </div>

                  <div className='col-3'>
                    <span>Expected Volume: </span>
                    <input type='text' name='expected_volume' value={formData.expected_volume}
                      onChange={(e) => setFormData({ ...formData, expected_volume: e.target.value })} required /><br />
                  </div>
                </div>
                <div className='row'>

                </div>
                <div className='row'>
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

    </>
  )
}
export default MIS_Form;