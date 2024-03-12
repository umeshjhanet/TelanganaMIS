import React, { useState, useEffect, useRef } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SummaryData } from './Components/SummaryData';
import Header from './Components/Header';
import Footer from './Footer';
import axios from 'axios';
 
// const Locations = [
//   "Agra",
//   "Allahabad",
//   "Kanpur",
//   "Bagpat",
//   "Ghaziabad",
//   "Bareilly",
//   "Kasganj",
//   "Kaushambi",
//   "Meerut",
// ]
 
const Report = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showLocation, setShowLocation] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [locations, setLocations] = useState();
  const [summary, setSummary] = useState();
  const [report, setReport] = useState();
  const [searchInput, setSearchInput] = useState('');
  const[csv,setCsv]=useState('');
  const [reportCsv,setReportCsv]=useState('');
  // const [filteredLocations, setFilteredLocations] = new useState(Locations);
  const dropdownRef = useRef(null);


  const handleReportCsv=()=>{
    const headers = [
      'Sr. No.',
      'Location',
      'Collection Of Records',
      '',
      'Scanning ADF',
      '',
      'Image QC',
      
      '',
      'Document Classification',
      
      '',
      'Indexing',
      
      '',
      'CBSL QA',
     
      '',
      'Export PDF',
     
      '',
      'Client QA',
      
      '',
      'CSV Generation',
      
      '',
      'Inventory Out'

      
    ];
    
    const csvRows = [];
    csvRows.push(headers.join(',')); 
    const fileImageHeaders = ['','', 'Files', 'Images', 'Files', 'Images', 'Files', 'Images', 'Files', 'Images'
    , 'Files', 'Images', 'Files', 'Images', 'Files', 'Images', 'Files', 'Images'
    , 'Files', 'Images', 'Files', 'Images'];
    csvRows.push(fileImageHeaders.join(','));
    report.forEach((elem, index) => {
      const rowData = [
        index+1,
        elem.LocationName,
        elem.CollectionFiles || '0',
        elem.CollectionImages || '0',
        
        elem.ScannedFiles || '0',
        elem.ScannedImages || '0',
        
        elem.QCFiles || '0',
        elem.QCImages || '0',
        
        elem.FlaggingFiles || '0',
        elem.FlaggingImages || '0',

        elem.IndexingFiles || '0',
        elem.IndexingImages || '0',
        
        elem.CBSL_QAFiles || '0',
        elem.CBSL_QAImages || '0',
        
        elem.Export_PdfFiles || '0',
        elem.Export_PdfImages || '0',
        
        elem.Client_QA_AcceptedFiles || '0',
        elem.Client_QA_AcceptedImages || '0',

         '0',
         '0',
        
        '0',
        '0',
        
      
      ];
    
      csvRows.push(rowData.join(','));
    });
    const csvBlob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'export.csv');
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);

  }


  const handleExport=()=>{
    const headers = [
      'Sr. No.',
      'Total Location',
      'Collection Of Records',
      '',
      'Scanning ADF',
      '',
      'Image QC',
      
      '',
      'Document Classification',
      
      '',
      'Indexing',
      
      '',
      'CBSL QA',
     
      '',
      'Export PDF',
     
      '',
      'Client QA',
      
      '',
      'CSV Generation',
      
      '',
      'Inventory Out'

      
    ];
    
    const csvRows = [];
    csvRows.push(headers.join(',')); 
    const fileImageHeaders = ['','', 'Files', 'Images', 'Files', 'Images', 'Files', 'Images', 'Files', 'Images'
    , 'Files', 'Images', 'Files', 'Images', 'Files', 'Images', 'Files', 'Images'
    , 'Files', 'Images', 'Files', 'Images'];
    csvRows.push(fileImageHeaders.join(','));
    summary.forEach((elem, index) => {
      const rowData = [
        index+1,
        elem.TotalLocation,
        elem.CollectionFiles || '0',
        elem.CollectionImages || '0',
        
        elem.ScannedFiles || '0',
        elem.ScannedImages || '0',
        
        elem.QCFiles || '0',
        elem.QCImages || '0',
        
        elem.FlaggingFiles || '0',
        elem.FlaggingImages || '0',

        elem.IndexingFiles || '0',
        elem.IndexingImages || '0',
        
        elem.CBSL_QAFiles || '0',
        elem.CBSL_QAImages || '0',
        
        elem.Export_PdfFiles || '0',
        elem.Export_PdfImages || '0',
        
        elem.Client_QA_AcceptedFiles || '0',
        elem.Client_QA_AcceptedImages || '0',

         '0',
         '0',
        
        '0',
        '0',
        
      
      ];
    
      csvRows.push(rowData.join(','));
    });
    const csvBlob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'export.csv');
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
  };




  const handleLocation = (location) => {
    if (!selectedLocations.includes(location)) {
      setSelectedLocations([...selectedLocations, location]);
      setSearchInput('');
    }
  };
 
  const removeLocation = (location) => {
    setSelectedLocations(selectedLocations.filter((loc) => loc !== location));
  };
  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:5000/locations")
      // fetch("http://localhost:5000/locations")
        .then(response => response.json())
        .then(data => setLocations(data))
        .catch(error => console.error( error));
    };
    const summaryData =() => {
      fetch("http://localhost:5000/summary")
      // fetch("http://localhost:5000/summary")
      .then(response => response.json())
      .then(data => setSummary(data))
      .catch(error => console.error(error))
      console.log("Summary", summary);
    }

    const fetchSummaryCsv=()=>{
      axios.get('http://localhost:5000/summarycsv',{responseType:'blob'})
        .then((response)=>{
          setCsv(response.data);
        })
        .catch((error)=>{
          console.error('Error in exporting data:', error);
        }); 
    };
    const fetchReportCsv=()=>{
      axios.get('http://localhost:5000/reporttablecsv',{responseType:'blob'})
        .then((response)=>{
          setReportCsv(response.data);
        })
        .catch((error)=>{
          console.error('Error in exporting data:', error);
        }); 
    };
    const reportData =() => {
      axios.get("http://localhost:5000/reportTable")
      .then(response => {
        setReport(response.data);
        console.log("Report Data", response.data); // Log inside the then block
      })
      .catch(error => console.error(error))
    }
    fetchData();
    summaryData();
    reportData();
    fetchSummaryCsv();
    fetchReportCsv();

 
    const intervalId = setInterval(fetchData,summaryData,reportData,fetchReportCsv, fetchSummaryCsv, 5000);
 
    return () => clearInterval(intervalId);
  }, []);
  
