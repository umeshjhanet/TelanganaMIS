import React, { useEffect, useState, useRef } from 'react'
import { API_URL } from './Api';
import Papa from 'papaparse';
import Header from './Components/Header';
import { MdFileDownload } from 'react-icons/md';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SearchBar from "./Components/SearchBar";
import SearchButton from "./Components/Button";
import BarGraph from "./Components/BarGraph";
import DonutGraph from "./Components/DonutGraph";
import { toast } from 'react-toastify';

const CustomerQAReport = ({ showSideBar }) => {
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
    // useEffect(() => {

    //     fetchReportData();
    //     // fetchData();
    // }, []);
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
            const locationNames = response.data.map(item => item.LocationName);

            setLocations(locationNames);
            setIsLoading(false);
            updateTotalLocations(locationNames);
        } catch (error) {
            console.error("Error fetching locations:", error);
            setError("Error fetching locations. Please try again.");
            setIsLoading(false);
        }
    };
    const [lastSearchTime, setLastSearchTime] = useState(null);
    const [lastSearchParams, setLastSearchParams] = useState(null);
    const handleClick = async () => {
        // fetchData(selectedLocations, startDate, endDate);
        // Validate date selection (if either start or end date is selected)
        if(selectedLocations.length==1&&startDate && endDate ){
        if (startDate || endDate) {
            if (!startDate) {
                toast.error("Please select Start Date");
                return;
            }
            if (!endDate) {
                toast.error("Please select End Date");
                return;
            }
            if (startDate > endDate) {
                toast.error("End Date cannot be before Start Date");
                return;
            }
        }

        // setIsLoading(true); // show loader

        const queryParams = {};

        const currentParams = {
            locations: selectedLocations.join(","),
            // fileType: selectedFileTypes.join(","),
            startDate: startDate ? formatDate(startDate) : null,
            endDate: endDate ? formatDate(endDate) : null
        };
        //Check if this is the same as last search
        if (lastSearchParams && JSON.stringify(lastSearchParams) === JSON.stringify(currentParams)) {
            toast.info("Same search parameters detected. Please wait before searching again.");
            return;
        }

        // Check cooldown period (5 seconds)
        const now = Date.now();



        setLastSearchTime(now);
        setLastSearchParams(currentParams);

        queryParams.locationName = selectedLocations.join(",");
        // queryParams.filetype = selectedFileTypes.join(",");

        if (startDate && endDate) {
            queryParams.startDate = formatDate(startDate);
            queryParams.endDate = formatDate(endDate);
        }



        try {
            await Promise.all([
                // summaryData(queryParams),
                fetchData(queryParams),
                fetchReportData(queryParams),
                // fetchDateReportData(queryParams),
            ]);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Error fetching data. Please try again.");
            // Reset search tracking on error
            setLastSearchTime(null);
            setLastSearchParams(null);
        } finally {
            setIsLoading(false); // hide loader
        }
    }
    };
    const Loader = () => (
        <div className="loader-overlay">
            <div className="loader"></div>
        </div>
    );
    return (
        <>
            {isLoading && <Loader />}

            <div className={`container-fluid ${isLoading ? 'blur' : ''}`}>
                <div className="row">
                    <div className={`${showSideBar ? 'col-lg-1 col-md-0' : 'col-lg-2 col-md-0'} d-none d-lg-block`}></div>
                    <div className={`${showSideBar ? 'col-lg-11 col-md-12' : 'col-lg-10 col-md-12 '} col-sm-12`}>
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

                        <div className='row mt-2 me-1 search-report-card'>
                            <p>Select Location, Start Date and End Date to view data.</p>
                            <div className="col-lg-3 col-md-2 col-sm-12 mt-1" style={{ position: "relative" }}>
                                <SearchBar
                                    items={locations}
                                    selectedItems={selectedLocations}
                                    onChange={newSelected => setSelectedLocations(newSelected)}
                                    placeholder="Search locations..."
                                    showSelectAll={false}
                                />
                            </div>
                            <div className="col-lg-4 col-md-8 col-sm-12 d-flex flex-wrap ">
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
                                        marginBottom: "3px",
                                        marginTop: "1px",
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
                            </div>


                            <div className="col-md-2"><SearchButton onClick={handleClick} Name="Search" /></div>
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
                </div >
            </div >
        </>
    )
}

export default CustomerQAReport