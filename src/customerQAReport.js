import React, { useEffect, useState, useRef } from 'react'
import { API_URL } from './Api';
import Papa from 'papaparse';
import Header from './Components/Header';
import { MdFileDownload } from 'react-icons/md';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
            console.log("API URL:", apiUrl);
            console.log("Query Params:", queryParams);

            setIsLoading(true);

            const response = await axios.get(apiUrl, { params: queryParams });

            console.log("API Response:", response.data);

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
                console.log("API URL:", apiUrl); // Log the constructed API URL
                console.log("Query Params:", queryParams); // Log query parameters

                setIsLoading(true);
                const response = await axios.get(apiUrl, { params: queryParams });
                console.log("API Response:", response.data); // Log the API response
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
        console.log("Total locations number", totalLocations);
    };
    const handleLocation = (locationName) => {
        if (!selectedLocations.includes(locationName)) {
            setSelectedLocations([...selectedLocations, locationName]);
            setSearchInput("");
        }
        setShowLocation(false); // Close the dropdown when a location is selected
    };
    const removeLocation = (locationName) => {
        setSelectedLocations(
            selectedLocations.filter((loc) => loc !== locationName)
        );
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
                        <div className="row mt-2 me-1 search-report-card" style={{ height: '100px', padding: '5px' }} >
                            <p>Select Location, Start Date and End Date to view data.</p>
                            <div className="col-lg-3 col-md-2 col-sm-12 mt-1">
                                <div
                                    ref={dropdownRef}
                                    className="search-bar"
                                    style={{
                                        border: "1px solid #000",
                                        padding: "5px",
                                        borderRadius: "5px",
                                        minHeight: "30px",
                                    }}

                                    contentEditable={true}
                                    onClick={() => setShowLocation(!showLocation)}
                                >
                                    {selectedLocations.length === 0 && !showLocation && (
                                        <span className="placeholder-text">Search Locations...</span>
                                    )}
                                    {selectedLocations.map((location, index) => (
                                        <span key={index} className="selected-location">
                                            {location}
                                            <button
                                                onClick={() => removeLocation(location)}
                                                style={{
                                                    backgroundColor: "black",
                                                    color: "white",
                                                    border: "none",
                                                    marginLeft: "5px",
                                                }}
                                            >
                                                x
                                            </button>
                                            &nbsp;
                                        </span>
                                    ))}
                                    <span style={{ minWidth: "5px", display: "inline-block" }}>
                                        &#8203;
                                    </span>
                                </div>
                                {showLocation && (
                                    <>
                                        <div className="location-card">
                                            {report &&
                                                report.map((item, index) => (
                                                    <div key={index}>
                                                        <p
                                                            onClick={() => handleLocation(item.LocationName)}
                                                        >
                                                            {item.LocationName}
                                                        </p>
                                                    </div>
                                                ))}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="col-lg-5 col-md-8 col-sm-12" style={{ marginTop: '-2px' }}>
                                <DatePicker
                                    className="date-field"
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    dateFormat="dd-MM-yyyy"  // Format date as dd-mm-yyyy
                                    placeholderText="Start Date"
                                />
                                <button
                                    className="btn ms-1 me-1"
                                    style={{
                                        height: "40px",
                                        backgroundColor: "#4BC0C0",
                                        marginBottom: "5px",
                                        borderRadius: "0px",
                                        color: 'white',
                                    }}
                                >
                                    To
                                </button>
                                <DatePicker
                                    className="date-field"
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    dateFormat="dd-MM-yyyy"  // Format date as dd-mm-yyyy
                                    placeholderText="End Date"
                                />
                            </div>

                            <div className="col-lg-4 col-md-2 col-sm-12" style={{ marginTop: '1px', marginLeft: '-15px' }}>
                                <button className='btn add-btn' onClick={handleClick}>Submit</button>
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