// if(!locations) 
// return(
//   <>Loading....</>
// )
// if(!locations) 
// return(
//   <>Loading....</>
// )
 
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
                      {locations && locations.map((item, index) => (
                        <div key={index}>
                          <p onClick={() => handleLocation(item.LocationName)}>{item.LocationName}</p>
                        </div>
                      ))}
                    </div>
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
                <button onClick={handleExport}>Export Csv</button>
              </div>
              <div className='main-summary-card '>
                <h5 className='mt-1'>Total Location: 57</h5>
                <div className='row'>
                  {summary && summary.map((elem, index) => (
                    <div className='col-lg-2 col-md-4 col-sm-6' key={index} >
                      <div className='summary-card mt-3'>
                        <div className='summary-title'>
                          <h6 style={{ textTransform: 'capitalize' }}>Collection of Records</h6>
                        </div>
                        <p className='text-center'>Total Files: {elem.CollectionFiles}<br />Total Images: {elem.CollectionImages}</p>
                      </div>
                    </div>
                  ))}
                  {summary && summary.map((elem, index) => (
                    <div className='col-lg-2 col-md-4 col-sm-6' key={index} >
                      <div className='summary-card mt-3'>
                        <div className='summary-title'>
                          <h6 style={{ textTransform: 'capitalize' }}>Scanning ADF</h6>
                        </div>
                        <p className='text-center'>Total Files: {elem.ScannedFiles}<br />Total Images: {elem.ScannedImages}</p>
                      </div>
                    </div>
                  ))}
                  {summary && summary.map((elem, index) => (
                    <div className='col-lg-2 col-md-4 col-sm-6' key={index} >
                      <div className='summary-card mt-3'>
                        <div className='summary-title'>
                          <h6 style={{ textTransform: 'capitalize' }}>Image QC</h6>
                        </div>
                        <p className='text-center'>Total Files: {elem.QCFiles}<br />Total Images: {elem.QCImages}</p>
                      </div>
                    </div>
                  ))}
                  {summary && summary.map((elem, index) => (
                    <div className='col-lg-2 col-md-4 col-sm-6' key={index} >
                      <div className='summary-card mt-3'>
                        <div className='summary-title'>
                          <h6 style={{ textTransform: 'capitalize' }}>Document Classification</h6>
                        </div>
                        <p className='text-center'>Total Files: {elem.FlaggingFiles}<br />Total Images: {elem.FlaggingImages}</p>
                      </div>
                    </div>
                  ))}
                  {summary && summary.map((elem, index) => (
                    <div className='col-lg-2 col-md-4 col-sm-6' key={index} >
                      <div className='summary-card mt-3'>
                        <div className='summary-title'>
                          <h6 style={{ textTransform: 'capitalize' }}>Indexing</h6>
                        </div>
                        <p className='text-center'>Total Files: {elem.IndexingFiles}<br />Total Images: {elem.IndexingImages}</p>
                      </div>
                    </div>
                  ))}
                  {summary && summary.map((elem, index) => (
                    <div className='col-lg-2 col-md-4 col-sm-6' key={index} >
                      <div className='summary-card mt-3'>
                        <div className='summary-title'>
                          <h6 style={{ textTransform: 'capitalize' }}>CBSL QA</h6>
                        </div>
                        <p className='text-center'>Total Files: {elem.CBSL_QAFiles}<br />Total Images: {elem.CBSL_QAImages}</p>
                      </div>
                    </div>
                  ))}
                  {summary && summary.map((elem, index) => (
                    <div className='col-lg-2 col-md-4 col-sm-6' key={index} >
                      <div className='summary-card mt-3'>
                        <div className='summary-title'>
                          <h6 style={{ textTransform: 'capitalize' }}>Export PDF</h6>
                        </div>
                        <p className='text-center'>Total Files: {elem.Export_PdfFiles}<br />Total Images: {elem.Export_PdfImages}</p>
                      </div>
                    </div>
                  ))}
                  {summary && summary.map((elem, index) => (
                    <div className='col-lg-2 col-md-4 col-sm-6' key={index} >
                      <div className='summary-card mt-3'>
                        <div className='summary-title'>
                          <h6 style={{ textTransform: 'capitalize' }}>Client QA</h6>
                        </div>
                        <p className='text-center'>Total Files: {elem.Client_QA_AcceptedFiles}<br />Total Images: {elem.Client_QA_AcceptedImages}</p>
                      </div>
                    </div>
                  ))}
                  {summary && summary.map((elem, index) => (
                    <div className='col-lg-2 col-md-4 col-sm-6' key={index} >
                      <div className='summary-card mt-3'>
                        <div className='summary-title'>
                          <h6 style={{ textTransform: 'capitalize' }}>CSV Generation</h6>
                        </div>
                        <p className='text-center'>Total Files:{'0'}<br />Total Images: {'0'}</p>
                      </div>
                    </div>
                  ))}
                  {summary && summary.map((elem, index) => (
                    <div className='col-lg-2 col-md-4 col-sm-6' key={index} >
                      <div className='summary-card mt-3'>
                        <div className='summary-title'>
                          <h6 style={{ textTransform: 'capitalize' }}>Inventory Out</h6>
                        </div>
                        <p className='text-center'>Total Files: {'0'}<br />Total Images: {'0'}</p>
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
                    <button onClick={handleReportCsv}>Export csv</button>
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
                       {report &&  report.map((elem,index)=>(
                        <tr key={index}>
                        <td>{elem.LocationName}</td>
                        <td>{elem.CollectionFiles || '0'}</td>
                        <td>{elem.CollectionImages || '0'}</td>
                        <td>{elem.ScannedFiles || '0'}</td>
                        <td>{elem.ScannedImages || '0'}</td>
                        <td>{elem.QCFiles || '0'}</td>
                        <td>{elem.QCImages || '0'}</td>
                        <td>{elem.FlaggingFiles || '0'}</td>
                        <td>{elem.FlaggingImages || '0'}</td>
                        <td>{elem.IndexingFiles || '0'}</td>
                        <td>{elem.IndexingImages || '0'}</td>
                        <td>{elem.CBSL_QAFiles || '0'}</td>
                        <td>{elem.CBSL_QAImages || '0'}</td>
                        <td>{elem.Export_PdfFiles || '0'}</td>
                        <td>{elem.Export_PdfImages || '0'}</td>
                        <td>{elem.Client_QA_AcceptedFiles || '0'}</td>
                        <td>{elem.Client_QA_AcceptedImages || '0'}</td>
                        <td>
                          {/* {elem.Client_QA_RejectedFiles || '0'} */}
                        0</td>
                        <td>
                         {/* {elem.Client_QA_RejectedImages || '0'} */}
                          0</td> 
                        <td>
                          {/* {elem.Digi_SignFiles || '0'} */}
                          0</td>
                        <td>
                          {/* {elem.Digi_SignImages || '0'} */}
                          0</td>
                        <td><button className='btn view-btn'>View</button></td>
                      </tr>
                      ))} 
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