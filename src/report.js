import React, { useState, useEffect, useRef } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SummaryData } from './Components/SummaryData';
import Header from './Components/Header';
import Footer from './Footer';

const Locations = [
  "Agra",
  "Allahabad",
  "Kanpur",
  "Bagpat",
  "Ghaziabad",
  "Bareilly",
  "Kasganj",
  "Kaushambi",
  "Meerut",
]

const Report = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showLocation, setShowLocation] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredLocations, setFilteredLocations] = new useState(Locations);
  const dropdownRef = useRef(null);


  const handleLocation = (location) => {
    if (!selectedLocations.includes(location)) {
      setSelectedLocations([...selectedLocations, location]);
      setSearchInput('');
    }
  };

  const removeLocation = (location) => {
    setSelectedLocations(selectedLocations.filter((loc) => loc !== location));
  };
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setShowLocation(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);

  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [dropdownRef]);


  return (
    <>
      <Header />
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-lg-2 col-md-2 '></div>
          <div className='col-lg-10 col-md-9 col-sm-12'>
            <div className='row mt-4 me-1'>
              <div className='card' style={{ padding: '5px', backgroundColor: '#4BC0C0' }}>
                <h6 className='text-center' style={{ color: 'white' }}>Dashboard / Site Wise Project Summary Report</h6>
              </div>
            </div>
            <div className='row mt-2 me-1 search-report-card'>
              <div className='col-md-4 col-sm-12'>
                <div
                  ref={dropdownRef}
                  className='search-bar mt-1'
                  style={{ border: '1px solid #000', padding: '5px', borderRadius: '5px', minHeight: '30px' }}
                  contentEditable={true}
                  onClick={() => setShowLocation(!showLocation)}
                >
                  {selectedLocations.map((location, index) => (
                    <span key={index} className='selected-location'>
                      {location}
                      <button onClick={() => removeLocation(location)} style={{ backgroundColor: 'black', color: 'white', border: 'none', marginLeft: '5px', }}>x</button>
                      &nbsp;
                    </span>
                  ))}
                  <span style={{ minWidth: '5px', display: 'inline-block' }}>&#8203;</span>
                </div>
                {showLocation && (
                  <>
                    <div className='location-card' >
                      {filteredLocations.map((item, index) => (
                        <div key={index}>
                          <p onClick={() => handleLocation(item)}>{item}</p>
                        </div>
                      ))}
                    </div>
                    {/* <div className='location-card'>
                    <p onClick={() => handleLocation('Agra')}>Agra</p>
                    <p onClick={() => handleLocation('Meerut')}>Meerut</p>
                    <p onClick={() => handleLocation('Kanpur Dehat')}>Kanpur Dehat</p>
                    <p onClick={() => handleLocation('Kasganj')}>Kasganj</p>
                    <p onClick={() => handleLocation('Kaushambi')}>Kaushambi</p>
                    <p onClick={() => handleLocation('Allahabad')}>Allahabad</p>
                    <p onClick={() => handleLocation('Bagpat')}>Bagpat</p>
                    <p onClick={() => handleLocation('Ghaziabad')}>Ghaziabad</p>
                    <p onClick={() => handleLocation('Bareilly')}>Bareilly</p>

                  </div> */}
                  </>
                )}
              </div>
              <div className='col-md-6 col-sm-12'>
                <DatePicker className='date-field' selected={startDate} onChange={(date) => setStartDate(date)} />
                <button className='btn ms-1 me-1' style={{ height: '40px', backgroundColor: '#4BC0C0', marginBottom: '5px', borderRadius: '0px' }}>To</button>
                <DatePicker className='date-field' selected={endDate} onChange={(date) => setEndDate(date)} />
              </div>
              <div className='col-md-2 col-sm-12'>
                <button className='btn search-btn'>Search</button>
              </div>
            </div>
            <div className='row mt-3 me-1'>
              <div className='card' style={{ padding: '5px', backgroundColor: '#4BC0C0' }}>
                <h6 className='text-center' style={{ color: 'white' }}>SUMMARY REPORT</h6>
              </div>
              <div className='main-summary-card '>

                <div className='row'>
                  {SummaryData().map((elem, index) => (
                    <div className='col-lg-2 col-md-4 col-sm-6' key={index} >
                      <div className='summary-card mt-3'>
                        <div className='summary-title'>
                          <h6 style={{ textTransform: 'capitalize' }}>{elem.Title}</h6>
                        </div>
                        <p className='text-center'>Total Files: {elem.Files}<br />Total Images: {elem.Images}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='row mt-3 me-1'>
              <div className='table-card'>
                <div className='row'>
                  <div className='card' style={{ padding: '5px', backgroundColor: '#4BC0C0' }}>
                    <h6 className='text-center' style={{ color: 'white' }}>LOCATION WISE DETAILED CUMULATIVE REPORT</h6>
                  </div>
                </div>
                <div className='row mt-5 ms-2 me-2' style={{ overflowX: 'auto' }}>
                  <table class="table table-hover table-bordered table-responsive table-striped data-table"  >
                    <thead style={{ color: 'white', backgroundColor: '#4BC0C0' }}>
                      <tr>
                        <th rowspan="2">Location</th>
                        <th colspan="2">Collection of Records</th>
                        <th colspan="2">Scanning ADF</th>
                        <th colspan="2">Image QC</th>
                        <th colspan="2">Document Classification</th>
                        <th colSpan="2">Indexing</th>
                        <th colSpan="2">CBSL QA</th>
                        <th colSpan="2">Export PDF</th>
                        <th colSpan="2">Client QA</th>
                        <th colSpan="2">CSV Generation</th>
                        <th colSpan="2">Inventory Out</th>
                        <th rowspan="2">Document Wise</th>
                      </tr>
                      <tr>
                        <th>Files</th>
                        <th>Images</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>Files</th>
                        <th>Images</th>
                      </tr>
                    </thead>
                    <tbody style={{ color: 'black', minHeight: '600px', overflowY: 'auto' }} >
                      <tr>
                        <td>Agra District Court</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td><button className='btn view-btn'>View</button></td>
                      </tr>
                      <tr>
                        <td>Meerut District Court</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td><button className='btn view-btn'>View</button></td>
                      </tr>
                      <tr>
                        <td>Kasganj District Court</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td><button className='btn view-btn'>View</button></td>
                      </tr>
                      <tr>
                        <td>Kanpur Dehat District Court</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td><button className='btn view-btn'>View</button></td>
                      </tr>
                      <tr>
                        <td>Ghaziabad District Court</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td><button className='btn view-btn'>View</button></td>
                      </tr>
                      <tr>
                        <td>Bagpat District Court</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td><button className='btn view-btn'>View</button></td>
                      </tr>
                      <tr>
                        <td>Bareilly District Court</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td><button className='btn view-btn'>View</button></td>
                      </tr>
                      <tr>
                        <td>Kaushambi District Court</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td><button className='btn view-btn'>View</button></td>
                      </tr>
                      <tr>
                        <td>Allahabad District Court</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td>11,974</td>
                        <td>3,668,877</td>
                        <td><button className='btn view-btn'>View</button></td>
                      </tr>
                    </tbody>

                  </table>
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

export default Report