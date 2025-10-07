import React, { useEffect, useState, useRef } from 'react'
import { API_URL } from './Api';
import Papa from 'papaparse';
import Header from './Components/Header';
import { MdFileDownload } from 'react-icons/md';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaChevronDown } from 'react-icons/fa';

const CustomerQAReport = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showLocation, setShowLocation] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [totalLocations, setTotalLocations] = useState(0);
    const [showCustomerBox, setShowCustomerBox] = useState(false);
    const [report, setReport] = useState();
    const [searchInput, setSearchInput] = useState("");
    const dropdownRef = useRef(null);
    const handleCustomerCsv = () => {
        setShowCustomerBox(!showCustomerBox);
    };
    const [locations, setLocations] = useState();

    const dropdownMenuRef = useRef(null);
    const [locationSearchInput, setLocationSearchInput] = useState("");
    // Add a new state for tracking highlighted index in dropdown
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    // Filtered locations based on search input
    const filteredLocations = locations?.filter(item =>
        item.toLowerCase().includes(locationSearchInput.toLowerCase())
    ) || [];

    // Add this ref for the dropdown menu

    const handleLocationKeyDown = (e) => {
        if (!showLocation) {
            setShowLocation(true);
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev => {
                    const newIndex = prev < filteredLocations.length - 1 ? prev + 1 : prev;

                    // Scroll to ensure the highlighted item is visible
                    if (dropdownMenuRef.current && newIndex !== prev) {
                        const highlightedElement = dropdownMenuRef.current.children[newIndex];
                        if (highlightedElement) {
                            highlightedElement.scrollIntoView({
                                block: 'nearest',
                                behavior: 'smooth'
                            });
                        }
                    }

                    return newIndex;
                });
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => {
                    const newIndex = prev > 0 ? prev - 1 : -1;

                    // Scroll to ensure the highlighted item is visible
                    if (dropdownMenuRef.current && newIndex !== prev && newIndex >= 0) {
                        const highlightedElement = dropdownMenuRef.current.children[newIndex];
                        if (highlightedElement) {
                            highlightedElement.scrollIntoView({
                                block: 'nearest',
                                behavior: 'smooth'
                            });
                        }
                    }

                    return newIndex;
                });
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredLocations.length === 1) {
                    handleLocation(filteredLocations[0]);
                    setHighlightedIndex(-1);
                    return;
                }
                if (highlightedIndex >= 0 && filteredLocations[highlightedIndex]) {
                    handleLocation(filteredLocations[highlightedIndex]);
                    setHighlightedIndex(-1);
                }
                break;
            case 'Backspace':
                if (locationSearchInput === '' && selectedLocations.length > 0) {
                    removeLocation(selectedLocations[selectedLocations.length - 1]);
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

    const handleLocation = (locationName) => {
        if (!selectedLocations.includes(locationName)) {
            setSelectedLocations([...selectedLocations, locationName]);
            setSearchInput("");
        }
        setLocationSearchInput("");
        setShowLocation(false);
        setHighlightedIndex(-1);
    };
    const removeLocation = (locationName) => {
        setSelectedLocations(
            selectedLocations.filter((loc) => loc !== locationName)
        );
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowLocation(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);
    const formatDate = (date) => {
        // Format to YYYY-MM-DD
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    useEffect(() => {
        fetchLocation();
    }, []);
    const fetchData = async () => {
        try {
            let apiUrl = `${API_URL}/customerqa`;
            const queryParams = {};
            const userLog = JSON.parse(localStorage.getItem('user'));
            if (userLog?.locations && userLog.locations.length === 1 && userLog.user_roles.includes("Cbsl User")) {
                queryParams.locationName = userLog.locations[0].name;
            } else if (selectedLocations) {
                queryParams.locationName = selectedLocations;
            }
            if (!queryParams.locationName) {
                setError("Location is required.");
                return;
            }
            if (startDate && endDate) {
                queryParams.startDate = formatDate(startDate);
                queryParams.endDate = formatDate(endDate);
            } else {
                setError("Start date and end date are required.");
                return;
            }
            

            setIsLoading(true);

            const response = await axios.get(apiUrl, { params: queryParams });

          

            // ✅ Ensure response.data is an array before setting state
            if (Array.isArray(response.data)) {
                setData(response.data);
            } else if (response.data && Array.isArray(response.data.data)) {
                setData(response.data.data); // If API returns { success: true, data: [...] }
            } else {
                setData([]); // Ensure it's never null
            }

            updateTotalLocations(response.data);
        } catch (error) {
            console.error("Error fetching report data:", error);
            setError("Error fetching report data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        const locationName = selectedLocations;


        const fetchReportData = async () => {
            try {
                let apiUrl = `${API_URL}/reportTable`;
                const queryParams = {};

                const userLog = JSON.parse(localStorage.getItem('user'));

                if (userLog?.locations && userLog.locations.length === 1 && userLog.user_roles.includes("Cbsl User")) {
                    // Set locationName from userLog if it exists and conditions are met
                    queryParams.locationName = userLog.locations[0].name;
                }
                else if (selectedLocations) {
                    queryParams.locationName = selectedLocations;
                }

                if (startDate && endDate) {
                    queryParams.startDate = formatDate(startDate);
                    queryParams.endDate = formatDate(endDate);
                }
              
                setIsLoading(true);
                const response = await axios.get(apiUrl, { params: queryParams });
               
                setReport(response.data);
                setIsLoading(false);
                updateTotalLocations(response.data);
            } catch (error) {
                console.error("Error fetching report data:", error);
                setError("Error fetching report data. Please try again.");
                setIsLoading(false);
            }
        };
        fetchReportData();
        // fetchData();
    }, [selectedLocations, startDate, endDate]);
    const exportCustomerCSV = () => {
        if (!data || data.length === 0) {
            alert("No data available to export!");
            return;
        }

        const csvData = data.map((item) => {
            const acceptFiles = Number(item.AcceptFiles) || 0;  // ✅ Convert to number, default to 0
            const rejectFiles = Number(item.RejectFiles) || 0;  // ✅ Convert to number, default to 0
            const verifiedFiles = acceptFiles + rejectFiles;   // ✅ Ensure numerical addition

            const percentAccepted = verifiedFiles > 0 ? ((acceptFiles / verifiedFiles) * 100).toFixed(2) : "0.00";
            const percentRejected = verifiedFiles > 0 ? ((rejectFiles / verifiedFiles) * 100).toFixed(2) : "0.00";

            return {
                Location: item.locationName,
                Date: item.Date ? new Date(item.Date).toLocaleDateString("en-GB") : "", // ✅ Format date
                "Verified Files": verifiedFiles,
                "Accepted Files": acceptFiles,
                "Rejected Files": rejectFiles,
                "% Accepted Files": `${percentAccepted} %`,
                "% Rejected Files": `${percentRejected} %`,
            };
        });

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "customerQA_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const updateTotalLocations = (data) => {
        const uniqueLocations = [...new Set(data.map(elem => elem.LocationName))];
        setTotalLocations(uniqueLocations.length);
       
    };
   
    const fetchLocation = async () => {
        try {
            let apiUrl = `${API_URL}/locations`;
            setIsLoading(true);
            const response = await axios.get(apiUrl);
         

            // Extract just the LocationName values
            const locationNames = response.data.map(item => item.LocationName );

            setLocations(locationNames);
            setIsLoading(false);
            updateTotalLocations(locationNames);
        } catch (error) {
            console.error("Error fetching locations:", error);
            setError("Error fetching locations. Please try again.");
            setIsLoading(false);
        }
    };
    const handleClick = () => {
        fetchData(selectedLocations, startDate, endDate);
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
            <div className={`container-fluid ${isLoading ? 'blur' : ''}`}>
                <div className="row">
                    <div className="col-lg-2 col-md-0 "></div>
                    <div className="col-lg-10 col-md-12 col-sm-12">
                        <div className="row mt-2 me-1">
                            <div
                                className="card"
                                style={{ padding: "5px", backgroundColor: "#4BC0C0" }}
                            >
                                <h6 className="" style={{ color: "white" }}>
                                    Dashboard / Site Wise Project Summary Report
                                </h6>
                            </div>
                        </div>
                     
                        <div className='search-report-card mt-2 me-1'>
                            <p>Select Location, Start Date and End Date to view data.</p>
                        <div
                            className=" mt-2 me-1"
                            style={{
                                minHeight: '50px',
                                padding: '5px',
                                display: 'flex',
                                gap: '10px',            // Fixed horizontal gap between items
                                alignItems: 'center',   // Vertically center items
                                flexWrap: 'wrap'        // Allow wrapping for smaller screens
                            }}
                        >
                        
                            
                            {/* Search Box */}
                            <div style={{ minWidth: '250px', position: 'relative' }}>
                                <div
                                    ref={dropdownRef}
                                    className="search-bar"
                                    style={{
                                        border: "1px solid #000",
                                        padding: "5px",
                                        borderRadius: "2px",
                                        height: "38px",
                                        display: "flex",
                                        flexWrap: "wrap",
                                        alignItems: "center",
                                        position: "relative",
                                        width: "100%",
                                        marginTop: "-4px"
                                    }}
                                    onClick={() => setShowLocation(true)}
                                >
                                    {selectedLocations.map((location, index) => (
                                        <span
                                            key={index}
                                            className="selected-location"
                                            style={{
                                                padding: "5px",
                                                borderRadius: "5px",
                                                margin: "2px",
                                                display: "inline-block",
                                                marginTop: "-20px"
                                            }}
                                        >
                                            {location}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeLocation(location);
                                                }}
                                                style={{
                                                    backgroundColor: "black",
                                                    color: "white",
                                                    border: "none",
                                                    marginLeft: "5px",
                                                    borderRadius: "50%",
                                                    width: "18px",
                                                    height: "18px",
                                                    fontSize: "12px",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}
                                            >
                                                ×
                                            </button>
                                            &nbsp;
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        placeholder={selectedLocations.length === 0 ? "Search Locations..." : ""}
                                        value={locationSearchInput}
                                        onChange={(e) => {
                                            setLocationSearchInput(e.target.value);
                                            setShowLocation(true);
                                        }}
                                        onKeyDown={handleLocationKeyDown}
                                        style={{
                                            border: "none",
                                            outline: "none",
                                            width: "100%",
                                            backgroundColor: "transparent",
                                            minWidth: "60px",
                                            flex: 1,
                                            paddingRight: "25px"
                                        }}
                                    />
                                </div>
                                {selectedLocations == 0 && showLocation && (
                                    <div
                                        ref={dropdownMenuRef}
                                        className="location-card"
                                        style={{
                                            position: 'absolute',
                                            width: '220px',
                                            maxWidth: '310px',
                                            backgroundColor: 'white',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            minHeight: '200px',
                                            overflowY: 'auto',
                                            zIndex: 1000,
                                            marginTop: '2px',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                        }}
                                    >
                                        {filteredLocations.map((location, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    padding: '8px 12px',
                                                    cursor: 'pointer',
                                                    borderBottom: '1px solid #eee',
                                                    backgroundColor: index === highlightedIndex ? '#f0f0f0' : 'transparent'
                                                }}
                                                onClick={() => handleLocation(location)}
                                                onMouseEnter={() => setHighlightedIndex(index)}
                                            >
                                                {location}
                                            </div>
                                        ))}
                                        {filteredLocations.length === 0 && (
                                            <div style={{ padding: '8px 12px', color: '#999' }}>No locations found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {/* Date fields and button */}
                            <div
                                style={{
                                    // display: 'flex',
                                    //alignItems: 'center',
                                    // gap: '10px',           // Small gap between input/button
                                    // flexWrap: 'wrap'
                                }}
                            >
                                <DatePicker
                                    className="date-field"
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    dateFormat="dd-MM-yyyy"
                                    placeholderText="Start Date"
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    popperProps={{
                                        modifiers: [
                                            {
                                                name: 'preventOverflow',
                                                options: {
                                                    rootBoundary: 'viewport',
                                                    tether: false,
                                                    altAxis: true,
                                                },
                                            },
                                        ],
                                    }}
                                    popperClassName="compact-picker"
                                />
                                <button
                                    className="btn ms-1 me-1"
                                    style={{
                                        height: "40px",
                                        backgroundColor: "#4BC0C0",
                                        marginBottom: "5px",
                                        borderRadius: "0px",
                                        color: 'white',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    To
                                </button>
                                <DatePicker
                                    className="date-field"
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    dateFormat="dd-MM-yyyy"
                                    placeholderText="End Date"
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    popperProps={{
                                        modifiers: [
                                            {
                                                name: 'preventOverflow',
                                                options: {
                                                    rootBoundary: 'viewport',
                                                    tether: false,
                                                    altAxis: true,
                                                },
                                            },
                                        ],
                                    }}
                                    popperClassName="compact-picker"
                                />
                                <button
                                    className="btn add-btn"
                                    onClick={handleClick}
                                    style={{
                                        height: "40px",
                                        backgroundColor: "#4BC0C0",
                                        color: 'white',
                                        borderRadius: '0px',
                                        marginLeft: '8px',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                        </div>

                        <div className="row mt-2 me-1">
                            <div className="table-card">
                                <div
                                    className="row"
                                    style={{
                                        padding: "5px",
                                        backgroundColor: "#4BC0C0",
                                        paddingTop: "15px",
                                    }}
                                >
                                    <div className="col-10">
                                        <h6 className="" style={{ color: "white" }}>
                                            CUSTOMER QA REPORT
                                        </h6>
                                    </div>
                                    <div className="col-2">
                                        <h6 style={{ color: "white", cursor: "pointer" }} onClick={handleCustomerCsv}>
                                            {" "}
                                            <MdFileDownload style={{ fontSize: "20px" }} />
                                            Export CSV
                                        </h6>

                                    </div>
                                    {showCustomerBox && (
                                        <div className="confirmation-dialog">
                                            <div className="confirmation-content">
                                                <p className="fw-bold">Are you sure you want to export csv file?</p>
                                                <button className="btn btn-success mt-3 ms-5" onClick={exportCustomerCSV}>Yes</button>
                                                <button className="btn btn-danger ms-3 mt-3" onClick={handleCustomerCsv}>No</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div
                                    className="row mt-3 ms-2 me-2"
                                    style={{ overflowX: "auto", maxHeight: '500px' }}
                                >

                                    <table className="table table-hover table-bordered table-responsive data-table">
                                        <thead style={{ color: "#4bc0c0", fontWeight: "300", textAlign: "center" }}>
                                            <tr>
                                                <th style={{ whiteSpace: "nowrap", verticalAlign: "middle" }}>Location</th>
                                                <th style={{ verticalAlign: "middle" }}>Date</th>
                                                <th style={{ verticalAlign: "middle" }}>Verified Files</th>
                                                <th style={{ verticalAlign: "middle" }}>Accepted Files</th>
                                                <th style={{ verticalAlign: "middle" }}>Rejected Files</th>
                                                <th style={{ verticalAlign: "middle" }}>% Accepted Files</th>
                                                <th style={{ verticalAlign: "middle" }}>% Rejected Files</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data?.map((item, index) => {
                                                const verifiedFiles = Number(item.AcceptFiles) + Number(item.RejectFiles); // ✅ Ensure numerical addition
                                                const percentAccepted =
                                                    verifiedFiles > 0 ? ((item.AcceptFiles / verifiedFiles) * 100).toFixed(2) : "0.00";
                                                const percentRejected =
                                                    verifiedFiles > 0 ? ((item.RejectFiles / verifiedFiles) * 100).toFixed(2) : "0.00";

                                                return (
                                                    <tr key={index}>
                                                        <td>{item.locationName}</td>
                                                        <td>{new Date(item.Date).toLocaleDateString("en-GB")}</td> {/* ✅ Format Date */}
                                                        <td>{verifiedFiles}</td> {/* ✅ Show sum of Accept & Reject */}
                                                        <td>{item.AcceptFiles}</td>
                                                        <td>{item.RejectFiles}</td>
                                                        <td>{percentAccepted} %</td> {/* ✅ Percentage Calculation */}
                                                        <td>{percentRejected} %</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CustomerQAReport