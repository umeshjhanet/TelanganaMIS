import React, { useEffect, useState } from 'react'
import Header from './Components/Header'
import Footer from './Footer'
import DatePicker from 'react-datepicker';
import { ProcessCardData } from './ProcessCardData';
import axios from 'axios';
import Alert from '@mui/material/Alert';

const MIS_Form = () => {
  const [blrData, setBLRData] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [location, setLocation] = useState();
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
    PH_Id: '', PO_Id: '', PM_Id: '', PCo_Id: '', SM_Id: '', Coll_Index_MP: '', Barc_MP: '', Barc_TF: '', Barc_TI: '', Page_No_MP: '', Prepare_MP: '',
    Prepare_TF: '', Prepare_TI: '', Scan_MP: '', Cover_Page_MP: '', Cover_Page_TF: '', Rescan_MP: '', Image_QC_MP: '', Doc_MP: '', Index_MP: '', CBSL_QA_MP: '',
    Ready_Cust_QA_MP: '', Cust_QA_Done_MP: '', PDF_Export_MP: '', Refilling_Files_MP: '', Inventory_MP: '', Location_Id: '',
  })
  const [newData, setNewData] = useState({ Desig_ID: '', Desig_name: '' });
  const [formData, setFormData] = useState({ Desig_ID: '', Desig_name: '' })
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    // const fetchData = () => {
    //   fetch("http://localhost:3001/users")
    //   .then(response => response.json())
    //   .then(data => setBLRData(data))
    //   .catch(error => console.error(error))
    //   console.log("Data",blrData);

    // }
    const locationData = () => {
      fetch("http://localhost:5000/locations")
        .then(respsone => respsone.json())
        .then(data => setLocation(data))
        .catch(error => console.error(error))
      console.log("Locations", location);
    }
    const designationData = () => {
      fetch("http://localhost:5000/designations")
        .then(respsone => respsone.json())
        .then(data => setDesignation(data))
        .catch(error => console.error(error))
    }
    const usermasterData = () => {
      fetch("http://localhost:5000/usermaster")
        .then(respsone => respsone.json())
        .then(data => setUsermaster(data))
        .catch(error => console.error(error))
      console.log("Designations", usermaster);
    }
    const fetchLastInsertedData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/site_MPData");
        const site_MPData = response.data;

        console.log("Manpower Data" , site_MPData);
        setFormData({
          // PM_Id: site_MPData.PM_Id || '',
          // SM_Name: site_MPData.SM_Name || '',
          Coll_Index_MP: site_MPData.Coll_Index_MP || ''
        });
        console.log("PM_ID",site_MPData);
      } catch (error) {
        console.error("Error fetching last inserted data:", error);
      }
    };

    fetchLastInsertedData();


    // fetchData();
    locationData();
    designationData();
    usermasterData();
    const intervalId = setInterval(designationData, usermasterData, 2000);

    return () => clearInterval(intervalId);
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


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/usermasterinfo", formData);
      console.log("Post created:", response.data);
    }
    catch (error) {
      console.error("Error creating post:", error);
    }
  }
  const handleEditDesignation = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/usermasterupdate/${formData.Desig_ID}`, newData);
      console.log("User updated:", response.data);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }

  const handleDeleteDesignation = async (Desig_ID) => {
    try {
      const response = await axios.delete(`http://localhost:5000/usermasterdelete/${Desig_ID}`)
      setDesignation(designation.filter(elem => elem.id !== Desig_ID));
      console.log("User Deleted:", response.data)
    }
    catch (error) { console.error('There was an error in deleting data!', error) }
  }
  const handleSelectPH = (id, name) => {
    setSelectedPH(name);
    setSelectedPHId(parseInt(id));
    showProjectHead(!projectHead);
  };
  const handleSelectPM = (id, name) => {
    setSelectedPM(name);
    setSelectedPMId(parseInt(id));
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
    setManpowerForm({ ...manpowerForm, [name]: value, PM_Id: selectedPMId, SM_Id: selectedSMId, PH_Id: selectedPHId, Location_Id: selectedLocationId });
  }

  const handleManPowerForm = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/site_MP", manpowerForm);
      <Alert severity="success">This is a success Alert.</Alert>
      console.log("Post created:", response.data);
    }
    catch (error) {
      console.error("Error creating post:", error);
    }
    const requiredFields = ['PH_Id', 'PO_Id', 'PM_Id', 'PCo_Id', 'SM_Id', 'Coll_Index_MP', 'Barc_MP', 'Barc_TF', 'Barc_TI', 'Page_No_MP', 'Prepare_MP', 'Prepare_TF', 'Prepare_TI', 'Scan_MP', 'Cover_Page_MP', 'Cover_Page_TF', 'Rescan_MP', 'Image_QC_MP', 'Doc_MP', 'Index_MP', 'CBSL_QA_MP', 'Ready_Cust_QA_MP', 'Cust_QA_Done_MP', 'PDF_Export_MP', 'Refilling_Files_MP', 'Refilling_Files_TF', 'Refilling_Files_TI', 'Inventory_MP', 'Location_Id',]; // Add other required field names here
    for (const field of requiredFields) {
      if (!manpowerForm[field]) {
        setErrorMessage(`Please fill out all fields.`);
        return;
      }
    }
    setErrorMessage('');

    console.log("Selected PM ID:", selectedPMId);
    console.log("Selected SM ID:", selectedSMId);
  }


  // if (!designation)
  //   return (
  //     <>Loading...</>
  //   )
  return (
    <>
      <Header />
      {/* <div className='container-fluid'>
      <div className='row'>
        <div className='col-2'></div>
        <div className='col-10'>
         <table className='table-bordered'>
          <thead>
            <tr>
              <th>Inventory Id</th>
              <th> Anchal Code</th>
           </tr>
          </thead>
          <tbody>
            {blrData.slice(0,10).map((elem,index)=>(
              <tr key={index}>
                <td>{elem.InventoryID}</td>
                <td>{elem.AnchalCode}</td>
            </tr>
            ))}
          </tbody>
         </table>
        </div>
      </div>
    </div> */}
      <div className='container '>
        <div className='row'>
          <div className='col-2'></div>
          <div className='col-10'>
            <h3 className='text-center'>UPDC MIS</h3>
            <h5 className='text-center'>Input Screen for user at site to enter the data on daily basis</h5>

            <div className='row mt-4 main-updc'>
              <div className='col-5'>
                <div className='row mt-5'>
                  <div className='col-5'>
                    <span>Select Location: </span>
                  </div>
                  <div className='col-7'>
                    <input type='text' placeholder='Location' name='Location_Id' value={selectedLocation || ''} onClick={handleShowLocation} onChange={handleInputChange} />
                    {showLocation && (
                      <>
                        <div className='locations-card'>
                          {location.map((elem, index) => (
                            <div key={index} onClick={() => handleSelectLocation(elem.LocationID, `${elem.LocationName}`)}>
                              <p>{elem.LocationName}</p>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className='row mt-2'>
                  <div className='col-5'><span>Project Head Name: </span></div>
                  <div className='col-7'><input type='text' placeholder='Select PH Name' name='PH_Id' value={selectedPH || ''} onClick={handleShowProjectHead} onChange={handleInputChange} required /></div>
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
                <div className='row mt-2'>
                  <div className='col-5'><span>Project Owner Name: </span></div>
                  <div className='col-7'><input type='text' placeholder='Select PO Name' name='PO_Id' onClick={handleShowProjectOwner} onChange={handleInputChange} /></div>
                </div>
                <div className='row mt-2'>
                  <div className='col-5'><span>Project Manager Name: </span></div>
                  <div className='col-7'><input type='text' placeholder='Select PM Name' name='PM_Id' value={selectedPM || ''} onClick={handleShowProjectMan} onChange={handleInputChange} /></div>
                  {projectMan && (
                    <div className='dropdown-card'>
                      {usermaster.filter(user => user.designation.toLowerCase() === "project manager").map((elem, index) => (
                        <div key={index} onClick={() => handleSelectPM(elem.user_id, `${elem.first_name} ${elem.last_name}`)}>
                          <p>{elem.first_name} {elem.last_name}</p>
                        </div>
                      ))}

                    </div>
                  )}
                </div>
                <div className='row mt-2'>
                  <div className='col-5'><span>Project Coordinator Name: </span></div>
                  <div className='col-7'><input type='text' placeholder='Select PCo Name' name='PCo_Id' onChange={handleInputChange} /></div>
                </div>
                <div className='row mt-2'>
                  <div className='col-5'><span>Site Manager Name: </span></div>
                  <div className='col-7'><input type='text' placeholder='Select SM Name' name='SM_Id' value={selectedSM || ''} onClick={handleShowSiteMan} onChange={handleInputChange} /></div>
                  {siteMan && (
                    <div className='dropdown-card'>
                      {usermaster.filter(user => user.designation.toLowerCase() === "site manager" || "site incharge").map((elem, index) => (
                        <div key={index} onClick={() => handleSelectSM(elem.user_id, `${elem.first_name} ${elem.last_name}`)}>
                          <p>{elem.first_name} {elem.last_name}</p>
                        </div>
                      ))}

                    </div>
                  )}
                </div>
              </div>

            </div>
            <div className='row mt-4 mb-4'>
              <h5 className='text-center'>Process Details</h5>
              <h6 className=' mt-2'>Collection(Indexing IN)</h6>
              <div className='row process-card'>
                <div className='col-4'>
                  <span>MP Used: </span>
                  <input type='text' name='Coll_Index_MP' onChange={handleInputChange} required /><br />
                </div>
              </div>
              <h6 className=' mt-2'>Barcoding</h6>
              <div className='row process-card'>
                <div className='col-4'>
                  <span>MP Used: </span>
                  <input type='text' name='Barc_MP' onChange={handleInputChange} required /><br />
                </div>
                <div className='col-4'>
                  <span>Total Files: </span>
                  <input type='text' name='Barc_TF' onChange={handleInputChange} required />
                </div>
                <div className='col-4'>
                  <span>Total Images: </span>
                  <input type='text' name='Barc_TI' onChange={handleInputChange} required />
                </div>
              </div>
              <h6 className='mt-2'>Page Numbering</h6>
              <div className='row process-card'>
                <div className='col-4'>
                  <span>MP Used: </span>
                  <input type='text' name='Page_No_MP' onChange={handleInputChange} required /><br />
                </div>
              </div>
              <h6 className='mt-2'>Preparation</h6>
              <div className='row process-card'>
                <div className='col-4'>
                  <span>MP Used: </span>
                  <input type='text' name='Prepare_MP' onChange={handleInputChange} required /><br />
                </div>
                <div className='col-4'>
                  <span>Total Files: </span>
                  <input type='text' name='Prepare_TF' onChange={handleInputChange} required />
                </div>
                <div className='col-4'>
                  <span>Total Images: </span>
                  <input type='text' name='Prepare_TI' onChange={handleInputChange} required />
                </div>
              </div>
              <h6 className='mt-2'>Scanning(ADF)</h6>
              <div className='row process-card'>
                <div className='col-4'>
                  <span>MP Used: </span>
                  <input type='text' name='Scan_MP' onChange={handleInputChange} required /><br />
                </div>
              </div>
              <h6 className='mt-2'>Cover Page Scanning</h6>
              <div className='row process-card'>
                <div className='col-4'>
                  <span>MP Used: </span>
                  <input type='text' name='Cover_Page_MP' onChange={handleInputChange} required /><br />
                </div>
                <div className='col-4'>
                  <span>Total Files: </span>
                  <input type='text' name='Cover_Page_TF' onChange={handleInputChange} required />
                </div>
              </div>
              <h6 className='mt-2'>Rescanning</h6>
              <div className='row process-card'>
                <div className='col-4'>
                  <span>MP Used: </span>
                  <input type='text' name='Rescan_MP' onChange={handleInputChange} required /><br />
                </div>
              </div>
              <h6 className='mt-2'>Image QC</h6>
              <div className='row process-card'>
                <div className='col-4'>
                  <span>MP Used: </span>
                  <input type='text' name='Image_QC_MP' onChange={handleInputChange} required /><br />
                </div>
              </div>
              <h6 className='mt-2'>Document Classification(Flagging)</h6>
              <div className='row process-card'>
                <div className='col-4'>
                  <span>MP Used: </span>
                  <input type='text' name='Doc_MP' onChange={handleInputChange} required /><br />
                </div>
              </div>
              <h6 className='mt-2'>Indexing(Data Entry)</h6>
              <div className='row process-card'>
                <div className='col-4'>
                  <span>MP Used: </span>
                  <input type='text' name='Index_MP' onChange={handleInputChange} required /><br />
                </div>
              </div>
              <h6 className='mt-2'>CBSL QA</h6>
              <div className='row process-card'>
                <div className='col-4'>
                  <span>MP Used: </span>
                  <input type='text' name='CBSL_QA_MP' onChange={handleInputChange} required /><br />
                </div>
              </div>
              <h6 className='mt-2'>Ready for Customer QA</h6>
              <div className='row process-card'>
                <div className='col-4'>
                  <span>MP Used: </span>
                  <input type='text' name='Ready_Cust_QA_MP' onChange={handleInputChange} required /><br />
                </div>
              </div>
              <h6 className='mt-2'>Customer QA Done</h6>
              <div className='row process-card'>
                <div className='col-4'>
                  <span>MP Used: </span>
                  <input type='text' name='Cust_QA_Done_MP' onChange={handleInputChange} required /><br />
                </div>
              </div>
              <h6 className='mt-2'>PDF Upload to DMS(Export)</h6>
              <div className='row process-card'>
                <div className='col-4'>
                  <span>MP Used: </span>
                  <input type='text' name='PDF_Export_MP' onChange={handleInputChange} required /><br />
                </div>
              </div>
              <h6 className='mt-2'>Refilling of Files</h6>
              <div className='row process-card'>
                <div className='col-4'>
                  <span>MP Used: </span>
                  <input type='text' name='Refilling_Files_MP' onChange={handleInputChange} required /><br />
                </div>
                <div className='col-4'>
                  <span>Total Files: </span>
                  <input type='text' name='Refilling_Files_TF' onChange={handleInputChange} required />
                </div>
                <div className='col-4'>
                  <span>Total Images: </span>
                  <input type='text' name='Refilling_Files_TI' onChange={handleInputChange} required />
                </div>
              </div>
              <h6 className='mt-2'>Inventory Out</h6>
              <div className='row process-card'>
                <div className='col-4'>
                  <span>MP Used: </span>
                  <input type='text' name='Inventory_MP' onChange={handleInputChange} required /><br />
                </div>
              </div>
              {/* <div className='col-3 mt-2' >
                <div className='process-card'>
                  <h6 className='text-center'>Collection(Indexing IN)</h6>
                  <span>MP Used:</span>
                  <input type='text' name='Coll_Index_MP' onChange={handleInputChange} required /><br />
                </div>
              </div>
              <div className='col-3 mt-2'>
                <div className='process-card'>
                  <h6 className='text-center'>Barcoding</h6>
                  <span>MP Used:</span>
                  <input type='text' name='Barc_MP' onChange={handleInputChange} required /><br />
                  <span>Total Files:</span>
                  <input type='text' name='Barc_TF' onChange={handleInputChange} required />
                  <br />
                  <span>Total Images:</span>
                  <input type='text' name='Barc_TI' onChange={handleInputChange} required />
                </div>
              </div>
              <div className='col-3 mt-2'>
                <div className='process-card'>
                  <h6 className='text-center'>Page Numbering</h6>
                  <span>MP Used:</span>
                  <input type='text' name='Page_No_MP' onChange={handleInputChange} required /><br />
                </div>
              </div>
              <div className='col-3 mt-2'>
                <div className='process-card'>
                  <h6 className='text-center'>Preparation</h6>
                  <span>MP Used:</span>
                  <input type='text' name='Prepare_MP' onChange={handleInputChange} required /><br />
                  <span>Total Files:</span>
                  <input type='text' name='Prepare_TF' onChange={handleInputChange} required />
                  <br />
                  <span>Total Images:</span>
                  <input type='text' name='Prepare_TI' onChange={handleInputChange} required />
                </div>
              </div>
            </div>
            <div className='row mt-4 mb-4'>
              <div className='col-3 mt-2' >
                <div className='process-card'>
                  <h6 className='text-center'>Scanning(ADF)</h6>
                  <span>MP Used:</span>
                  <input type='text' name='Scan_MP' onChange={handleInputChange} required /><br />
                </div>
              </div>
              <div className='col-3 mt-2'>
                <div className='process-card'>
                  <h6 className='text-center'>Cover Page Scanning</h6>
                  <span>MP Used:</span>
                  <input type='text' name='Cover_Page_MP' onChange={handleInputChange} required /><br />
                  <span>Total Files:</span>
                  <input type='text' name='Cover_Page_TF' onChange={handleInputChange} required />
                </div>
              </div>
              <div className='col-3 mt-2'>
                <div className='process-card'>
                  <h6 className='text-center'>Rescanning</h6>
                  <span>MP Used:</span>
                  <input type='text' name='Rescan_MP' onChange={handleInputChange} required /><br />
                </div>
              </div>
              <div className='col-3 mt-2'>
                <div className='process-card'>
                  <h6 className='text-center'>Image QC</h6>
                  <span>MP Used:</span>
                  <input type='text' name='Image_QC_MP' onChange={handleInputChange} required /><br />
                </div>
              </div>
            </div>
            <div className='row mt-4 mb-4'>
              <div className='col-3 mt-2' >
                <div className='process-card'>
                  <h6 className='text-center'>Document Classification(Flagging)</h6>
                  <span>MP Used:</span>
                  <input type='text' name='Doc_MP' onChange={handleInputChange} required /><br />
                </div>
              </div>
              <div className='col-3 mt-2'>
                <div className='process-card'>
                  <h6 className='text-center'>Indexing(Data Entry)</h6>
                  <span>MP Used:</span>
                  <input type='text' name='Index_MP' onChange={handleInputChange} required /><br />
                </div>
              </div>
              <div className='col-3 mt-2'>
                <div className='process-card'>
                  <h6 className='text-center'>CBSL QA</h6>
                  <span>MP Used:</span>
                  <input type='text' name='CBSL_QA_MP' onChange={handleInputChange} required /><br />
                </div>
              </div>
              <div className='col-3 mt-2'>
                <div className='process-card'>
                  <h6 className='text-center'>Ready For Customer QA</h6>
                  <span>MP Used:</span>
                  <input type='text' name='Ready_Cust_QA_MP' onChange={handleInputChange} required /><br />
                </div>
              </div>
            </div>
            <div className='row mt-4 mb-4'>
              <div className='col-3 mt-2' >
                <div className='process-card'>
                  <h6 className='text-center'>Customer QA Done</h6>
                  <span>MP Used:</span>
                  <input type='text' name='Cust_QA_Done_MP' onChange={handleInputChange} required /><br />
                </div>
              </div>
              <div className='col-3 mt-2'>
                <div className='process-card'>
                  <h6 className='text-center'>PDF Upload to DMS(Export)</h6>
                  <span>MP Used:</span>
                  <input type='text' name='PDF_Export_MP' onChange={handleInputChange} required /><br />
                </div>
              </div>
              <div className='col-3 mt-2'>
                <div className='process-card'>
                  <h6 className='text-center'>Refilling of Files</h6>
                  <span>MP Used:</span>
                  <input type='text' name='Refilling_Files_MP' onChange={handleInputChange} required /><br />
                  <span>Total Files:</span>
                  <input type='text' name='Refilling_Files_TF' onChange={handleInputChange} required />
                  <br />
                  <span>Total Images:</span>
                  <input type='text' name='Refilling_Files_TI' onChange={handleInputChange} required />
                </div>
              </div>
              <div className='col-3 mt-2'>
                <div className='process-card'>
                  <h6 className='text-center'>Inventory Out</h6>
                  <span>MP Used:</span>
                  <input type='text' name='Inventory_MP' onChange={handleInputChange} required /><br />

                </div>
              </div> */}
            </div>

            <div className='row mt-3 btn-row'>
              {errorMessage && <span className="error-message" style={{ color: 'red' }}>{errorMessage}</span>}
              <button className='btn process-btn me-2'>View/Edit</button>
              <button className='btn process-btn me-2' onClick={handleManPowerForm}>Submit</button>
            </div>
          </div>
        </div>
      </div>
      {/* <div className='container main-master'>
        <div className='row'>
          <div className='col-2'></div>
          <div className='col-10'>
            <h3 className='text-center'>Adding Master</h3>
            <div className='row mt-2'>
              <div className='col-6'>
                <div className='master-card'>
                  <div className='row mt-2'>
                    <div className='col-4'>
                      <span>Project Head Name: </span>
                    </div>
                    <div className='col-8'>
                      <input type='text' />
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-4'>
                      <span>Mobile Number: </span>
                    </div>
                    <div className='col-8'>
                      <input type='number' /><br />
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-4'>
                      <span>Email: </span>
                    </div>
                    <div className='col-8'>
                      <input type='email' />
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-6'>
                <div className='master-card'>
                  <div className='row mt-2'>
                    <div className='col-4'>
                      <span>Project Head Name: </span>
                    </div>
                    <div className='col-8'>
                      <input type='text' placeholder='Select PH Name' />
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-4'>
                      <span>Project Owner Name: </span>
                    </div>
                    <div className='col-8'>
                      <input type='text' />
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-4'>
                      <span>Mobile Number: </span>
                    </div>
                    <div className='col-8'>
                      <input type='number' /><br />
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-4'>
                      <span>Email: </span>
                    </div>
                    <div className='col-8'>
                      <input type='email' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='row mt-2'>
              <div className='col-6'>
                <div className='master-card'>
                  <div className='row mt-2'>
                    <div className='col-4'>
                      <span>Project Head Name: </span>
                    </div>
                    <div className='col-8'>
                      <input type='text' placeholder='Select PH Name' />
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-4'>
                      <span>Project Owner Name: </span>
                    </div>
                    <div className='col-8'>
                      <input type='text' placeholder='Select PO Name' />
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-4'>
                      <span>PM Name: </span>
                    </div>
                    <div className='col-8'>
                      <input type='text' />
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-4'>
                      <span>Mobile Number: </span>
                    </div>
                    <div className='col-8'>
                      <input type='number' /><br />
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-4'>
                      <span>Email: </span>
                    </div>
                    <div className='col-8'>
                      <input type='email' />
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-6'>
                <div className='master-card'>
                  <div className='row mt-2'>
                    <div className='col-4'>
                      <span>Project Head Name: </span>
                    </div>
                    <div className='col-8'>
                      <input type='text' placeholder='Select PH Name' />
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-4'>
                      <span>Project Owner Name: </span>
                    </div>
                    <div className='col-8'>
                      <input type='text' placeholder='Select PO Name' />
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-4'>
                      <span>PM Name: </span>
                    </div>
                    <div className='col-8'>
                      <input type='text' placeholder='Select PM Name' />
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-4'>
                      <span>PCo Name: </span>
                    </div>
                    <div className='col-8'>
                      <input type='text' />
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-4'>
                      <span>Mobile Number: </span>
                    </div>
                    <div className='col-8'>
                      <input type='number' /><br />
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-4'>
                      <span>Email: </span>
                    </div>
                    <div className='col-8'>
                      <input type='email' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='row mt-2'>
              <div className='col-6'>
                <div className='master-card'>
                  <div className='row mt-2'>
                    <div className='col-4'>
                      <span>Project Head Name: </span>
                    </div>
                    <div className='col-8'>
                      <input type='text' placeholder='Select PH Name' />
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-4'>
                      <span>Project Owner Name: </span>
                    </div>
                    <div className='col-8'>
                      <input type='text' placeholder='Select PO Name' />
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-4'>
                      <span>PM Name: </span>
                    </div>
                    <div className='col-8'>
                      <input type='text' placeholder='Select PM Name' />
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-4'>
                      <span>PCo Name: </span>
                    </div>
                    <div className='col-8'>
                      <input type='text' placeholder='Select PCo Name' />
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-4'>
                      <span>Site Manager Name: </span>
                    </div>
                    <div className='col-8'>
                      <input type='text' />
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-4'>
                      <span>Mobile Number: </span>
                    </div>
                    <div className='col-8'>
                      <input type='number' /><br />
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-4'>
                      <span>Email: </span>
                    </div>
                    <div className='col-8'>
                      <input type='email' />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div> */}
      {/* <div className='container'>
        <div className='row'>
          <div className='col-2'></div>
          <div className='col-10'>
            <form onSubmit={handleFormSubmit}>
              <input type='number' placeholder='Enter ID' name='Desig_ID' onChange={handleChange} />
              <input type='text' placeholder='Enter Designation' name='Desig_name' onChange={handleChange} />
              <input type='submit' />
              <button className='btn process-btn' onClick={handleEditDesignation}>Edit</button>
              
            </form>
            <table className='table-bordered'>
              <thead>
                <tr>
                  <th>D_ID</th>
                  <th>D_Name</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                {designation.map((elem, index) => (
                  <tr key={index}>
                    <td>{elem.Desig_ID}</td>
                    <td>{elem.Desig_name}</td>

                    <td>
                      <button className='btn process-btn' onClick={() => handleDeleteDesignation(elem.Desig_ID)}>Delete</button>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
      </div> */}
      <Footer />
    </>
  )
}

export default MIS_Form;