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
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

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
                setHighlightedIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLocation = (locationName) => {
        if (!selectedLocations.includes(locationName)) {
            setSelectedLocations([...selectedLocations, locationName]);
        }
        setSearchInput('');
        setFilteredLocations(locations);
        setShowLocation(false);
        setHighlightedIndex(-1);
        inputRef.current.focus();
    };

    const removeLocation = (location, e) => {
        e.stopPropagation();
        setSelectedLocations(selectedLocations.filter((loc) => loc !== location));
        inputRef.current.focus();
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);
        setHighlightedIndex(-1);

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

    const handleRefreshClick = () => {
        setSelectedSearchLocations([]);
        setSelectedLocations([]);
        setSearchInput('');
        setFilteredLocations(locations);
        setHighlightedIndex(-1);
    };

    const handleInputClick = () => {
        setShowLocation(true);
        setHighlightedIndex(-1);
        inputRef.current.focus();
    };

    const handleKeyDown = (e) => {
        if (!showLocation) {
            setShowLocation(true);
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev =>
                    prev < filteredLocations.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && filteredLocations[highlightedIndex]) {
                    handleLocation(filteredLocations[highlightedIndex].LocationName);
                } else if (filteredLocations.length === 1) {
                    handleLocation(filteredLocations[0].LocationName);
                }
                break;
            case 'Backspace':
                if (searchInput === '' && selectedLocations.length > 0) {
                    removeLocation(selectedLocations[selectedLocations.length - 1], {
                        stopPropagation: () => {}
                    });
                }
                break;
            case 'Escape':
                setShowLocation(false);
                setHighlightedIndex(-1);
                break;
            default:
                break;
        }
    };

    const handleLocationMouseEnter = (index) => {
        setHighlightedIndex(index);
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
                            <div className='col-md-4 col-sm-12' style={{position:"relative"}}>
                                <div className="search-container" ref={dropdownRef}>
                                    <div 
                                        className="search-bar "
                                        style={{ 
                                            border: '1px solid #000', 
                                            padding: '5px', 
                                            borderRadius: '5px', 
                                            minHeight: '39px', 
                                            width: '242px',
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            alignItems: 'center',
                                            cursor: 'text'
                                        }}
                                        onClick={handleInputClick}
                                    >
                                        {selectedLocations.map((location, index) => (
                                            <span 
                                                key={index} 
                                                className="selected-location" 
                                                style={{ 
                                                    padding: '2px 5px', 
                                                    border: '1px solid #ccc', 
                                                    borderRadius: '3px', 
                                                    margin: '2px', 
                                                    backgroundColor: '#f0f0f0',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                {location}
                                                <button 
                                                    onClick={(e) => removeLocation(location, e)} 
                                                    style={{ 
                                                        backgroundColor: 'black',
                                                        color: 'white',
                                                        border: 'none',
                                                        marginLeft: '5px',
                                                        width: '19px',
                                                        height: '20px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        borderRadius: '50%',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            style={{ 
                                                border: 'none',
                                                outline: 'none',
                                                flex: 1,
                                                minWidth: '50px'
                                            }}
                                            value={searchInput}
                                            onChange={handleSearchChange}
                                            onKeyDown={handleKeyDown}
                                            placeholder={selectedLocations.length === 0 ? "Search or select a location" : ""}
                                        />
                                    </div>
                                    
                                    {showLocation && (
                                        <div 
                                            className="location-card" 
                                            style={{ 
                                                position: 'absolute', 
                                                background: '#fff', 
                                                border: '1px solid #ccc', 
                                                zIndex: 10,
                                                maxHeight: '200px',
                                                overflowY: 'auto',
                                                width: '242px',
                                                marginTop: '2px'
                                            }}
                                        >
                                            {filteredLocations.length > 0 ? (
                                                filteredLocations.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => handleLocation(item.LocationName)}
                                                        onMouseEnter={() => handleLocationMouseEnter(index)}
                                                        style={{ 
                                                            cursor: 'pointer', 
                                                            padding: '8px',
                                                            margin: 0,
                                                            borderBottom: '1px solid #eee',
                                                            backgroundColor: index === highlightedIndex ? '#f0f0f0' : 'transparent'
                                                        }}
                                                    >
                                                        {item.LocationName}
                                                    </div>
                                                ))
                                            ) : (
                                                <div style={{ padding: '8px', margin: 0 }}>No locations found</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='col-md-2 col-sm-12'>
                                <button className='btn search-btn' onClick={handleSearchClick}>Search</button>
                            </div>
                            <div className='col-md-2 col-sm-12'>
                                <button className='btn search-btn' style={{marginLeft:"2px"}} onClick={handleRefreshClick}>Refresh</button>
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