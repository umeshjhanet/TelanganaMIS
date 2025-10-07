import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import axios from "axios";
import { MdFileDownload } from "react-icons/md";
import { API_URL } from "./Api";

const ShortReport = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showLocation, setShowLocation] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [summary, setSummary] = useState([]);
    const [report, setReport] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [csv, setCsv] = useState(null);
    const [reportCsv, setReportCsv] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showConfirmationBox, setShowConfirmationBox] = useState(false);

    const dropdownRef = useRef(null);

    const handleExport = () => {
        setShowConfirmation(true);
    };

    const handleConfirmedExport = () => {
        // Proceed with CSV export
        if (csv) {
            const link = document.createElement("a");
            link.href = csv;
            link.setAttribute("download", "export.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        setShowConfirmation(false);
    };

    const handleCancelExport = () => {
        setShowConfirmation(false);
    };
    const locationName = selectedLocations;
    useEffect(() => {
        
        fetchData(); 
        fetchSummaryReportCsvFile(locationName, startDate, endDate);
    }, []);

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
    }, [dropdownRef]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            await fetchSummaryData();
            await fetchReportData();
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Error fetching data. Please try again.");
            setIsLoading(false);
        }
    };

    const fetchSummaryData = async () => {
        try {
            const apiUrl = `${API_URL}/summary`;
            const response = await axios.get(apiUrl);
            setSummary(response.data);
        } catch (error) {
            throw new Error("Error fetching summary data");
        }
    };

    

    const fetchSummaryReportCsvFile = (locationName, startDate, endDate) => {
        // Format the dates as ISO strings without time component
        // const formatDate = (date) => {
        //     return date.toISOString().split('T')[0];
        // };
    
        let apiUrl = `${API_URL}/summarycsv`;
    
        // Construct query parameters based on provided inputs
        const queryParams = {};
        if (locationName && locationName.length > 0) {
            queryParams.locationName = locationName.join(',');
        }
        if (startDate && endDate) {
            queryParams.startDate = formatDateSummary(new Date(startDate));
            queryParams.endDate = formatDateSummary(new Date(endDate));
        }
    
        // Construct the API URL with query parameters
        const queryString = Object.keys(queryParams).map(key => `${key}=${queryParams[key]}`).join('&');
        if (queryString) {
            apiUrl += `?${queryString}`;
        }
    
        // Make GET request to fetch CSV file
        axios.get(apiUrl, { responseType: "blob" })
            .then((response) => {
                // Create object URL for the blob
                const url = window.URL.createObjectURL(new Blob([response.data], { type: "text/csv" }));
                // Set the CSV URL
                setCsv(url);
            })
            .catch((error) => {
                console.error("Error in exporting data:", error);
            });
    };
    
    
    
    const fetchReportData = async () => {
        try {
            const apiUrl = `${API_URL}/reportTable`;
            const response = await axios.get(apiUrl);
            setReport(response.data);
        } catch (error) {
            throw new Error("Error fetching report data");
        }
    };

    const handleSearch = async () => {
        try {
            setIsLoading(true);
            await fetchFilteredData(selectedLocations, startDate, endDate);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching filtered data:", error);
            setError("Error fetching filtered data. Please try again.");
            setIsLoading(false);
        }
    };

    const fetchFilteredData = async (locationName, startDate, endDate) => {
        try {
            const queryParams = {};
            if (startDate && endDate) {
                // Format the dates to match the backend's expected format (YYYY-MM-DD)
                const formattedStartDate = formatDateSummary(startDate);
                const formattedEndDate = formatDateSummary(endDate);
                queryParams.startDate = formattedStartDate;
                queryParams.endDate = formattedEndDate;
            }
            if (locationName.length > 0) {
                queryParams.locationName = locationName.join(',');
            }
            const apiUrl = `${API_URL}/summary`;
            const response = await axios.get(apiUrl, { params: queryParams });
            setSummary(response.data);
        } catch (error) {
            throw new Error("Error fetching filtered summary data");
        }
    };

    const formatDateSummary = (date) => {
        // Format the date to YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleLocation = (locationName) => {
        if (!selectedLocations.includes(locationName)) {
            setSelectedLocations([...selectedLocations, locationName]);
        }
        setShowLocation(false); // Close the dropdown when a location is selected
    };

    const removeLocation = (locationName) => {
        setSelectedLocations(
            selectedLocations.filter((loc) => loc !== locationName)
        );
    };

    return (
        <>
            <Header />
            <div className={`container-fluid ${isLoading ? 'loading' : ''}`}>
                <div className="row">
                    <div className="col-lg-2 col-md-2 "></div>
                    <div className="col-lg-10 col-md-9 col-sm-12">
                        <div className="row mt-4 me-1">
                            <div
                                className="card"
                                style={{ padding: "5px", backgroundColor: "#4BC0C0" }}
                            >
                                <h6 className="" style={{ color: "white" }}>
                                    Dashboard / Site Wise Project Summary Report
                                </h6>
                            </div>
                        </div>
                        <div className="row mt-2 me-1 search-report-card" >
                            <div className="col-md-4 col-sm-12">
                                <div
                                    ref={dropdownRef}
                                    className="search-bar mt-1"
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
                            <div className="col-md-6 col-sm-12" >
                                <DatePicker
                                    className="date-field"
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    placeholderText="Start Date"
                                />
                                <button
                                    className="btn ms-1 me-1"
                                    style={{
                                        height: "40px",
                                        backgroundColor: "#4BC0C0",
                                        marginBottom: "5px",
                                        borderRadius: "0px",
                                    }}
                                >
                                    To
                                </button>
                                <DatePicker
                                    className="date-field"
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    placeholderText="End Date"
                                />
                            </div>
                            <div className="col-md-2 col-sm-12">
                                <button className="btn search-btn" onClick={handleSearch}>Search</button>
                            </div>
                        </div>
                        <div className="row mt-3 me-1">
                            <div
                                className="row"
                                style={{
                                    padding: "5px",
                                    backgroundColor: "#4BC0C0",
                                    paddingTop: "15px",
                                    marginLeft: "0",
                                }}
                            >
                                <div className="col-10">
                                    <h6 className="" style={{ color: "white" }}>
                                        SUMMARY REPORT
                                    </h6>
                                </div>
                                <div className="col-2">
                                    <h6 style={{ color: "white" }} onClick={handleExport}>
                                        {" "}
                                        <MdFileDownload style={{ fontSize: "20px" }} />
                                        Export CSV
                                    </h6>
                                </div>
                                {showConfirmation && (
                                    <div className="confirmation-dialog">
                                        <div className="confirmation-content">
                                            <p className="fw-bold">Are you sure you want to export the CSV file?</p>
                                            <button className="btn btn-success mt-3 ms-5" onClick={handleConfirmedExport}>Yes</button>
                                            <button className="btn btn-danger ms-3 mt-3" onClick={handleCancelExport}>No</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="main-summary-card ">
                            <div className="row">
                                {summary.map((elem, index) => (
                                    <div
                                        className="col-lg-2 col-md-4 col-sm-6"
                                        key={index}
                                    >
                                        <div className="summary-card mt-3">
                                            <div className="summary-title">
                                                <h6 style={{ textTransform: "capitalize" }}>
                                                    Collection of Records
                                                </h6>
                                            </div>
                                            <p className="text-center" style={{ fontSize: '12px', fontWeight: '500', color: 'maroon' }}>
                                                Total Files: {elem.CollectionFiles || "0"}{" "}
                                                <br />
                                                Total Images: {elem.CollectionImages || "0"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {summary.map((elem, index) => (
                                    <div
                                        className="col-lg-2 col-md-4 col-sm-6"
                                        key={index}
                                    >
                                        <div className="summary-card mt-3">
                                            <div className="summary-title">
                                                <h6 style={{ textTransform: "capitalize" }}>
                                                    Scanning ADF
                                                </h6>
                                            </div>
                                            <p className="text-center" style={{ fontSize: '12px', fontWeight: '500', color: 'maroon' }}>
                                                Total Files: {elem.ScannedFiles || "0"}{" "}
                                                <br />
                                                Total Images: {elem.ScannedImages || "0"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {summary.map((elem, index) => (
                                    <div
                                        className="col-lg-2 col-md-4 col-sm-6"
                                        key={index}
                                    >
                                        <div className="summary-card mt-3">
                                            <div className="summary-title">
                                                <h6 style={{ textTransform: "capitalize" }}>
                                                    Image QC
                                                </h6>
                                            </div>
                                            <p className="text-center" style={{ fontSize: '12px', fontWeight: '500', color: 'maroon' }}>
                                                Total Files: {elem.QCFiles || "0"}{" "}
                                                <br />
                                                Total Images: {elem.QCImages || "0"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {summary.map((elem, index) => (
                                    <div
                                        className="col-lg-2 col-md-4 col-sm-6"
                                        key={index}
                                    >
                                        <div className="summary-card mt-3">
                                            <div className="summary-title">
                                                <h6 style={{ textTransform: "capitalize" }}>
                                                    Document Classification
                                                </h6>
                                            </div>
                                            <p className="text-center" style={{ fontSize: '12px', fontWeight: '500', color: 'maroon' }}>
                                                Total Files: {elem.FlaggingFiles || "0"}{" "}
                                                <br />
                                                Total Images: {elem.FlaggingImages || "0"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {summary.map((elem, index) => (
                                    <div
                                        className="col-lg-2 col-md-4 col-sm-6"
                                        key={index}
                                    >
                                        <div className="summary-card mt-3">
                                            <div className="summary-title">
                                                <h6 style={{ textTransform: "capitalize" }}>
                                                    Indexing
                                                </h6>
                                            </div>
                                            <p className="text-center" style={{ fontSize: '12px', fontWeight: '500', color: 'maroon' }}>
                                                Total Files: {elem.IndexingFiles || "0"}{" "}
                                                <br />
                                                Total Images: {elem.IndexingImages || "0"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {summary.map((elem, index) => (
                                    <div
                                        className="col-lg-2 col-md-4 col-sm-6"
                                        key={index}
                                    >
                                        <div className="summary-card mt-3">
                                            <div className="summary-title">
                                                <h6 style={{ textTransform: "capitalize" }}>
                                                    CBSL QA
                                                </h6>
                                            </div>
                                            <p className="text-center" style={{ fontSize: '12px', fontWeight: '500', color: 'maroon' }}>
                                                Total Files: {elem.CBSL_QAFiles || "0"}{" "}
                                                <br />
                                                Total Images: {elem.CBSL_QAImages || "0"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {summary.map((elem, index) => (
                                    <div
                                        className="col-lg-2 col-md-4 col-sm-6"
                                        key={index}
                                    >
                                        <div className="summary-card mt-3">
                                            <div className="summary-title">
                                                <h6 style={{ textTransform: "capitalize" }}>
                                                    Export PDF
                                                </h6>
                                            </div>
                                            <p className="text-center" style={{ fontSize: '12px', fontWeight: '500', color: 'maroon' }}>
                                                Total Files: {elem.Export_PdfFiles || "0"}{" "}
                                                <br />
                                                Total Images: {elem.Export_PdfImages || "0"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {summary.map((elem, index) => (
                                    <div
                                        className="col-lg-2 col-md-4 col-sm-6"
                                        key={index}
                                    >
                                        <div className="summary-card mt-3">
                                            <div className="summary-title">
                                                <h6 style={{ textTransform: "capitalize" }}>
                                                    Client QA
                                                </h6>
                                            </div>
                                            <p className="text-center" style={{ fontSize: '12px', fontWeight: '500', color: 'maroon' }}>
                                                Total Files: {elem.Client_QA_AcceptedFiles || "0"}{" "}
                                                <br />
                                                Total Images: {elem.Client_QA_AcceptedImages || "0"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                               
                                    <div
                                        className="col-lg-2 col-md-4 col-sm-6"
                                        
                                    >
                                        <div className="summary-card mt-3">
                                            <div className="summary-title">
                                                <h6 style={{ textTransform: "capitalize" }}>
                                                    CSV Generation
                                                </h6>
                                            </div>
                                            <p className="text-center" style={{ fontSize: '12px', fontWeight: '500', color: 'maroon' }}>
                                                Total Files: 0
                                                <br />
                                                Total Images: 0
                                            </p>
                                        </div>
                                    </div>
                               
                                
                                    <div
                                        className="col-lg-2 col-md-4 col-sm-6"
                                        
                                    >
                                        <div className="summary-card mt-3">
                                            <div className="summary-title">
                                                <h6 style={{ textTransform: "capitalize" }}>
                                                    Inventory Out
                                                </h6>
                                            </div>
                                            <p className="text-center" style={{ fontSize: '12px', fontWeight: '500', color: 'maroon' }}>
                                                Total Files: 0
                                                <br />
                                                Total Images: 0
                                            </p>
                                        </div>
                                    </div>
                               

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ShortReport;
