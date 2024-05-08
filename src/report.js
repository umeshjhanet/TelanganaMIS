import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SummaryData } from "./Components/SummaryData";
import Header from "./Components/Header";
import Footer from "./Footer";
import axios from "axios";
import { MdFileDownload } from "react-icons/md";
import { Modal } from 'react-bootstrap';
import { API_URL } from "./Api";

const Report = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showLocation, setShowLocation] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [locationName, setLocationName] = useState("");
  const [locationData, setLocationData] = useState(null);
  const [summaryLocationData, setSummaryLocationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [summary, setSummary] = useState();
  const [report, setReport] = useState();
  const [csv, setCsv] = useState(null);
  const [reportCsv, setReportCsv] = useState(null);
  const dropdownRef = useRef(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showConfirmationBox,setShowConfirmationBox]=useState(false);
  const [totalLocations, setTotalLocations] = useState(0);

  

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



  const handleReportCsv = () => {
    setShowConfirmationBox(true);
  };
  const handleReportCsvConfirmation = () => {
    if (reportCsv) {
      const link = document.createElement("a");
      link.href = reportCsv;
      link.setAttribute("download", "export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setShowConfirmationBox(false);
    setShowConfirmationBox(false);

  }

  const handleReportCancelExport = () => {
    setShowConfirmationBox(false)
  }

  // const handleReportCsv=()=>{
  //     if (reportCsv) {
  //       const link = document.createElement("a");
  //       link.href = reportCsv;
  //       link.setAttribute("download", "export.csv");
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     }
  //   //   setShowConfirmation(false);

  //   }

  useEffect(() => {
    const locationName = selectedLocations;

    const summaryData = async () => {
      try {
        setIsLoading(true);
        let apiUrl = `${API_URL}/summary`;
        const queryParams = {};
        if (startDate && endDate) {
          const formattedStartDate = startDate.toISOString().split('T')[0];
          const formattedEndDate = endDate.toISOString().split('T')[0];
          apiUrl += `?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
        }
        const response = await axios.get(apiUrl, { params: queryParams });
        setSummary(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching summary data:", error);
        setError("Error fetching summary data. Please try again.");
        setIsLoading(false);
      }
    };

    const fetchSummaryReportCsvFile = (locationName, startDate, endDate) => {
      const formattedStartDate = startDate ? new Date(startDate) : null;
      const formattedEndDate = endDate ? new Date(endDate) : null;
      const formatDate = (date) => {
        return date.toISOString().split('T')[0];
      };


      let apiUrl = `${API_URL}/summarycsv`;
      if (locationName && formattedStartDate && formattedEndDate) {
        apiUrl += `?${locationName.map(name => `locationName=${name}`).join("&")}&startDate=${formatDate(formattedStartDate)}&endDate=${formatDate(formattedEndDate)}`;
      } else if (locationName) {
        apiUrl += `?${locationName.map(name => `locationName=${name}`).join("&")}`;
      } else if (formattedStartDate && formattedEndDate) {
        apiUrl += `?startDate=${formatDate(formattedStartDate)}&endDate=${formatDate(formattedEndDate)}`;
      }

      axios.get(apiUrl, { responseType: "blob" })
        .then((response) => {
          const blob = new Blob([response.data], { type: "text/csv" });
          const url = window.URL.createObjectURL(blob);
          setCsv(url);
        })
        .catch((error) => {
          console.error("Error in exporting data:", error);
        });
    };

    const fetchSummaryReportTableCsvFile = (locationName, startDate, endDate) => {
      const formattedStartDate = startDate ? new Date(startDate) : null;
      const formattedEndDate = endDate ? new Date(endDate) : null;
      const formatDate = (date) => {
        return date.toISOString().split('T')[0];
      };


      let apiUrl = `${API_URL}/reporttablecsv`;
      if (locationName && formattedStartDate && formattedEndDate) {
        apiUrl += `?${locationName.map(name => `locationName=${name}`).join("&")}&startDate=${formatDate(formattedStartDate)}&endDate=${formatDate(formattedEndDate)}`;
      } else if (locationName) {
        apiUrl += `?${locationName.map(name => `locationName=${name}`).join("&")}`;
      } else if (formattedStartDate && formattedEndDate) {
        apiUrl += `?startDate=${formatDate(formattedStartDate)}&endDate=${formatDate(formattedEndDate)}`;
      }
      axios.get(apiUrl, { responseType: "blob" })
        .then((response) => {
          const blob = new Blob([response.data], { type: "text/csv" });
          const url = window.URL.createObjectURL(blob);
          setReportCsv(url);
        })
        .catch((error) => {
          console.error("Error in exporting data:", error);
        });
    };
    const fetchReportData = async () => {
      try {

        let apiUrl = `${API_URL}/reportTable`;
        if (startDate && endDate) {
          const formattedStartDate = startDate.toISOString().split('T')[0];
          const formattedEndDate = endDate.toISOString().split('T')[0];
          apiUrl += `?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
        }
        console.log("API URL:", apiUrl); // Log the constructed API URL
        const response = await axios.get(apiUrl);
        console.log("API Response:", response.data); // Log the API response
        setReport(response.data);
        setIsLoading(false);
        updateTotalLocations(response.data);
      } catch (error) {
        console.error("Error fetching report data:", error);
        setError("Error fetching report data. Please try again.");

      }
    };

    const fetchLocationData = async () => {
      if (selectedLocations.length > 0) {
        try {
          setIsLoading(true);
          const locationDataResponses = await Promise.all(
            selectedLocations.map((location) =>
              axios.get(
                `${API_URL}/reportLocationWiseTable?locationname=${location}`
              )
            )
          );
          const locationData = locationDataResponses.map(
            (response) => response.data
          );
          setLocationData(locationData);
          console.log("agra", locationData);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching location data:", error);
          setError("Error fetching location data. Please try again.");
          setIsLoading(false);
        }
      }
    };

    const fetchSummaryLocationData = async () => {
      if (selectedLocations.length > 0) {
        try {
          setIsLoading(true);
          const locationDataResponses = await Promise.all(
            selectedLocations.map((location) =>
              axios.get(
                `${API_URL}/summarylocationname?locationname=${location}`
              )
            )
          );
          const summaryLocationData = locationDataResponses.map(
            (response) => response.data
          );
          setSummaryLocationData(summaryLocationData);
          console.log("agra", summaryLocationData);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching location data:", error);
          setError("Error fetching location data. Please try again.");
          setIsLoading(false);
        }
      }
    };

    fetchLocationData();
    fetchSummaryReportTableCsvFile(locationName, startDate, endDate);
    fetchSummaryReportCsvFile(locationName, startDate, endDate);
    summaryData();
    fetchReportData();
    // fetchLocationData();
    fetchSummaryLocationData();

  }, [selectedLocations, endDate]);

  const updateTotalLocations = (data) => {
    const uniqueLocations = [...new Set(data.map(elem => elem.LocationName))];
    setTotalLocations(uniqueLocations.length);
  };


  return (
    <>
      <Header />
      <div className={`container-fluid ${isLoading ? 'loading' : ''}`}>
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
            <div className="row mt-2 me-1 search-report-card" >
              <div className="col-lg-4 col-md-2 col-sm-12">
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
              <div className="col-md-2"></div>
              <div className="col-lg-6 col-md-8 col-sm-12" >
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

              <div className="main-summary-card ">
                <div className="row">
                  {summary && (
                    <>
                      {selectedLocations.length === 0 ? (
                        summary.map((elem, index) => (
                          <div
                            className="col-lg-2 col-md-4 col-sm-6"
                            key={index}
                          >
                            <div className="summary-card mt-3">
                              <div className="summary-title">
                                <h6 className="mt-2" style={{ textTransform: "capitalize" }}>
                                  Collection of<br /> Records
                                </h6>
                              </div>
                              <p className="text-center" style={{ fontSize: '12px', fontWeight: '500', color: 'maroon' }}>
                                Total Files: {isNaN(parseInt(elem.CollectionFiles)) ? 0 : parseInt(elem.CollectionFiles).toLocaleString()}

                                <br />
                                Total Images: {isNaN(parseInt(elem.CollectionImages)) ? 0 : parseInt(elem.CollectionImages).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-lg-2 col-md-4 col-sm-6">
                          <div className="summary-card mt-3">
                            <div className="summary-title">
                              <h6 className="mt-2" style={{ textTransform: "capitalize" }}>
                                Collection of<br /> Records
                              </h6>
                            </div>
                            <p className="text-center" style={{ fontSize: '12px', fontWeight: '500', color: 'maroon' }}>
                              Total Files:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return (
                                  acc +
                                  (locationData
                                    ? parseInt(locationData.CollectionFiles) || 0
                                    : 0)
                                );
                              }, 0).toLocaleString()}{" "}
                              <br />
                              Total Images:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return (
                                  acc +
                                  (locationData
                                    ? parseInt(locationData.CollectionImages) || 0
                                    : 0)
                                );
                              }, 0).toLocaleString()}
                            </p>

                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {summary && (
                    <>
                      {selectedLocations.length === 0 ? (
                        summary.map((elem, index) => (
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
                                Total Files: {isNaN(parseInt(elem.ScannedFiles)) ? 0 : parseInt(elem.ScannedFiles).toLocaleString()}

                                <br />
                                Total Images: {isNaN(parseInt(elem.ScannedImages)) ? 0 : parseInt(elem.ScannedImages).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-lg-2 col-md-4 col-sm-6">
                          <div className="summary-card mt-3">
                            <div className="summary-title">
                              <h6 style={{ textTransform: "capitalize" }}>
                                Scanning ADF
                              </h6>
                            </div>
                            <p className="text-center" style={{ fontSize: '12px', fontWeight: '500', color: 'maroon' }}>
                              Total Files:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return (
                                  acc +
                                  (locationData
                                    ? parseInt(locationData.ScannedFiles) || 0
                                    : 0)
                                );
                              }, 0).toLocaleString()}{" "}
                              <br />
                              Total Images:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return (
                                  acc +
                                  (locationData
                                    ? parseInt(locationData.ScannedImages) || 0
                                    : 0)
                                );
                              }, 0).toLocaleString()}
                            </p>

                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {summary && (
                    <>
                      {selectedLocations.length === 0 ? (
                        summary.map((elem, index) => (
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
                                Total Files: {isNaN(parseInt(elem.QCFiles)) ? 0 : parseInt(elem.QCFiles).toLocaleString()}

                                <br />
                                Total Images: {isNaN(parseInt(elem.QCImages)) ? 0 : parseInt(elem.QCImages).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-lg-2 col-md-4 col-sm-6">
                          <div className="summary-card mt-3">
                            <div className="summary-title">
                              <h6 style={{ textTransform: "capitalize" }}>
                                Image QC
                              </h6>
                            </div>
                            <p className="text-center" style={{ fontSize: '12px', fontWeight: '500', color: 'maroon' }}>
                              Total Files:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return (
                                  acc +
                                  (locationData
                                    ? parseInt(locationData.QCFiles) || 0
                                    : 0)
                                );
                              }, 0).toLocaleString()}{" "}
                              <br />
                              Total Images:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return (
                                  acc +
                                  (locationData
                                    ? parseInt(locationData.QCImages) || 0
                                    : 0)
                                );
                              }, 0).toLocaleString()}
                            </p>

                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {summary && (
                    <>
                      {selectedLocations.length === 0 ? (
                        summary.map((elem, index) => (
                          <div
                            className="col-lg-2 col-md-4 col-sm-6"
                            key={index}
                          >
                            <div className="summary-card mt-3">
                              <div className="summary-title">
                                <h6 className="mt-2" style={{ textTransform: "capitalize" }}>
                                  Document <br /> Classification
                                </h6>
                              </div>
                              <p className="text-center" style={{ fontSize: '12px', fontWeight: '500', color: 'maroon' }}>
                                Total Files: {isNaN(parseInt(elem.FlaggingFiles)) ? 0 : parseInt(elem.FlaggingFiles).toLocaleString()}

                                <br />
                                Total Images: {isNaN(parseInt(elem.FlaggingImages)) ? 0 : parseInt(elem.FlaggingImages).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-lg-2 col-md-4 col-sm-6">
                          <div className="summary-card mt-3">
                            <div className="summary-title">
                              <h6 className="mt-2" style={{ textTransform: "capitalize" }}>
                                Document<br /> Classification
                              </h6>
                            </div>
                            <p className="text-center" style={{ fontSize: '12px', fontWeight: '500', color: 'maroon' }}>
                              Total Files:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return (
                                  acc +
                                  (locationData
                                    ? parseInt(locationData.FlaggingFiles) || 0
                                    : 0)
                                );
                              }, 0).toLocaleString()}{" "}
                              <br />
                              Total Images:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return (
                                  acc +
                                  (locationData
                                    ? parseInt(locationData.FlaggingImages) || 0
                                    : 0)
                                );
                              }, 0).toLocaleString()}
                            </p>

                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {summary && (
                    <>
                      {selectedLocations.length === 0 ? (
                        summary.map((elem, index) => (
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
                                Total Files: {isNaN(parseInt(elem.IndexingFiles)) ? 0 : parseInt(elem.IndexingFiles).toLocaleString()}

                                <br />
                                Total Images: {isNaN(parseInt(elem.IndexingImages)) ? 0 : parseInt(elem.IndexingImages).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-lg-2 col-md-4 col-sm-6">
                          <div className="summary-card mt-3">
                            <div className="summary-title">
                              <h6 style={{ textTransform: "capitalize" }}>
                                Indexing
                              </h6>
                            </div>
                            <p className="text-center" style={{ fontSize: '12px', fontWeight: '500', color: 'maroon' }}>
                              Total Files:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return (
                                  acc +
                                  (locationData
                                    ? parseInt(locationData.IndexingFiles) || 0
                                    : 0)
                                );
                              }, 0).toLocaleString()}{" "}
                              <br />
                              Total Images:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return (
                                  acc +
                                  (locationData
                                    ? parseInt(locationData.IndexingImages) || 0
                                    : 0)
                                );
                              }, 0).toLocaleString()}
                            </p>

                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {summary && (
                    <>
                      {selectedLocations.length === 0 ? (
                        summary.map((elem, index) => (
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
                                Total Files: {isNaN(parseInt(elem.CBSL_QAFiles)) ? 0 : parseInt(elem.CBSL_QAFiles).toLocaleString()}

                                <br />
                                Total Images: {isNaN(parseInt(elem.CBSL_QAImages)) ? 0 : parseInt(elem.CBSL_QAImages).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-lg-2 col-md-4 col-sm-6">
                          <div className="summary-card mt-3">
                            <div className="summary-title">
                              <h6 style={{ textTransform: "capitalize" }}>
                                CBSL QA
                              </h6>
                            </div>
                            <p className="text-center" style={{ fontSize: '12px', fontWeight: '500', color: 'maroon' }}>
                              Total Files:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return (
                                  acc +
                                  (locationData
                                    ? parseInt(locationData.CBSL_QAFiles) || 0
                                    : 0)
                                );
                              }, 0).toLocaleString()}{" "}
                              <br />
                              Total Images:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return (
                                  acc +
                                  (locationData
                                    ? parseInt(locationData.CBSL_QAImages) || 0
                                    : 0)
                                );
                              }, 0).toLocaleString()}
                            </p>

                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {summary && (
                    <>
                      {selectedLocations.length === 0 ? (
                        summary.map((elem, index) => (
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
                                Total Files: {isNaN(parseInt(elem.Export_PdfFiles)) ? 0 : parseInt(elem.Export_PdfFiles).toLocaleString()}

                                <br />
                                Total Images: {isNaN(parseInt(elem.Export_PdfImages)) ? 0 : parseInt(elem.Export_PdfImages).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-lg-2 col-md-4 col-sm-6">
                          <div className="summary-card mt-3">
                            <div className="summary-title">
                              <h6 style={{ textTransform: "capitalize" }}>
                                Export PDF
                              </h6>
                            </div>
                            <p className="text-center" style={{ fontSize: '12px', fontWeight: '500', color: 'maroon' }}>
                              Total Files:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return (
                                  acc +
                                  (locationData
                                    ? parseInt(locationData.Export_PdfFiles) || 0
                                    : 0)
                                );
                              }, 0).toLocaleString()}{" "}
                              <br />
                              Total Images:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return (
                                  acc +
                                  (locationData
                                    ? parseInt(locationData.Export_PdfImages) || 0
                                    : 0)
                                );
                              }, 0).toLocaleString()}
                            </p>

                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {summary && (
                    <>
                      {selectedLocations.length === 0 ? (
                        summary.map((elem, index) => (
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
                                Total Files: {isNaN(parseInt(elem.Client_QA_AcceptedFiles)) ? 0 : parseInt(elem.Client_QA_AcceptedFiles).toLocaleString()}

                                <br />
                                Total Images: {isNaN(parseInt(elem.Client_QA_AcceptedImages)) ? 0 : parseInt(elem.Client_QA_AcceptedImages).toLocaleString()}
                              </p>

                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-lg-2 col-md-4 col-sm-6">
                          <div className="summary-card mt-3">
                            <div className="summary-title">
                              <h6 style={{ textTransform: "capitalize" }}>
                                Client QA
                              </h6>
                            </div>
                            <p className="text-center" style={{ fontSize: '12px', fontWeight: '500', color: 'maroon' }}>
                              Total Files:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return (
                                  acc +
                                  (locationData
                                    ? parseInt(locationData.Client_QA_AcceptedFiles) || 0
                                    : 0)
                                );
                              }, 0).toLocaleString()}{" "}
                              <br />
                              Total Images:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return (
                                  acc +
                                  (locationData
                                    ? parseInt(locationData.Client_QA_AcceptedImages) || 0
                                    : 0)
                                );
                              }, 0).toLocaleString()}
                            </p>


                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {summary && (
                    <>
                      {selectedLocations.length === 0 ? (
                        summary.map((elem, index) => (
                          <div
                            className="col-lg-2 col-md-4 col-sm-6"
                            key={index}
                          >
                            <div className="summary-card mt-3">
                              <div className="summary-title">
                                <h6 style={{ textTransform: "capitalize" }}>
                                  CSV Generation
                                </h6>
                              </div>
                              <p className="text-center" style={{ fontSize: '12px', fontWeight: '500', color: 'maroon' }}>
                                Total Files: 0 <br />
                                Total Images:0
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-lg-2 col-md-4 col-sm-6">
                          <div className="summary-card mt-3">
                            <div className="summary-title">
                              <h6 style={{ textTransform: "capitalize" }}>
                                CSV Generation
                              </h6>
                            </div>
                            <p className="text-center" style={{ fontSize: '12px', fontWeight: '500', color: 'maroon' }}>
                              Total Files:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find(
                                  (elem) => elem.LocationName === location
                                );
                                return (
                                  acc +
                                  (locationData
                                    ? parseInt(0) || 0
                                    : 0)
                                );
                              }, 0)}{" "}
                              <br />
                              Total Images:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find(
                                  (elem) => elem.LocationName === location
                                );
                                return (
                                  acc +
                                  (locationData
                                    ? parseInt(0) || 0
                                    : 0)
                                );
                              }, 0)}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {summary && (
                    <>
                      {selectedLocations.length === 0 ? (
                        summary.map((elem, index) => (
                          <div
                            className="col-lg-2 col-md-4 col-sm-6"
                            key={index}
                          >
                            <div className="summary-card mt-3">
                              <div className="summary-title">
                                <h6 style={{ textTransform: "capitalize" }}>
                                  Inventory Out
                                </h6>
                              </div>
                              <p className="text-center" style={{ fontSize: '12px', fontWeight: '500', color: 'maroon' }}>
                                Total Files: 0 <br />
                                Total Images:0
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-lg-2 col-md-4 col-sm-6">
                          <div className="summary-card mt-3">
                            <div className="summary-title">
                              <h6 style={{ textTransform: "capitalize" }}>
                                Inventory Out
                              </h6>
                            </div>
                            <p className="text-center" style={{ fontSize: '12px', fontWeight: '500', color: 'maroon' }}>
                              Total Files:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find(
                                  (elem) => elem.LocationName === location
                                );
                                return (
                                  acc +
                                  (locationData
                                    ? parseInt(0) || 0
                                    : 0)
                                );
                              }, 0)}{" "}
                              <br />
                              Total Images:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find(
                                  (elem) => elem.LocationName === location
                                );
                                return (
                                  acc +
                                  (locationData
                                    ? parseInt(0) || 0
                                    : 0)
                                );
                              }, 0)}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="row mt-3 me-1">
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
                      LOCATION WISE DETAILED CUMULATIVE REPORT
                    </h6>
                  </div>
                  <div className="col-2">
                    <h6 style={{ color: "white" }} onClick={handleReportCsv}>
                      {" "}
                      <MdFileDownload style={{ fontSize: "20px" }} />
                      Export CSV
                    </h6>
                  </div>
                  {showConfirmationBox && (
                    <div className="confirmation-dialog">
                      <div className="confirmation-content">
                        <p className="fw-bold">Are you sure you want to export the CSV file?</p>
                        <button className="btn btn-success mt-3 ms-5" onClick={handleReportCsvConfirmation}>Yes</button>
                        <button className="btn btn-danger ms-3 mt-3" onClick={handleReportCancelExport}>No</button>
                      </div>
                    </div>
                  )}
                </div>
                <div
                  className="row mt-3 ms-2 me-2"
                  style={{ overflowX: "auto" }}
                >
                  <h5 className="mt-1 mb-2">Total Locations: {totalLocations}</h5>
                  <table class="table table-hover table-bordered table-responsive table-striped data-table">
                    <thead
                      style={{ color: "black", backgroundColor: "#ccd2d4", fontWeight: '300' }}
                    >
                      <tr>
                        <th rowspan="2">Location</th>
                        <th colspan="2">Collection of Records</th>
                        <th colspan="2">Scanning ADF</th>
                        <th colspan="2">Image QC</th>
                        <th colspan="2">Document Classification</th>
                        <th colSpan="2">Indexing</th>
                        <th colSpan="2">CBSL QA</th>
                        <th colSpan="2">Export PDF</th>
                        <th colSpan="2">Client QA</th>
                        <th colSpan="2">CSV Generation</th>
                        <th colSpan="2">Inventory Out</th>
                      </tr>
                      <tr
                        style={{ color: "black", backgroundColor: "#ccd2d4", fontWeight: '300' }}
                      >
                        <th>Files</th>
                        <th>Images</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>Files</th>
                        <th>Images</th>
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
                    <tbody
                      className="scrollable"
                      style={{ color: "black", height: "200px" }}
                    >
                      {report &&
                        report.map((elem, index) => {
                          if (
                            selectedLocations.length === 0 ||
                            selectedLocations.includes(elem.LocationName)
                          ) {
                            return (
                              <tr key={index} style={{ backgroundColor: "white" }}>
                                <td>{elem.LocationName}</td>
                                <td>{isNaN(parseInt(elem.CollectionFiles)) ? "0" : parseInt(elem.CollectionFiles).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.CollectionImages)) ? "0" : parseInt(elem.CollectionImages).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.ScannedFiles)) ? "0" : parseInt(elem.ScannedFiles).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.ScannedImages)) ? "0" : parseInt(elem.ScannedImages).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.QCFiles)) ? "0" : parseInt(elem.QCFiles).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.QCImages)) ? "0" : parseInt(elem.QCImages).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.FlaggingFiles)) ? "0" : parseInt(elem.FlaggingFiles).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.FlaggingImages)) ? "0" : parseInt(elem.FlaggingImages).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.IndexingFiles)) ? "0" : parseInt(elem.IndexingFiles).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.IndexingImages)) ? "0" : parseInt(elem.IndexingImages).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.CBSL_QAFiles)) ? "0" : parseInt(elem.CBSL_QAFiles).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.CBSL_QAImages)) ? "0" : parseInt(elem.CBSL_QAImages).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.Export_PdfFiles)) ? "0" : parseInt(elem.Export_PdfFiles).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.Export_PdfImages)) ? "0" : parseInt(elem.Export_PdfImages).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.Client_QA_AcceptedFiles)) ? "0" : parseInt(elem.Client_QA_AcceptedFiles).toLocaleString()}</td>
                                <td>{isNaN(parseInt(elem.Client_QA_AcceptedImages)) ? "0" : parseInt(elem.Client_QA_AcceptedImages).toLocaleString()}</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
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
        </div>
      </div>
      <Footer />

    </>
  );
};

export default Report;
