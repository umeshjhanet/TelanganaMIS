import React, {useState, useEffect, useRef} from 'react'
import Header from './Components/Header'
import Footer from './Footer'

const File = () => {

    const [showLocation, setShowLocation] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [locations, setLocations] = useState();
    const [tableData, setTableData] = useState();
    const [searchInput, setSearchInput] = useState('');
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
    useEffect(() => {
      const fetchData = () => {
        fetch("http://localhost:5000/locations")
        // fetch("http://localhost:5000/locations")
          .then(response => response.json())
          .then(data => setLocations(data))
          .catch(error => console.error( error));
      };
      const fetchTableData = () => {
        fetch("http://localhost:5000/api/uploadlog")
        // fetch("http://localhost:5000/locations")
          .then(response => response.json())
          .then(data => setTableData(data))
          .catch(error => console.error( error));
      };
      
      fetchData();
      fetchTableData();
  
      const intervalId = setInterval(fetchData,fetchTableData, 5000);
  
      return () => clearInterval(intervalId);
    }, []);
    function formatDate(dateTimeString) {
        const dateTime = new Date(dateTimeString);
        const formattedDate = `${('0' + dateTime.getDate()).slice(-2)}-${('0' + (dateTime.getMonth() + 1)).slice(-2)}-${dateTime.getFullYear().toString().substr(-2)}`;
        return formattedDate;
    }
    function formatDateTime(dateTimeString) {
        const dateTime = new Date(dateTimeString);
        const formattedDate = `${('0' + dateTime.getDate()).slice(-2)}-${('0' + (dateTime.getMonth() + 1)).slice(-2)}-${dateTime.getFullYear().toString().substr(-2)}`;
        const formattedTime = `${('0' + dateTime.getHours()).slice(-2)}:${('0' + dateTime.getMinutes()).slice(-2)}:${('0' + dateTime.getSeconds()).slice(-2)}`;
        return `${formattedDate} ${formattedTime}`;
    }


    return(
        <>
        <Header/>
        <div className='container-fluid mb-5'>
            <div className='row'>
            <div className='col-lg-2 col-md-2 '></div>
          <div className='col-lg-10 col-md-9 col-sm-12'>
            <div className='row mt-4 me-1'>
              <div className='card' style={{ padding: '5px', backgroundColor: '#4BC0C0' }}>
                <h6 className='' style={{ color: 'white' }}>MIS Report/Last Upload File</h6>
              </div>
            </div>
            <div className='row mt-2 me-1 search-file-card'>
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
              
              <div className='col-md-2 col-sm-12'>
                <button className='btn search-btn'>Search</button>
              </div>
              <div className='row mt-5 '>
                <table className='table-bordered'>
                    <thead>
                        <tr>
                            <th>Sr.No.</th>
                            <th>Location Name</th>
                            <th>File Date</th>
                            <th>Upload Date Time</th>
                            <th>App Version</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData && tableData.map((elem,index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{elem.locationname}</td>
                                <td>{formatDate(elem.filedate)}</td>
                                <td>{formatDateTime(elem.uploaddate)}</td>
                                <td>{elem.appVersion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>
            </div>
            </div>
            </div>
        </div>
        <Footer/>
        </>
    )
}
  export default File;