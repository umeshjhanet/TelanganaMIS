import React, { useState, useEffect, useRef } from 'react';
import Header from './Components/Header';
import Footer from './Components/Footer';
import { API_URL } from './Api';
import axios from 'axios';
import moment from 'moment/moment';

const File = () => {
    const [showLocation, setShowLocation] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [selectedSearchLocations, setSelectedSearchLocations] = useState([]);
    const [locations, setLocations] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${API_URL}/locations`);
                setLocations(response.data);
                setFilteredLocations(response.data);
            } catch (error) {
                console.error(error);
            }
            setIsLoading(false);
        };

        const fetchTableData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${API_URL}/api/uploadlog`);
                setTableData(response.data);
            } catch (error) {
                console.error(error);
            }
            setIsLoading(false);
        };

        fetchData();
        fetchTableData();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowLocation(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLocation = (location) => {
        if (!selectedLocations.includes(location)) {
            setSelectedLocations([...selectedLocations, location]);
        }
        setSearchInput('');
        setFilteredLocations(locations);
        setShowLocation(false);
    };

    const removeLocation = (location) => {
        setSelectedLocations(selectedLocations.filter((loc) => loc !== location));
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);

        if (value === '') {
            setFilteredLocations(locations);
        } else {
            setFilteredLocations(
                locations.filter((loc) =>
                    loc.LocationName.toLowerCase().includes(value.toLowerCase())
                )
            );
        }
    };

    const handleSearchClick = () => {
        setSelectedSearchLocations([...selectedLocations]);
    };

    return (
        <>
            {isLoading && <div className="loader-overlay"><div className="loader"></div></div>}
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
                                <div className="search-container" ref={dropdownRef}>
                                    <input
                                        type="text"
                                        className="search-bar mt-1"
                                        style={{ border: '1px solid #000', padding: '5px', borderRadius: '5px', minHeight: '30px', width: '100%' }}
                                        value={searchInput}
                                        onChange={handleSearchChange}
                                        onClick={() => setShowLocation((prev) => !prev)} // Toggle dropdown on click
                                        placeholder="Search or select a location"
                                    />
                                    {showLocation && (
                                        <div className="location-card" style={{ position: 'absolute', top: '180px', background: '#fff', border: '1px solid #ccc', zIndex: 10 }}>
                                            {filteredLocations.length > 0 ? (
                                                filteredLocations.map((item, index) => (
                                                    <p key={index} onClick={() => handleLocation(item.LocationName)} style={{ cursor: 'pointer', padding: '5px' }}>
                                                        {item.LocationName}
                                                    </p>
                                                ))
                                            ) : (
                                                <p>No locations found</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="selected-locations mt-2">
                                    {selectedLocations.map((location, index) => (
                                        <span key={index} className="selected-location" style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '5px', margin: '2px', display: 'inline-block' }}>
                                            {location}
                                            <button onClick={() => removeLocation(location)} style={{ marginLeft: '5px', backgroundColor: 'black', color: 'white', border: 'none' }}>x</button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className='col-md-2 col-sm-12'>
                                <button className='btn search-btn' onClick={handleSearchClick}>Search</button>
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
                                        if (selectedSearchLocations.length === 0 || selectedSearchLocations.includes(elem.locationname)) {
                                            return (
                                                <tr key={index}>
                                                    <td style={{ textAlign: 'left' }}>{index + 1}</td>
                                                    <td style={{ textAlign: 'left' }}>{elem.locationname}</td>
                                                    <td style={{ textAlign: 'left' }}>{moment(elem.filedate, 'YYYY-MM-DD').format('DD-MM-YYYY')}</td>
                                                    <td style={{ textAlign: 'left' }}>{moment(elem.uploaddate, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY HH:mm:ss')}</td>
                                                    <td style={{ textAlign: 'left' }}>{elem.appVersion}</td>
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
