import React, { useEffect, useState,useRef } from 'react'
import { CCard, CCardBody, CCol, CCardHeader, CRow } from '@coreui/react'
import { CChartBar, CChartDoughnut, CChartLine, CChartPie, CChartPolarArea, CChartRadar } from '@coreui/react-chartjs'
import Header from './Components/Header';
import axios, { all } from 'axios';
import './App.css';
import Footer from './Footer';
import { BarChart } from '@mui/x-charts/BarChart';
import { format, sub } from 'date-fns';

const Dashboard = () => {
  const [data2, setData2] = useState();
  const currentDate = new Date();
  const yesterdayDate = sub(currentDate, { days: 1 });
  const previousDate = sub(currentDate, { days: 2 });
  const formattedCurrentDate = format(currentDate, 'dd-MM-yyyy');
  const formattedYesterdayDate = format(yesterdayDate, 'dd-MM-yyyy');
  const formattedPreviousDate = format(previousDate, 'dd-MM-yyyy');
  const [tableData, setTableData] = useState();
  const[csv,setCsv]=useState('');
  const[locationWiseCsv,setLocationWiseCsv]=useState();
  const dropdownRef = useRef(null);
  const [showLocation, setShowLocation] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [locations, setLocations] = useState();
  const [searchInput, setSearchInput] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [barFile, setBarFile] = useState({
    labels: [],
    datasets: [
      {
        label: 'No. of Files',
        backgroundColor: ' #ad33ff',
        data: [],
      },
    ],
  });
  const [barImage, setBarImage] = useState({
    labels: [],
    datasets: [
      {
        label: 'No. of Images',
        backgroundColor: '#ad33ff',
        data: [],
      },
    ],
  });
  const [todayFile, setTodayFile] = useState({
    labels: [],
    datasets: [
      {
        label: 'No. of Files',
        backgroundColor: '#ff4dff',
        data: [],
      },
    ],
  });
  const [todayImage, setTodayImage] = useState({
    labels: [],
    datasets: [
      {
        label: 'No. of Images',
        backgroundColor: ' #ff4dff',
        data: [],
      },
    ],
  });
  const [weekFile, setWeekFile] = useState({
    labels: [],
    datasets: [
      {
        label: 'No. of Files',
        backgroundColor: ' #ad33ff',
        data: [],
      },
    ],
  });

  const [weekImage, setWeekImage] = useState({
    labels: [],
    datasets: [
      {
        label: 'No. of Images',
        backgroundColor: '#ad33ff',
        data: [],
      },
    ],
  });
  const [monthImage, setMonthImage] = useState({
    labels: [],
    datasets: [
      {
        label: 'No. of Images',
        backgroundColor: '#f87979',
        data: [],
      },
    ],
  });
  const [civilCase, setCivilCase] = useState({
    labels: [],
    datasets: [
      {
        // label: 'No. of Files',
        backgroundColor: '#f87979',
        data: [],
      },
    ],
  });
  const [criminalCase, setCriminalCase] = useState({
    labels: [],
    datasets: [
      {
        // label: 'No. of Images',
        backgroundColor: '#f87979',
        data: [],
      },
    ],
  });
  const [allLocationYesImage, setAllLocationYesImage] = useState({
    labels: [],
    datasets: [
      {
        label: 'No. of Images',
        backgroundColor: '#66b3ff',
        data: [],
      },
    ],
  });
  const [allLocationImage, setAllLocationImage] = useState({
    labels: [],
    datasets: [
      {
        label: 'No. of Images',
        backgroundColor: '#f87979',
        data: [],
      },
    ],
  });
  const [scannedData, setScannedData] = useState(null);
  const [locationReportData, setLocationReportData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Scanning',
        backgroundColor: '#02B2AF',
        data: [],
      },
    ],
  })
  const random = () => Math.round(Math.random() * 100)

  // let API = "http://ip-api.com/json/42.108.26.152"

  // const handleExport=()=>{
  //   if (csv) {
  //     const blob = new Blob([csv], { type: 'text/csv' });
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', 'export.csv');
  //     document.body.appendChild(link);
  //     link.click();
  //     // window.URL.revokeObjectURL(url);
  //     // document.body.removeChild(link);
  //   } else {
  //     console.error('CSV data is not available.');
  //   }

  // }

  const handleLocation = (locationName) => {
    if (!selectedLocations.includes(locationName)) {
      setSelectedLocations([...selectedLocations, locationName]);
      setSearchInput('');
    }
    setShowLocation(false); // Close the dropdown when a location is selected
    
  };
  

  const removeLocation = (locationName) => {
    setSelectedLocations(selectedLocations.filter((loc) => loc !== locationName));
  };

  const handleExport=()=>{
    const headers = [
      'Sr. No.',
      'Location',
      'Scanned (' + formattedPreviousDate + ')',
      '', 
      
      'Scanned (' + formattedYesterdayDate + ')',
      '', 
     
      'Scanned (' + formattedCurrentDate + ')',
      '', 
     
      'Cumulative till date',
      '', 
      
      'Remarks'
    ];
    
    const csvRows = [];
    csvRows.push(headers.join(',')); 
    const fileImageHeaders = ['','', 'Files', 'Images', 'Files', 'Images', 'Files', 'Images', 'Files', 'Images'];
    csvRows.push(fileImageHeaders.join(','));
    tableData.forEach((elem, index) => {
      
      const rowData = [
        index+1,
        elem.LocationName,
        elem.Prev_Files || '0',
        elem.Prev_Images || '0',
        
        elem.Yes_Files || '0',
        elem.Yes_Images || '0',
        
        elem.Today_Files || '0',
        elem.Today_Images || '0',
        
        elem.Total_Files || '0',
        elem.Total_Images || '0',
        
      
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


 

  
  useEffect(() => {

    const fetchLocationData = async () => {
      if (selectedLocations.length > 0) {
        try {
          setIsLoading(true);
          const locationDataResponses = await Promise.all(selectedLocations.map(location =>
            axios.get(`http://localhost:5000/api/locationwisetabularData?locationName=?`)
          ));
          const locationData = locationDataResponses.map(response => response.data);
          setLocationData(locationData);
          console.log("agra",locationData);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching location data:', error);
          setError('Error fetching location data. Please try again.');
          setIsLoading(false);
        }
      }
    };

    const fetchGraph1LocationData = async () => {
      if (selectedLocations.length > 0) {
        try {
          setIsLoading(true);
          const locationDataResponses = await Promise.all(selectedLocations.map(location =>
            axios.get(`http://localhost:5000/graph1LocationWise?locationName=?`)
          ));
          const locationData = locationDataResponses.map(response => response.data);
          setLocationData(locationData);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching location data:', error);
          setError('Error fetching location data. Please try again.');
          setIsLoading(false);
        }
      }
    };

    const fetchGraphFileData = () => {
      axios.get('http://localhost:5000/graph1')
        .then(response => {
          const apiData = response.data[0];
          const labels = Object.keys(apiData);
          const data = Object.values(apiData);
          console.log('Labels:', labels);
          console.log('Data:', data);
          const filteredData = data.filter((value, index) => {
            return labels[index] !== 'id';
          });
          setBarFile({
            labels: labels.filter(label => label !== 'id'),
            datasets: [
              {
                ...barFile.datasets[0],
                data: filteredData
              },
            ],
          });
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }

    const fetchData = () => {
      fetch("http://localhost:5000/locations")
        .then(response => response.json())
        .then(data => setLocations(data))
        .catch(error => console.error( error));
    };
    const fetchExportCsvFile = () => {
      axios.get(`http://localhost:5000/csv?LocationName=?}`,{responseType:'blob'})
        .then((response)=>{
          handleExport(selectedLocations,response.data);
        })
        .catch((error)=>{
          console.error('Error in exporting data:', error);
        });
    };

    


    const fetchGraphImageData = () => {
      axios.get('http://localhost:5000/graph2')
        .then(response => {
          const apiData = response.data[0];
          const labels = Object.keys(apiData);
          const data = Object.values(apiData);
          console.log('Labels:', labels);
          console.log('Data:', data);
          setBarImage({
            labels: labels.filter(label => label !== 'id'),
            datasets: [
              {
                ...barImage.datasets[0],
                data: data
              },
            ],
          });
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
    const fetchTodayGraphFileData = () => {
      axios.get('http://localhost:5000/graph7')
        .then(response => {
          const apiData = response.data[0];
          const labels = Object.keys(apiData);
          const data = Object.values(apiData);
          console.log('Labels:', labels);
          console.log('Data:', data);
          setTodayFile({
            labels: labels.filter(label => label !== 'id'),
            datasets: [
              {
                ...todayFile.datasets[0],
                data: data
              },
            ],
          });
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
    const fetchTodayGraphImageData = () => {
      axios.get('http://localhost:5000/graph8')
        .then(response => {
          const apiData = response.data[0];
          const labels = Object.keys(apiData);
          const data = Object.values(apiData);
          console.log('Labels:', labels);
          console.log('Data:', data);
          setTodayImage({
            labels: labels.filter(label => label !== 'id'),
            datasets: [
              {
                ...todayImage.datasets[0],
                data: data
              },
            ],
          });
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }

    const fetchWeekFileGraphData = () => {
      axios.get('http://localhost:5000/graph5')
        .then(response => {
          const apiData = response.data;
          const labels = apiData.map(item=>item["scandate"]);
          const data = apiData.map(item =>item["scannedfiles"]);
          console.log("weekly lables",labels);
          console.log("weekly data",data);
          setWeekFile({
            labels: labels.filter(label => label !== 'id'),
            datasets:[
              {
                ...weekFile.datasets[0],
                data: data
              },
            ],
            
          });
          console.log("weekly data fetch",weekFile)
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }

    const fetchWeekImageGraphData = () => {
      axios.get('http://localhost:5000/graph6')
        .then(response => {
          const apiData = response.data;
          const labels = apiData.map(item=>item["scandate"]);
          const data = apiData.map(item =>item["scannedimages"]);
          console.log("weekly lables",labels);
          console.log("weekly data",data);
          setWeekImage({
            labels: labels.filter(label => label !== 'id'),
            datasets:[
              {
                ...weekImage.datasets[0],
                data: data
              },
            ],
            
          });
          console.log("weekly data fetch",weekImage)
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }

    const fetchMonthImageGraphData=()=>{
      axios.get("http://localhost:5000/graphmonth")
      .then(response=>{
        const apiData=response.data
        const labels=apiData.map(item =>item['scandate'])
        const data=apiData.map(item =>item['Scanned No Of Images'])
        console.log("lables",labels);
        console.log("images",data);
        setMonthImage({
        labels: labels.filter(label => label !== 'id'),
        datasets:[
          {
            ...monthImage.datasets[0],
            data: data
          },
        ],
        
      });
      console.log("Monthly  data fetch",monthImage)
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });   
    }
    
    
    
    const fetchScannedData = () => {
      fetch('http://localhost:5000/scanned_images')
        .then(response => {
          const apiData = response.data[0];
          const labels = Object.keys(apiData);
          const data = Object.values(apiData);
          console.log('Labels:', labels);
          console.log('Data:', data);
          setTodayImage({
            labels: labels.filter(label => label !== 'id'),
            datasets: [
              {
                ...todayImage.datasets[0],
                data: data
              },
            ],
          });
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
    const fetchCivilCaseGraphData = () => {
      axios.get('http://localhost:5000/civil')
        .then(response => {
          const apiData = response.data[0];
          const labels = Object.keys(apiData);
          const data = Object.values(apiData);
          console.log('Labels:', labels);
          console.log('Data:', data);
          setCivilCase({
            labels: labels.filter(label => label !== 'id'),
            datasets: [
              {
                ...civilCase.datasets[0],
                data: data
              },
            ],
          });
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }


    const fetchCriminalCaseGraphData = () => {
      axios.get('http://localhost:5000/criminal')
        .then(response => {
          const apiData = response.data[0];
          const labels = Object.keys(apiData);
          const data = Object.values(apiData);
          console.log('Labels:', labels);
          console.log('Data:', data);
          setCriminalCase({
            labels: labels.filter(label => label !== 'id'),
            datasets: [
              {
                ...criminalCase.datasets[0],
                data: data
              },
            ],
          });
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });

    }
    const fetchAllYesGraphImageData = () => {
      axios.get('http://localhost:5000/graph9')
        .then(response => {
          const apiData = response.data;
          const labels = apiData.map(item => item["Location Name"]);
          const data = apiData.map(item => item["Images"]);
          console.log('TodayLabels:', labels);
          console.log('TodayData:', data);
          setAllLocationYesImage({
            labels: labels,
            datasets: [
              {
                ...allLocationYesImage.datasets,
                data: data,
                backgroundColor: '#02B2AF',
              },
            ],
          });
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });

    }

   
    const fetchAllGraphImageData = () => {
      axios.get('http://localhost:5000/graph10')
        .then(response => {
          const apiData = response.data;
          const labels = apiData.map(item => item["Location Name"]);
          const data = apiData.map(item => item["Images"]);
          console.log('TodayLabels:', labels);
          console.log('TodayData:', data);
          setAllLocationImage({
            labels: labels,
            datasets: [
              {
                ...allLocationImage.datasets,
                data: data,
                backgroundColor: '#02B2AF',
              },
            ],
          });
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
    const fetchTableData = () => {
      axios.get("http://localhost:5000/tabularData")
        .then(response => {
          setTableData(response.data);
          console.log("Table Data", response.data); // Log inside the then block
        })
        .catch(error => console.error(error));
    }


    const fetchLocationReportData = () => {
      axios.get('http://localhost:5000/location_report')
        .then(response => {
          const apiData = response.data;
          const labels = apiData.map(item => item.location_name);
          const data = apiData.map(item => item.images);
          setLocationReportData({
            labels: labels,
            datasets: [
              {
                label: 'Scanning',
                backgroundColor: '#ae32c5',
                data: data,
              },
            ],
          });
        })
        .catch(error => {
          // console.error('Error fetching data:', error);
         });
     }
    // fetchGraphData();
    fetchData();
    fetchGraphFileData();
    fetchGraphImageData();
    fetchWeekFileGraphData();
    fetchWeekImageGraphData();
    fetchMonthImageGraphData();
    fetchScannedData();
    fetchLocationReportData();
    fetchTodayGraphFileData();
    fetchTodayGraphImageData();
    fetchCivilCaseGraphData();
    fetchCriminalCaseGraphData();
    fetchAllYesGraphImageData();
    fetchAllGraphImageData();
    fetchTableData();
    fetchExportCsvFile();
    fetchLocationData();
    fetchGraph1LocationData();
    
  
    const intervalID =
      setInterval(fetchGraphImageData,
        fetchData,
        fetchGraphFileData,
        fetchTodayGraphFileData,
        fetchTodayGraphImageData,
        fetchWeekFileGraphData,
        fetchWeekImageGraphData,
        fetchMonthImageGraphData,
        fetchCivilCaseGraphData,
        fetchCriminalCaseGraphData,
        fetchAllYesGraphImageData,
        fetchAllGraphImageData,
        fetchTableData,
        fetchExportCsvFile,
        fetchLocationData,
        fetchGraph1LocationData,
      
        2000);
    return () => clearInterval(intervalID);
  }, [selectedLocations]);
// const SumofPrevFiles = sum(tableData.Prev_Files);

  return (
    <>
      <Header />
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-lg-2'></div>
          <div className='col-lg-10'>
            <div className='container-fluid'>
              <div className='row'>
                <p className='mt-1 fw-bold' style={{ color: '#4BC0C0', fontSize: '20px' }}>Dashboard</p>
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
                      {tableData && tableData.map((item, index) => (
                        <div key={index}>
                          <p onClick={() => handleLocation(item.LocationName)}>{item.LocationName}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className='col-md-2 col-sm-12'>
                <button className='btn search-btn' >Search</button>
              </div>
            </div>
              <div className='row mt-2'>
                <div className='card'>
                  <h4 className='ms-1'>SCANNING REPORT OF LAST 30 DAYS</h4>
                  <h5 className='ms-1'>All Location: Images</h5>
                 
                  <CCard>
                    <CCardBody>
                      <CChartBar
                        data={monthImage}
                        labels="months"
                      />
                    </CCardBody>
                  </CCard>
                
                  <div>

                    {scannedData && (
                      <BarChart
                        className='scanned-chart'
                        xAxis={scannedData.xAxis}
                        series={scannedData.series}
                        width={scannedData.width}
                        height={scannedData.height}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className='row mt-2'>
                <div className='table-card'>
                  <div className='row'>
                    <div className='card' style={{ padding: '5px', backgroundColor: '#4BC0C0' }}>
                      <h6 className='text-center' style={{ color: 'white' }}>PROJECT UPDATE OF SCANNING AND DIGITIZATION OF CASE RECORDS FOR DISTRICT COURT OF UTTAR PRADESH</h6>
                      <button onClick={handleExport}>Export CSV</button>
                    </div>
                  </div>
                  <div className='row mt-5 ms-2 me-2' style={{ overflowX: 'auto' }}>
                    <table class="table table-hover table-bordered table-responsive data-table" >
                      <thead style={{ color: '#4BC0C0' }}>
                        <tr>
                          <th rowspan="2">Sr. No.</th>
                          <th rowspan="2">Location</th>
                          <th colspan="2">Scanned ({formattedPreviousDate})</th>
                          <th colspan="2">Scanned ({formattedYesterdayDate})</th>
                          <th colspan="2">Scanned ({formattedCurrentDate})</th>
                          <th colspan="2">Cumulative till date</th>
                          <th rowspan="2">Remarks</th>
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
                        </tr>
                      </thead>
                      <tbody style={{ color: 'gray' }}>
                        
                        {tableData && tableData.map((elem, index) => {
                          if (selectedLocations.length === 0 || selectedLocations.includes(elem.LocationName)) {
                            return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{elem.LocationName }</td>
                            <td>{elem.Prev_Files || '0'}</td>
                            <td>{elem.Prev_Images || '0' }</td>
                            <td>{elem.Yes_Files || '0' }</td>
                            <td>{elem.Yes_Images || '0'}</td>
                            <td>{elem.Today_Files || '0'}</td>
                            <td>{elem.Today_Images || '0'}</td>
                            <td>{elem.Total_Files || '0'}</td>
                            <td>{elem.Total_Images || '0'}</td>
                            <td></td>
                          </tr>
                          );
                        }
                        return null;
                        })}

                        <tr style={{ color: 'black' }}>
                          <td colspan="2"><strong>Total</strong></td>
                          <td><strong></strong></td>
                          <td><strong>52,425</strong></td>
                          <td><strong>6,128</strong></td>
                          <td><strong>686,818</strong></td>
                          <td><strong>0</strong></td>
                          <td><strong>0</strong></td>
                          <td><strong>304,442</strong></td>
                          <td><strong>53,353,729</strong></td>
                          <td></td>
                        </tr>
                      </tbody>

                    </table>
                  </div>

                </div>
              </div>
              
              <div className='row'>
                <div className='col-md-6 col-sm-12'>
                  <CCard className="mb-4" style={{ marginLeft: '0px', marginRight: '0px' }}>
                    <h4 className='ms-1'>Cumulative Report</h4>
                    <h5 className='ms-1'>All Location: Files</h5>
                    <CCardBody>
          
                          <CChartBar
                          data={barFile}
                          labels="months"
                        />
                        
                      
                    </CCardBody>
                  </CCard>
                </div>
                <div className='col-md-6 col-sm-12' >
                  <CCard className="mb-4" style={{ marginLeft: '0px', marginRight: '0px' }}>
                    <h4 className='ms-1'>Cumulative Report</h4>
                    <h5 className='ms-1'>All Location: Images</h5>
                    <CCardBody>
                      <CChartBar
                        data={barImage}
                        labels="months"
                      />
                    </CCardBody>
                  </CCard>
                </div>
              </div>
              <div className='row'>
                <div className='col-md-6 col-sm-12'>
                  <CCard className="mb-4" style={{ marginLeft: '0px', marginRight: '0px' }}>
                    <h4 className='ms-1'>Case Type Report</h4>
                    <h5 className='ms-1'>Civil Cases</h5>
                    <CCardBody>
                      <CChartBar
                        data={civilCase}
                        labels="months"
                      />
                    </CCardBody>
                  </CCard>
                </div>
                <div className='col-md-6 col-sm-12' >
                  <CCard className="mb-4" style={{ marginLeft: '0px', marginRight: '0px' }}>
                    <h4 className='ms-1'>Case Type Report</h4>
                    <h5 className='ms-1'>Criminal Cases</h5>
                    <CCardBody>
                      <CChartBar
                        data={criminalCase}
                        labels="months"
                      />
                    </CCardBody>
                  </CCard>
                </div>
              </div>
              <div className='row'>
                <div className='col-md-6 col-sm-12'>
                  <CCard className="mb-4" style={{ marginLeft: '0px', marginRight: '0px' }}>
                    <h4 className='ms-1'>PRODUCTION REPORT FOR ({formattedYesterdayDate})</h4>
                    <h5 className='ms-1'>All Location: Files</h5>
                    <CCardBody>
                      <CChartBar
                        data={todayFile}
                        labels="months"
                      />
                    </CCardBody>
                  </CCard>
                </div>
                <div className='col-md-6 col-sm-12' >
                  <CCard className="mb-4" style={{ marginLeft: '0px', marginRight: '0px' }}>
                    <h4 className='ms-1'>PRODUCTION REPORT FOR ({formattedYesterdayDate})</h4>
                    <h5 className='ms-1'>All Location: Images</h5>
                    <CCardBody>
                      <CChartBar
                        data={todayImage}
                        labels="months"
                      />
                    </CCardBody>
                  </CCard>
                </div>
              </div>
              <div className='row'>
                <div className='col-md-6 col-sm-12' >
                  <CCard className="mb-4" style={{ marginLeft: '0px', marginRight: '0px' }}>
                    <h4 className='ms-1'>Weekly Report</h4>
                    <h5 className='ms-1'>All Location: Files</h5>
                    <CCardBody>
                      <CChartDoughnut
                        data={weekFile}
                        labels="months"
                      />
                    </CCardBody>
                  </CCard>
              </div>
              <div className='col-md-6 col-sm-12' >
                  <CCard className="mb-4" style={{ marginLeft: '0px', marginRight: '0px' }}>
                    <h4 className='ms-1'>Weekly Report</h4>
                    <h5 className='ms-1'>All Location: Images</h5>
                    <CCardBody>
                      <CChartDoughnut
                        data={weekImage}
                        labels="months"
                      />
                    </CCardBody>
                  </CCard>
                </div>
                </div>
                
              <div className='row'>
                <CCard>
                  <h4 className='ms-1'>SCANNED REPORT FOR ({formattedYesterdayDate})</h4>
                  <h5 className='ms-1'>All Location: Images</h5>
                  <CCardBody>
                    <CChartBar
                      data={allLocationYesImage}
                      labels="months"

                    >
                    </CChartBar>
                  </CCardBody>
                </CCard>
              </div>
              <div className='row mt-2'>
                <CCard>
                  <h4 className='ms-1'>CUMULATIVE SCANNED TILL DATE</h4>
                  <h5 className='ms-1'>All Location: Images</h5>
                  <CCardBody>
                    <CChartBar
                      data={allLocationImage}
                      labels="months"

                    >
                    </CChartBar>
                  </CCardBody>
                </CCard>
              </div>


              {/* <canvas id="barcasefile" height="449" width="642" style={{width: '642px',height: '449px;'}}></canvas> */}
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Dashboard









