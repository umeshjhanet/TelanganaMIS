// import React, { useState, useEffect, useRef } from 'react';
// import Header from './Components/Header';
// import Footer from './Footer';
// import { API_URL } from './Api';
// import axios from 'axios';

// const File = () => {

//     const [showLocation, setShowLocation] = useState(false);
//     const [selectedLocations, setSelectedLocations] = useState([]);
//     const [locations, setLocations] = useState();
//     const [tableData, setTableData] = useState();
//     const [searchInput, setSearchInput] = useState('');
//     const [isLoading, setIsLoading] = useState(true);
//     const dropdownRef = useRef(null);

//     const handleLocation = (location) => {
//         if (!selectedLocations.includes(location)) {
//             setSelectedLocations([...selectedLocations, location]);
//             setSearchInput('');
//         }
//         setShowLocation(false); // Close the dropdown when a location is selected
//     };

//     const removeLocation = (location) => {
//         setSelectedLocations(selectedLocations.filter((loc) => loc !== location));
//     };

//     useEffect(() => {
//         const fetchData = () => {
//             setIsLoading(true);
//             axios.get(`${API_URL}/locations`)
//                 .then(response => {
//                     setLocations(response.data)
//                     setIsLoading(false);
//                 })
//                 .catch(error => {
//                     console.error(error)
//                     setIsLoading(false);
//                 });

//         };
//         const fetchTableData = () => {
//             setIsLoading(true);
//             axios.get(`${API_URL}/api/uploadlog`)
//                 .then(response => {
//                     setTableData(response.data)
//                     setIsLoading(false);
//                 })
//                 .catch(error => console.error(error));
//             setIsLoading(false);
//         };

//         fetchData();
//         fetchTableData();


//     }, []);

//     const formatDate = (dateTimeString) => {
//         const dateTime = new Date(dateTimeString);
//         const formattedDate = `${('0' + dateTime.getDate()).slice(-2)}-${('0' + (dateTime.getMonth() + 1)).slice(-2)}-${dateTime.getFullYear().toString().substr(-2)}`;
//         return formattedDate;
//     }

//     function formatDateTime(dateTimeString) {
//         const dateTime = new Date(dateTimeString);
//         const formattedDate = `${('0' + dateTime.getDate()).slice(-2)}-${('0' + (dateTime.getMonth() + 1)).slice(-2)}-${dateTime.getFullYear()}`;
//         const formattedTime = `${('0' + dateTime.getUTCHours()).slice(-2)}:${('0' + dateTime.getUTCMinutes()).slice(-2)}:${('0' + dateTime.getUTCSeconds()).slice(-2)}`;
//         return `${formattedDate} ${formattedTime}`;
//     }
//     const Loader = () => (
//         <div className="loader-overlay">
//             <div className="loader"></div>
//         </div>
//     );

//     return (
//         <>
//             {isLoading && <Loader />}
//             <Header />
//             <div className={`container-fluid mb-5 ${isLoading ? 'blur' : ''}`}>
//                 <div className='row'>
//                     <div className='col-lg-2 col-md-0 '></div>
//                     <div className='col-lg-10 col-md-12 col-sm-12'>
//                         <div className='row mt-4 me-1'>
//                             <div className='card' style={{ padding: '5px', backgroundColor: '#4BC0C0' }}>
//                                 <h6 className='' style={{ color: 'white' }}>MIS Report/Last Upload File</h6>
//                             </div>
//                         </div>
//                         <div className='row mt-2 me-1 search-file-card'>
//                             <div className='col-md-4 col-sm-12'>
//                                 <div
//                                     ref={dropdownRef}
//                                     className='search-bar mt-1'
//                                     style={{ border: '1px solid #000', padding: '5px', borderRadius: '5px', minHeight: '30px' }}
//                                     contentEditable={true}
//                                     onClick={() => setShowLocation(!showLocation)}
//                                 >
//                                     {selectedLocations.map((location, index) => (
//                                         <span key={index} className='selected-location'>
//                                             {location}
//                                             <button onClick={() => removeLocation(location)} style={{ backgroundColor: 'black', color: 'white', border: 'none', marginLeft: '5px', }}>x</button>
//                                             &nbsp;
//                                         </span>
//                                     ))}
//                                     <span style={{ minWidth: '5px', display: 'inline-block' }}>&#8203;</span>
//                                 </div>
//                                 {showLocation && (
//                                     <>
//                                         <div className='location-card' >
//                                             {locations && locations.map((item, index) => (
//                                                 <div key={index}>
//                                                     <p onClick={() => handleLocation(item.LocationName)}>{item.LocationName}</p>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </>
//                                 )}
//                             </div>

