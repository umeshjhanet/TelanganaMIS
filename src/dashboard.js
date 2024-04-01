import React, { useEffect, useState,useRef } from 'react'
import { CCard, CCardBody, CCol, CCardHeader, CRow } from '@coreui/react'
import { CChartBar, CChartDoughnut, CChartLine, CChartPie, CChartPolarArea, CChartRadar } from '@coreui/react-chartjs'
import Header from './Components/Header';
import axios, { all } from 'axios';
import './App.css';
import Footer from './Footer';
import { BarChart } from '@mui/x-charts/BarChart';
import { format, sub } from 'date-fns';
import { MdFileDownload } from "react-icons/md";

const Dashboard = () => {
  const [data2, setData2] = useState();
  const currentDate = new Date();
  const yesterdayDate = sub(currentDate, { days: 1 });
  const previousDate = sub(currentDate, { days: 2 });
  const formattedCurrentDate = format(currentDate, 'dd-MM-yyyy');
  const formattedYesterdayDate = format(yesterdayDate, 'dd-MM-yyyy');
  const formattedPreviousDate = format(previousDate, 'dd-MM-yyyy');
  const [tableData, setTableData] = useState([]);
  const[csv,setCsv]=useState(null);
  const[locationWiseCsv,setLocationWiseCsv]=useState();
  const dropdownRef = useRef(null);
  const [showLocation, setShowLocation] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [locations, setLocations] = useState();
  const [searchInput, setSearchInput] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [locationGraphData, setLocationGraphData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState('');
  
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
        backgroundColor: ['#ad33ff', '#ff5733', '#FC819E', '#3357ff', '#ff33ad', '#D37676', '#33adff'],
        data: [],
      },
    ],
  });

  const [weekImage, setWeekImage] = useState({
    labels: [],
    datasets: [
      {
        label: 'No. of Images',
        backgroundColor: '#ad33ff ',
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
        label: 'No. of Civil cases',
        backgroundColor: '#f87979',
        data: [],
      },
    ],
  });
  const [criminalCase, setCriminalCase] = useState({
    labels: [],
    datasets: [
      {
        label: 'No. of Criminal cases',
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
 
  const handleExport = () => {
    if (csv) {
      const link = document.createElement('a');
      link.href = csv;
      link.setAttribute('download', 'export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const calculateColumnSum = ( ) => {
    // Initialize variables to hold sum for each column
    let prevFilesSum = 0;
    let prevImagesSum = 0;
    let yesFilesSum = 0;
    let yesImagesSum = 0;
    let todayFilesSum = 0;
    let todayImagesSum = 0;
    let totalFilesSum = 0;
    let totalImagesSum = 0;

    // Iterate over tableData array
    tableData.forEach(elem => {
      if (selectedLocations.length === 0 || selectedLocations.includes(elem.LocationName)) {
        prevFilesSum += parseInt(elem.Prev_Files) || 0;
        prevImagesSum += parseInt(elem.Prev_Images) || 0;
        yesFilesSum += parseInt(elem.Yes_Files) || 0;
        yesImagesSum += parseInt(elem.Yes_Images) || 0;
        todayFilesSum += parseInt(elem.Today_Files) || 0;
        todayImagesSum += parseInt(elem.Today_Images) || 0;
        totalFilesSum += parseInt(elem.Total_Files) || 0;
        totalImagesSum += parseInt(elem.Total_Images) || 0;
      }
    });

    // Return an object containing the sums for each column
    return {
      prevFilesSum,
      prevImagesSum,
      yesFilesSum,
      yesImagesSum,
      todayFilesSum,
      todayImagesSum,
      totalFilesSum,
      totalImagesSum
    };
  }

  
  

  
  
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
    const locationName = selectedLocations;

    const fetchGraphFileData = (selectedLocations) => {
      let apiUrl = 'http://localhost:5000/graph1LocationWise';
    
      if (selectedLocations && selectedLocations.length > 0) {
        const locationQuery = selectedLocations.map(location => `locationname=${encodeURIComponent(location)}`).join('&');
        apiUrl += `?${locationQuery}`;
      }
    
      axios.get(apiUrl)
        .then(response => {
          const apiData = response.data;
          if (!apiData || apiData.length === 0) {
            console.error('No data received from the API');
            return;
          }
    
          const labels = Object.keys(apiData[0]).filter(label => label !== 'locationid' && label !== 'LocationName');
          const datasets = apiData.map(locationData => {
            return {
              label: 'No. of Files', // Use location name as label for each dataset
              data: labels.map(label => locationData[label]),
              backgroundColor: '#ad33ff', // Change the background color here
            };
          });
    
          setBarFile({
            labels: labels,
            datasets: datasets
          });
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
    
    

    // const fetchData = () => {
    //   fetch("http://localhost:5000/locations")
    //     .then(response => response.json())
    //     .then(data => setLocations(data))
    //     .catch(error => console.error( error));
    // };
    


    const fetchExportCsvFile = () => {
      const apiUrl = locationName ? `http://localhost:5000/csv?locationName=${locationName}` : 'http://localhost:5000/csv';

    axios.get(apiUrl, { responseType: 'blob' })
      .then(response => {
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        setCsv(url);
      })
      .catch(error => {
        console.error('Error in exporting data:', error);
      });
    };

    const fetchGraphImageData = (selectedLocations) => {
      let apiUrl = 'http://localhost:5000/graph2';
    
      if (selectedLocations && selectedLocations.length > 0) {
        const locationQuery = selectedLocations.map(location => `locationname=${encodeURIComponent(location)}`).join('&');
        apiUrl += `?${locationQuery}`;
      }
    
      axios.get(apiUrl)
        .then(response => {
          const apiData = response.data;
          if (!apiData || apiData.length === 0) {
            console.error('No data received from the API');
            return;
          }
    console.log("Api Data",apiData);
          const labels = Object.keys(apiData[0]).filter(label => label !== 'locationid' && label !== 'LocationName');
          const datasets = apiData.map(locationData => {
            return {
              label: 'No. of Images',
              data: labels.map(label => locationData[label]),
              backgroundColor: '#ad33ff', // Change the background color here
            };
          });
    
          setBarImage({
            labels: labels,
            datasets: datasets
          });
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
    const fetchTodayGraphFileData = () => {
      let apiUrl = 'http://localhost:5000/graph7';
    
      if (selectedLocations && selectedLocations.length > 0) {
        const locationQuery = selectedLocations.map(location => `locationname=${encodeURIComponent(location)}`).join('&');
        apiUrl += `?${locationQuery}`;
      }
    
      axios.get(apiUrl)
        .then(response => {
          const apiData = response.data;
          if (!apiData || apiData.length === 0) {
            console.error('No data received from the API');
            return;
          }
    
          const labels = Object.keys(apiData[0]).filter(label => label !== 'locationid' && label !== 'LocationName');
          const datasets = apiData.map(locationData => {
            return {
              label: 'No. of Files',
              data: labels.map(label => locationData[label]),
              backgroundColor: '#ad33ff', // Change the background color here
            };
          });
    
          setTodayFile({
            labels: labels,
            datasets: datasets
          });
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
    
    const fetchTodayGraphImageData = () => {
      let apiUrl = 'http://localhost:5000/graph8';
    
      if (selectedLocations && selectedLocations.length > 0) {
        const locationQuery = selectedLocations.map(location => `locationname=${encodeURIComponent(location)}`).join('&');
        apiUrl += `?${locationQuery}`;
      }
    
      axios.get(apiUrl)
        .then(response => {
          const apiData = response.data;
          if (!apiData || apiData.length === 0) {
            console.error('No data received from the API');
            return;
          }
    
          const labels = Object.keys(apiData[0]).filter(label => label !== 'locationid' && label !== 'LocationName');
          const datasets = apiData.map(locationData => {
            return {
              label: 'No. of Images',
              data: labels.map(label => locationData[label]),
              backgroundColor: '#ad33ff', // Change the background color here
            };
          });
    
          setTodayImage({
            labels: labels,
            datasets: datasets
          });
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }

    const fetchWeekFileGraphData = () => {
      const params = {
        params: {
          locationNames: selectedLocations // Assuming selectedLocations is an array of location names
        }
      };
      axios.get('http://localhost:5000/graph5', params)
        .then(response => {
          const apiData = response.data;
          const labels = apiData.map(item => item["scandate"]);
          const data = apiData.map(item => item["scannedfiles"]);
          console.log("weekly labels", labels);
          console.log("weekly data", data);
          setWeekFile({
            labels: labels,
            datasets: [
              {
                label: 'Scanned Files',
                data: data,
                backgroundColor: ['#ad33ff', '#ff5733', '#FC819E', '#3357ff', '#ff33ad', '#D37676', '#33adff'],
              },
            ],
          });
          console.log("weekly data fetch", weekFile);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    };
    
    const fetchWeekImageGraphData = () => {
      const params = {
        params: {
          locationNames: selectedLocations // Assuming selectedLocations is an array of location names
        }
      };
      axios.get('http://localhost:5000/graph6', params)
        .then(response => {
          const apiData = response.data;
          const labels = apiData.map(item => item["scandate"]);
          const data = apiData.map(item => item["scannedimages"]);
          console.log("weekly labels", labels);
          console.log("weekly data", data);
          setWeekImage({
            labels: labels,
            datasets: [
              {
                label: 'Scanned Images',
                data: data,
                backgroundColor: ['#ad33ff', '#ff5733', '#FC819E', '#3357ff', '#ff33ad', '#D37676', '#33adff'],
              },
            ],
          });
          console.log("weekly data fetch", weekImage);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    };
    

    const fetchMonthImageGraphData=()=>{
      const params = {
        params: {
          locationNames: selectedLocations // Assuming selectedLocations is an array of location names
        }
      };
      axios.get('http://localhost:5000/graphmonth', params)
        .then(response => {
          const apiData = response.data;
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
    
    
    
    // const fetchScannedData = () => {
    //   fetch('http://localhost:5000/scanned_images')
    //     .then(response => {
    //       const apiData = response.data[0];
    //       const labels = Object.keys(apiData);
    //       const data = Object.values(apiData);
    //       console.log('Labels:', labels);
    //       console.log('Data:', data);
    //       setTodayImage({
    //         labels: labels.filter(label => label !== 'id'),
    //         datasets: [
    //           {
    //             ...todayImage.datasets[0],
    //             data: data
    //           },
    //         ],
    //       });
    //     })
    //     .catch(error => {
    //       console.error('Error fetching data:', error);
    //     });
    // }
    const fetchCivilCaseGraphData = () => {
      let apiUrl = 'http://localhost:5000/civil';
    
      if (selectedLocations && selectedLocations.length > 0) {
        const locationQuery = selectedLocations.map(location => `locationname=${encodeURIComponent(location)}`).join('&');
        apiUrl += `?${locationQuery}`;
      }
    
      axios.get(apiUrl)
        .then(response => {
          const apiData = response.data;
          console.log("Civil case", apiData);
          if (!apiData || apiData.length === 0) {
            console.error('No data received from the API');
            return;
          }

          const labels = Object.keys(apiData[0]);
          const data = Object.values(apiData[0]);
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
      let apiUrl = 'http://localhost:5000/criminal';
    
      if (selectedLocations && selectedLocations.length > 0) {
        const locationQuery = selectedLocations.map(location => `locationname=${encodeURIComponent(location)}`).join('&');
        apiUrl += `?${locationQuery}`;
      }
    
      axios.get(apiUrl)
        .then(response => {
          const apiData = response.data;
          console.log("Civil case", apiData);
          if (!apiData || apiData.length === 0) {
            console.error('No data received from the API');
            return;
          }

          const labels = Object.keys(apiData[0]);
          const data = Object.values(apiData[0]);
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
    const fetchAllYesGraphImageData = (selectedLocations) => {
      let apiUrl = 'http://localhost:5000/graph9';
    
      if (selectedLocations && selectedLocations.length > 0) {
        const locationQuery = selectedLocations.map(location => `locationname=${encodeURIComponent(location)}`).join('&');
        apiUrl += `?${locationQuery}`;
      }
    
      axios.get(apiUrl)
        .then(response => {
          const apiData = response.data;
          if (!apiData || apiData.length === 0) {
            console.error('No data received from the API');
            return;
          }
    
          const labels = apiData.map(item => item["Location Name"]);
          const data = apiData.map(item => item["Images"]);
    
          console.log('TodayLabels:', labels);
          console.log('TodayData:', data);
    
          setAllLocationYesImage({
            labels: labels,
            datasets: [
              {
                label:'No. of Images',
                data: data,
                backgroundColor: '#02B2AF', // Set the background color
              },
            ],
          });
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
    
    
    const fetchAllGraphImageData = (selectedLocations) => {
      let apiUrl = 'http://localhost:5000/graph10';
    
      if (selectedLocations && selectedLocations.length > 0) {
        const locationQuery = selectedLocations.map(location => `locationname=${encodeURIComponent(location)}`).join('&');
        apiUrl += `?${locationQuery}`;
      }
    
      axios.get(apiUrl)
        .then(response => {
          const apiData = response.data;
          if (!apiData || apiData.length === 0) {
            console.error('No data received from the API');
            return;
          }
          const labels = apiData.map(item => item["Location Name"]);
          const data = apiData.map(item => item["Images"]);
          console.log('TodayLabels:', labels);
          console.log('TodayData:', data);
          setAllLocationImage({
            labels: labels,
            datasets: [
              {
                label:'No. of Images',
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


    // const fetchLocationReportData = () => {
    //   axios.get('http://localhost:5000/location_report')
    //     .then(response => {
    //       const apiData = response.data;
    //       const labels = apiData.map(item => item.location_name);
    //       const data = apiData.map(item => item.images);
    //       setLocationReportData({
    //         labels: labels,
    //         datasets: [
    //           {
    //             label: 'Scanning',
    //             backgroundColor: '#ae32c5',
    //             data: data,
    //           },
    //         ],
    //       });
    //     })
    //     .catch(error => {
    //       // console.error('Error fetching data:', error);
    //      });
    //  }
    // fetchGraphData();
    // fetchData();
    fetchGraphFileData(locationName);
    fetchGraphImageData(locationName);
    fetchWeekFileGraphData(locationName);
    fetchWeekImageGraphData(locationName);
    fetchMonthImageGraphData(locationName);
    // fetchScannedData();
    // fetchLocationReportData();
    fetchTodayGraphFileData(locationName);
    fetchTodayGraphImageData(locationName);
    fetchCivilCaseGraphData(locationName);
    fetchCriminalCaseGraphData(locationName);
    fetchAllYesGraphImageData(locationName);
    fetchAllGraphImageData(locationName);
    fetchTableData();
    fetchExportCsvFile();
    // fetchLocationData();
    
    
  
    // const intervalID =
    //   setInterval(fetchGraphImageData,
    //     // fetchData,
    //     // fetchGraphFileData,
    //     fetchTodayGraphFileData,
    //     fetchTodayGraphImageData,
    //     fetchWeekFileGraphData,
    //     fetchWeekImageGraphData,
    //     fetchMonthImageGraphData,
    //     fetchCivilCaseGraphData,
    //     fetchCriminalCaseGraphData,
    //     fetchAllYesGraphImageData,
    //     fetchAllGraphImageData,
    //     fetchTableData,
    //     fetchExportCsvFile,
    //     fetchLocationData,
    //     // fetchGraph1LocationData,
      
    //     );
    // return () => clearInterval(intervalID);
  }, [selectedLocations]);

  const columnSums = calculateColumnSum();

  return (
    <>
      <Header />
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-lg-2 col-md-2 '></div>
          <div className='col-lg-10 col-md-10'>
            {/* <div className='container-fluid'> */}
              <div className='row'>
                <p className='mt-1 fw-bold' style={{ color: '#4BC0C0', fontSize: '20px' }}>Dashboard</p>
              </div>
              <div className='row  mt-2  search-report-card'>
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
              <div className='col-md-6'></div>
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
                  <div className='row'style={{ padding: '5px', backgroundColor: '#4BC0C0',paddingTop:'15px' }}>
                    <div className='col-10' >
                      <h6 className='text-center' style={{ color: 'white' }}>PROJECT UPDATE OF SCANNING AND DIGITIZATION OF CASE RECORDS FOR DISTRICT COURT OF UTTAR PRADESH</h6>
                      </div>
                      <div className='col-2' >
                      <h6 style={{ color: 'white' }} onClick={handleExport}> <MdFileDownload style={{fontSize:'20px'}}/>Export CSV</h6>
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
                         
                          <td><strong>{columnSums.prevFilesSum}</strong></td>
        <td><strong>{columnSums.prevImagesSum}</strong></td>
        <td><strong>{columnSums.yesFilesSum}</strong></td>
        <td><strong>{columnSums.yesImagesSum}</strong></td>
        <td><strong>{columnSums.todayFilesSum}</strong></td>
        <td><strong>{columnSums.todayImagesSum}</strong></td>
        <td><strong>{columnSums.totalFilesSum}</strong></td>
        <td><strong>{columnSums.totalImagesSum}</strong></td>
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
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Dashboard