//                             <div className='col-md-2 col-sm-12'>
//                                 <button className='btn search-btn'>Search</button>
//                             </div>

//                             <table className='table-bordered table-hover user-tables mt-3'>
//                                 <thead style={{ backgroundColor: '#4BC0C0', color: 'white' }}>
//                                     <tr>
//                                         <th style={{ fontWeight: '500' }}>Sr.No.</th>
//                                         <th style={{ fontWeight: '500' }}>Location Name</th>
//                                         <th style={{ fontWeight: '500' }}>File Date</th>
//                                         <th style={{ fontWeight: '500' }}>Upload Date Time</th>
//                                         <th style={{ fontWeight: '500' }}>App Version</th>
//                                     </tr>
//                                 </thead>

//                                 <tbody>
//                                     {tableData && tableData.map((elem, index) => {
//                                         if (selectedLocations.length === 0 || selectedLocations.includes(elem.locationname)) {
//                                             return (
//                                                 <tr key={index}>
//                                                     <td>{index + 1}</td>
//                                                     <td>{elem.locationname}</td>
//                                                     <td>{formatDate(elem.filedate)}</td>
//                                                     <td>{formatDateTime(elem.uploaddate)}</td>
//                                                     <td>{elem.appVersion}</td>
//                                                 </tr>
//                                             );
//                                         }
//                                         return null;
//                                     })}
//                                 </tbody>



//                             </table>

//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </>
//     )
// }
// export default File;
import React, { useState, useEffect, useRef } from 'react';
import Header from './Components/Header';
import Footer from './Footer';
import { API_URL } from './Api';
import axios from 'axios';

const File = () => {
    const [showLocation, setShowLocation] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [locations, setLocations] = useState();
    const [tableData, setTableData] = useState();
    const [searchInput, setSearchInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const dropdownRef = useRef(null);

    const handleLocation = (location) => {
        if (!selectedLocations.includes(location)) {
            setSelectedLocations([...selectedLocations, location]);
            setSearchInput('');
        }
        setShowLocation(false); // Close the dropdown when a location is selected
    };

    const removeLocation = (location) => {
        setSelectedLocations(selectedLocations.filter((loc) => loc !== location));
    };

    useEffect(() => {
        const fetchData = () => {
            setIsLoading(true);
            axios.get(`${API_URL}/locations`)
                .then(response => {
                    setLocations(response.data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error(error);
                    setIsLoading(false);
                });
        };
        const fetchTableData = () => {
            setIsLoading(true);
            axios.get(`${API_URL}/api/uploadlog`)
                .then(response => {
                    setTableData(response.data);
                    setIsLoading(false);
                })
                .catch(error => console.error(error));
            setIsLoading(false);
        };

        fetchData();
        fetchTableData();
    }, []);

    const formatDate = (dateTimeString) => {
        const dateTime = new Date(dateTimeString);
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'Asia/Kolkata'
        };
    
        return new Intl.DateTimeFormat('en-GB', options).format(dateTime);
    };
    
    const formatDateTime = (dateTimeString) => {
        const dateTime = new Date(dateTimeString);
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'Asia/Kolkata'
        };
    
        return new Intl.DateTimeFormat('en-GB', options).format(dateTime);
    };
    
    
    
    const Loader = () => (
        <div className="loader-overlay">
            <div className="loader"></div>
        </div>
    );

    return (
        <>
            {isLoading && <Loader />}
            <Header />
            <div className={`container-fluid mb-5 ${isLoading ? 'blur' : ''}`}>
                <div className='row'>
                    <div className='col-lg-2 col-md-0 '></div>
                    <div className='col-lg-10 col-md-12 col-sm-12'>
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
                                        <div className='location-card'>
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
    
                            <table className='table-bordered table-hover user-tables mt-3'>
                                <thead style={{ backgroundColor: '#4BC0C0', color: 'white' }}>
                                    <tr>
                                        <th style={{ fontWeight: '500' }}>Sr.No.</th>
                                        <th style={{ fontWeight: '500' }}>Location Name</th>
                                        <th style={{ fontWeight: '500' }}>File Date</th>
                                        <th style={{ fontWeight: '500' }}>Upload Date Time</th>
                                        <th style={{ fontWeight: '500' }}>App Version</th>
                                    </tr>
                                </thead>
    
                                <tbody>
                                    {tableData && tableData.map((elem, index) => {
                                        if (selectedLocations.length === 0 || selectedLocations.includes(elem.locationname)) {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{elem.locationname}</td>
                                                    <td>{formatDate(elem.filedate)}</td>
                                                    <td>{formatDateTime(elem.uploaddate)}</td>
                                                    <td>{elem.appVersion}</td>
                                                </tr>
                                            );
                                        }
                                        return null;
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default File;


