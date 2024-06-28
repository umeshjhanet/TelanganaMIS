import React, { useEffect, useState, useRef } from "react";
import { CCard, CCardBody, CCol, CCardHeader, CRow } from "@coreui/react";
import {
  CChartBar,
  CChartDoughnut,
  CChartLine,
  CChartPie,
  CChartPolarArea,
  CChartRadar,
} from "@coreui/react-chartjs";
import Header from "./Components/Header";
import axios, { all } from "axios";
import "./App.css";
import Footer from "./Footer";
import { BarChart } from "@mui/x-charts/BarChart";
import { format, sub } from "date-fns";
import { MdFileDownload } from "react-icons/md";
import DistrictHeadDashboard from "./DistrictHeadDashboard";
import { API_URL } from "./Api";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [data2, setData2] = useState();
  const currentDate = new Date();
  const yesterdayDate = sub(currentDate, { days: 1 });
  const previousDate = sub(currentDate, { days: 2 });
  const formattedCurrentDate = format(currentDate, "dd-MM-yyyy");
  const formattedYesterdayDate = format(yesterdayDate, "dd-MM-yyyy");
  const formattedPreviousDate = format(previousDate, "dd-MM-yyyy");
  const [tableData, setTableData] = useState([]);
  const [csv, setCsv] = useState(null);
  const [locationWiseCsv, setLocationWiseCsv] = useState();
  const dropdownRef = useRef(null);
  const [showLocation, setShowLocation] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [locations, setLocations] = useState();
  const [searchInput, setSearchInput] = useState("");
  const [locationData, setLocationData] = useState(null);
  const [locationGraphData, setLocationGraphData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [districtUser, setDistrictUser] = useState();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const userLog = JSON.parse(localStorage.getItem("user"));
  console.log("User's Info", userLog);

  const [barFile, setBarFile] = useState({
    labels: [],
    datasets: [
      {
        label: "No. of Files",
        backgroundColor: " #ad33ff",
        data: [],
      },
    ],
  });
  const [barImage, setBarImage] = useState({
    labels: [],
    datasets: [
      {
        label: "No. of Images",
        backgroundColor: "#ad33ff",
        data: [],
      },
    ],
  });
  const [todayFile, setTodayFile] = useState({
    labels: [],
    datasets: [
      {
        label: "No. of Files",
        backgroundColor: "#ff4dff",
        data: [],
      },
    ],
  });
  const [todayImage, setTodayImage] = useState({
    labels: [],
    datasets: [
      {
        label: "No. of Images",
        backgroundColor: "#ff4dff",
        data: [],
      },
    ],
  });
  const [weekFile, setWeekFile] = useState({
    labels: [],
    datasets: [
      {
        label: "No. of Files",
        backgroundColor: [
          "#ad33ff",
          "#ff5733",
          "#FC819E",
          "#3357ff",
          "#ff33ad",
          "#D37676",
          "#33adff",
        ],
        data: [],
      },
    ],
  });

  const [weekImage, setWeekImage] = useState({
    labels: [],
    datasets: [
      {
        label: "No. of Images",
        backgroundColor: "#ad33ff",
        data: [],
      },
    ],
  });
  const [monthImage, setMonthImage] = useState({
    labels: [],
    datasets: [
      {
        label: "No. of Images",
        backgroundColor: "#02B2AF",
        data: [],
      },
    ],
  });
  const [civilCase, setCivilCase] = useState({
    labels: [],
    datasets: [
      {
        label: "No. of Civil cases",
        backgroundColor: "#f87979",
        data: [],
      },
    ],
  });
  const [criminalCase, setCriminalCase] = useState({
    labels: [],
    datasets: [
      {
        label: "No. of Criminal cases",
        backgroundColor: "#f87979",
        data: [],
      },
    ],
  });
  const [allLocationYesImage, setAllLocationYesImage] = useState({
    labels: [],
    datasets: [
      {
        label: "No. of Images",
        backgroundColor: "#66b3ff",
        data: [],
      },
    ],
  });
  const [allLocationImage, setAllLocationImage] = useState({
    labels: [],
    datasets: [
      {
        label: "No. of Images",
        backgroundColor: "#f87979",
        data: [],
      },
    ],
  });
  const [scannedData, setScannedData] = useState(null);
  const [locationReportData, setLocationReportData] = useState({
    labels: [],
    datasets: [
      {
        label: "Scanning",
        backgroundColor: "#02B2AF",
        data: [],
      },
    ],
  });


  const random = () => Math.round(Math.random() * 100);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLocation(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLocation = (locationName) => {
    if (!selectedLocations.includes(locationName)) {
      setSelectedLocations([...selectedLocations, locationName]);

      setSearchInput("");
    }
    // setShowLocation(false); // Close the dropdown when a location is selected
  };

  const removeLocation = (locationName) => {
    setSelectedLocations(
      selectedLocations.filter((loc) => loc !== locationName)
    );
  };

  // const handleExport = () => {
  //   if (csv) {
  //     const link = document.createElement("a");
  //     link.href = csv;
  //     link.setAttribute("download", "export.csv");
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }
  // };

  const handleExport = () => {
    setShowConfirmation(true);
  };

  const handleConfirmedExport = () => {
    // Proceed with CSV export
    if (csv) {
      const link = document.createElement("a");
      link.href = csv;
      link.setAttribute("download", "AllLocationScannedReport.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setShowConfirmation(false);
  };

  const handleCancelExport = () => {
    setShowConfirmation(false);
  };

  const calculateColumnSum = () => {
    let prevFilesSum = 0;
    let prevImagesSum = 0;
    let yesFilesSum = 0;
    let yesImagesSum = 0;
    let todayFilesSum = 0;
    let todayImagesSum = 0;
    let totalFilesSum = 0;
    let totalImagesSum = 0;

    tableData.forEach((elem) => {
      if (
        selectedLocations.length === 0 ||
        selectedLocations.includes(elem.LocationName)
      ) {
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

    return {
      prevFilesSum,
      prevImagesSum,
      yesFilesSum,
      yesImagesSum,
      todayFilesSum,
      todayImagesSum,
      totalFilesSum,
      totalImagesSum,
    };
  };

  useEffect(() => {
    const fetchLocationData = async () => {
      if (selectedLocations.length > 0) {
        try {
          setIsLoading(true);
          const locationDataResponses = await Promise.all(
            selectedLocations.map((location) =>
              axios.get(
                `${API_URL}/api/locationwisetabularData?locationName=?`
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
    const locationName = selectedLocations;

    const fetchGraphFileData = (selectedLocations) => {
      let apiUrl = `${API_URL}/graph1LocationWise`;

      if (selectedLocations && selectedLocations.length > 0) {
        const locationQuery = selectedLocations
          .map((location) => `locationname=${encodeURIComponent(location)}`)
          .join("&");
        apiUrl += `?${locationQuery}`;
      }

      axios
        .get(apiUrl)
        .then((response) => {
          const apiData = response.data;
          if (!apiData || apiData.length === 0) {
            console.error("No data received from the API");
            return;
          }

          const labels = Object.keys(apiData[0]).filter(
            (label) => label !== "locationid" && label !== "LocationName"
          );
          const datasets = apiData.map((locationData) => {
            return {
              label: "No. of Files", // Use location name as label for each dataset
              data: labels.map((label) => locationData[label]),
              backgroundColor: "#ad33ff", // Change the background color here
            };
          });

          setBarFile({
            labels: labels,
            datasets: datasets,
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    const fetchExportCsvFile = () => {
      // Construct the API URL with multiple location names
      const apiUrl = locationName
        ? `${API_URL}/csv?${locationName
          .map((name) => `locationName=${name}`)
          .join("&")}`
        : `${API_URL}/csv`;

      axios
        .get(apiUrl, { responseType: "blob" })
        .then((response) => {
          const blob = new Blob([response.data], { type: "text/csv" });
          const url = window.URL.createObjectURL(blob);
          setCsv(url);
          console.log("CSV");
        })
        .catch((error) => {
          console.error("Error in exporting data:", error);
        });
    };

    const fetchGraphImageData = (selectedLocations) => {
      let apiUrl = `${API_URL}/graph2`;

      if (selectedLocations && selectedLocations.length > 0) {
        const locationQuery = selectedLocations
          .map((location) => `locationname=${encodeURIComponent(location)}`)
          .join("&");
        apiUrl += `?${locationQuery}`;
      }

      axios
        .get(apiUrl)
        .then((response) => {
          const apiData = response.data;
          if (!apiData || apiData.length === 0) {
            console.error("No data received from the API");
            return;
          }
          console.log("Api Data", apiData);
          const labels = Object.keys(apiData[0]).filter(
            (label) => label !== "locationid" && label !== "LocationName"
          );
          const datasets = apiData.map((locationData) => {
            return {
              label: "No. of Images",
              data: labels.map((label) => locationData[label]),
              backgroundColor: "#ad33ff", // Change the background color here
            };
          });
          setBarImage({
            labels: labels,
            datasets: datasets,
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };
    const fetchTodayGraphFileData = () => {
      let apiUrl = `${API_URL}/graph7`;

      if (selectedLocations && selectedLocations.length > 0) {
        const locationQuery = selectedLocations
          .map((location) => `locationname=${encodeURIComponent(location)}`)
          .join("&");
        apiUrl += `?${locationQuery}`;
      }

      axios
        .get(apiUrl)
        .then((response) => {
          const apiData = response.data;
          if (!apiData || apiData.length === 0) {
            console.error("No data received from the API");
            return;
          }

          const labels = Object.keys(apiData[0]).filter(
            (label) => label !== "locationid" && label !== "LocationName"
          );
          const datasets = apiData.map((locationData) => {
            return {
              label: "No. of Files",
              data: labels.map((label) => locationData[label]),
              backgroundColor: "#ad33ff", // Change the background color here
            };
          });

          setTodayFile({
            labels: labels,
            datasets: datasets,
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    const fetchTodayGraphImageData = () => {
      let apiUrl = `${API_URL}/graph8`;

      if (selectedLocations && selectedLocations.length > 0) {
        const locationQuery = selectedLocations
          .map((location) => `locationname=${encodeURIComponent(location)}`)
          .join("&");
        apiUrl += `?${locationQuery}`;
      }

      axios
        .get(apiUrl)
        .then((response) => {
          const apiData = response.data;
          if (!apiData || apiData.length === 0) {
            console.error("No data received from the API");
            return;
          }

          const labels = Object.keys(apiData[0]).filter(
            (label) => label !== "locationid" && label !== "LocationName"
          );
          const datasets = apiData.map((locationData) => {
            return {
              label: "No. of Images",
              data: labels.map((label) => locationData[label]),
              backgroundColor: "#ad33ff", // Change the background color here
            };
          });

          setTodayImage({
            labels: labels,
            datasets: datasets,
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    const fetchWeekFileGraphData = () => {
      const params = {
        params: {
          locationNames: selectedLocations, // Assuming selectedLocations is an array of location names
        },
      };
      axios
        .get(`${API_URL}/graph5`, params)
        .then((response) => {
          const apiData = response.data;
          const labels = apiData.map((item) => item["scandate"]);
          const data = apiData.map((item) => item["scannedfiles"]);
          console.log("weekly labels", labels);
          console.log("weekly data", data);
          setWeekFile({
            labels: labels,
            datasets: [
              {
                label: "Scanned Files",
                data: data,
                backgroundColor: [
                  "#ad33ff",
                  "#ff5733",
                  "#FC819E",
                  "#3357ff",
                  "#ff33ad",
                  "#D37676",
                  "#33adff",
                ],
              },
            ],
          });
          console.log("weekly data fetch", weekFile);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    const fetchWeekImageGraphData = () => {
      const params = {
        params: {
          locationNames: selectedLocations, // Assuming selectedLocations is an array of location names
        },
      };
      axios
        .get(`${API_URL}/graph6`, params)
        .then((response) => {
          const apiData = response.data;
          const labels = apiData.map((item) => item["scandate"]);
          const data = apiData.map((item) => item["scannedimages"]);
          console.log("weekly labels", labels);
          console.log("weekly data", data);
          setWeekImage({
            labels: labels,
            datasets: [
              {
                label: "Scanned Images",
                data: data,
                backgroundColor: [
                  "#ad33ff",
                  "#ff5733",
                  "#FC819E",
                  "#3357ff",
                  "#ff33ad",
                  "#D37676",
                  "#33adff",
                ],
              },
            ],
          });
          console.log("weekly data fetch", weekImage);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    const fetchMonthImageGraphData = () => {
      const params = {
        params: {
          locationNames: selectedLocations, // Assuming selectedLocations is an array of location names
        },
      };
      axios
        .get(`${API_URL}/graphmonth`, params)
        .then((response) => {
          const apiData = response.data;
          const labels = apiData.map((item) => item["scandate"]);
          const data = apiData.map((item) => item["Scanned No Of Images"]);
          console.log("lables", labels);
          console.log("images", data);
          setMonthImage({
            labels: labels.filter((label) => label !== "id"),
            datasets: [
              {
                ...monthImage.datasets[0],
                data: data,
              },
            ],
          });
          console.log("Monthly  data fetch", monthImage);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    const fetchCivilCaseGraphData = () => {
      let apiUrl = `${API_URL}/civil`;

      if (selectedLocations && selectedLocations.length > 0) {
        const locationQuery = selectedLocations
          .map((location) => `locationname=${encodeURIComponent(location)}`)
          .join("&");
        apiUrl += `?${locationQuery}`;
      }

      axios
        .get(apiUrl)
        .then((response) => {
          const apiData = response.data;
          console.log("Civil case", apiData);
          if (!apiData || apiData.length === 0) {
            console.error("No data received from the API");
            return;
          }

          const labels = Object.keys(apiData[0]);
          const data = Object.values(apiData[0]);
          console.log("Labels:", labels);
          console.log("Data:", data);
          setCivilCase({
            labels: labels.filter((label) => label !== "id"),
            datasets: [
              {
                ...civilCase.datasets[0],
                data: data,
              },
            ],
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    const fetchCriminalCaseGraphData = () => {
      let apiUrl = `${API_URL}/criminal`;

      if (selectedLocations && selectedLocations.length > 0) {
        const locationQuery = selectedLocations
          .map((location) => `locationname=${encodeURIComponent(location)}`)
          .join("&");
        apiUrl += `?${locationQuery}`;
      }

      axios
        .get(apiUrl)
        .then((response) => {
          const apiData = response.data;
          console.log("Civil case", apiData);
          if (!apiData || apiData.length === 0) {
            console.error("No data received from the API");
            return;
          }

          const labels = Object.keys(apiData[0]);
          const data = Object.values(apiData[0]);
          console.log("Labels:", labels);
          console.log("Data:", data);
          setCriminalCase({
            labels: labels.filter((label) => label !== "id"),
            datasets: [
              {
                ...criminalCase.datasets[0],
                data: data,
              },
            ],
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };
    const fetchAllYesGraphImageData = (selectedLocations) => {
      let apiUrl = `${API_URL}/graph9`;

      if (selectedLocations && selectedLocations.length > 0) {
        const locationQuery = selectedLocations
          .map((location) => `locationname=${encodeURIComponent(location)}`)
          .join("&");
        apiUrl += `?${locationQuery}`;
      }

      axios
        .get(apiUrl)
        .then((response) => {
          const apiData = response.data;
          if (!apiData || apiData.length === 0) {
            console.error("No data received from the API");
            return;
          }

          const labels = apiData.map((item) => item["Location Name"]);
          const data = apiData.map((item) => item["Images"]);

          console.log("TodayLabels:", labels);
          console.log("TodayData:", data);

          setAllLocationYesImage({
            labels: labels,
            datasets: [
              {
                label: "No. of Images",
                data: data,
                backgroundColor: "#02B2AF", // Set the background color
              },
            ],
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    const fetchAllGraphImageData = (selectedLocations) => {
      let apiUrl = `${API_URL}/graph10`;

      if (selectedLocations && selectedLocations.length > 0) {
        const locationQuery = selectedLocations
          .map((location) => `locationname=${encodeURIComponent(location)}`)
          .join("&");
        apiUrl += `?${locationQuery}`;
      }

      axios
        .get(apiUrl)
        .then((response) => {
          const apiData = response.data;
          if (!apiData || apiData.length === 0) {
            console.error("No data received from the API");
            return;
          }
          const labels = apiData.map((item) => item["Location Name"]);
          const data = apiData.map((item) => item["Images"]);
          console.log("TodayLabels:", labels);
          console.log("TodayData:", data);
          setAllLocationImage({
            labels: labels,
            datasets: [
              {
                label: "No. of Images",
                data: data,
                backgroundColor: "#02B2AF",
              },
            ],
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    const fetchTableData = () => {
      axios
        .get(`${API_URL}/tabularData`)
        .then((response) => {
          setTableData(response.data);
          console.log("Table Data", response.data); // Log inside the then block
        })
        .catch((error) => console.error(error));
    };

    fetchGraphFileData(locationName);
    fetchGraphImageData(locationName);
    fetchWeekFileGraphData(locationName);
    fetchWeekImageGraphData(locationName);
    fetchMonthImageGraphData(locationName);
    fetchTodayGraphFileData(locationName);
    fetchTodayGraphImageData(locationName);
    fetchCivilCaseGraphData(locationName);
    fetchCriminalCaseGraphData(locationName);
    fetchAllYesGraphImageData(locationName);
    fetchAllGraphImageData(locationName);
    fetchTableData();
    fetchExportCsvFile();

  }, [selectedLocations]);

  const columnSums = calculateColumnSum();

  if (!userLog) {
    navigate('/');
  }


  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2 col-md-0 "></div>
          <div className="col-lg-10 col-md-12">
            <div className="row mt-2">
              <div
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <h4> Telangana Dashboard Welcomes You</h4>
                <p
                  style={{
                    fontSize: "12px",
                    color: 'maroon',
                    textAlign: "right",
                  }}
                >
                  Last Active Login:{" "}
                  {userLog ? userLog.last_active_login : "Guest"}
                </p>
              </div>
            </div>
            <div className="row  mt-2  search-report-card">
              <div className="col-md-4 col-sm-12">
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
                      {tableData &&
                        tableData.map((item, index) => (
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



              <div className="col-md-6"></div>
            </div>
            <div className="row mt-2">
              <div className="card">
                <h4 className="ms-1">SCANNING REPORT OF LAST 30 DAYS</h4>
                <h5 className="ms-1">All Location: Images</h5>
                <CCard>
                  <CCardBody>
                    <CChartBar data={monthImage} labels="months" />
                  </CCardBody>
                </CCard>
                <div>
                  {scannedData && (
                    <BarChart
                      className="scanned-chart"
                      xAxis={scannedData.xAxis}
                      series={scannedData.series}
                      width={scannedData.width}
                      height={scannedData.height}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="row mt-2">
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
                    <h6 className="text-center" style={{ color: "white" }}>
                      PROJECT UPDATE OF SCANNING AND DIGITIZATION OF CASE
                      RECORDS FOR DISTRICT COURT OF TELANGANA
                    </h6>
                  </div>
                  <div className="col-2">
                    <h6 style={{ color: "white" ,cursor:"pointer" }} onClick={handleExport}>
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
                <div
                  className="row mt-5 ms-2 me-2"
                  style={{ overflowX: "auto" }}
                >
                  <table class="table table-hover table-bordered table-responsive data-table">
                    <thead style={{ color: "#4BC0C0" }}>
                      <tr>
                        <th rowspan="2">Sr. No.</th>
                        <th rowspan="2">Location</th>
                        <th colspan="2">Scanned ({formattedPreviousDate})</th>
                        <th colspan="2">
                          Scanned ({formattedYesterdayDate})
                        </th>
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

                    <tbody style={{ color: "gray" }}>
  {tableData &&
    tableData.map((elem, index) => {
      if (
        selectedLocations.length === 0 ||
        selectedLocations.includes(elem.LocationName)
      ) {
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{elem.LocationName}</td>
            <td>{isNaN(parseInt(elem.Prev_Files)) ? 0 : parseInt(elem.Prev_Files).toLocaleString()}</td>
            <td>{isNaN(parseInt(elem.Prev_Images)) ? 0 : parseInt(elem.Prev_Images).toLocaleString()}</td>
            <td>{isNaN(parseInt(elem.Yes_Files)) ? 0 : parseInt(elem.Yes_Files).toLocaleString()}</td>
            <td>{isNaN(parseInt(elem.Yes_Images)) ? 0 : parseInt(elem.Yes_Images).toLocaleString()}</td>
            <td>{isNaN(parseInt(elem.Today_Files)) ? 0 : parseInt(elem.Today_Files).toLocaleString()}</td>
            <td>{isNaN(parseInt(elem.Today_Images)) ? 0 : parseInt(elem.Today_Images).toLocaleString()}</td>
            <td>{isNaN(parseInt(elem.Total_Files)) ? 0 : parseInt(elem.Total_Files).toLocaleString()}</td>
            <td>{isNaN(parseInt(elem.Total_Images)) ? 0 : parseInt(elem.Total_Images).toLocaleString()}</td>
            <td></td>
          </tr>
        );
      }
      return null;
    })}

  <tr style={{ color: "black" }}>
    <td colspan="2">
      <strong>Total</strong>
    </td>

    <td>
      <strong>{isNaN(parseInt(columnSums.prevFilesSum)) ? 0 : parseInt(columnSums.prevFilesSum).toLocaleString()}</strong>
    </td>
    <td>
      <strong>{isNaN(parseInt(columnSums.prevImagesSum)) ? 0 : parseInt(columnSums.prevImagesSum).toLocaleString()}</strong>
    </td>
    <td>
      <strong>{isNaN(parseInt(columnSums.yesFilesSum)) ? 0 : parseInt(columnSums.yesFilesSum).toLocaleString()}</strong>
    </td>
    <td>
      <strong>{isNaN(parseInt(columnSums.yesImagesSum)) ? 0 : parseInt(columnSums.yesImagesSum).toLocaleString()}</strong>
    </td>
    <td>
      <strong>{isNaN(parseInt(columnSums.todayFilesSum)) ? 0 : parseInt(columnSums.todayFilesSum).toLocaleString()}</strong>
    </td>
    <td>
      <strong>{isNaN(parseInt(columnSums.todayImagesSum)) ? 0 : parseInt(columnSums.todayImagesSum).toLocaleString()}</strong>
    </td>
    <td>
      <strong>{isNaN(parseInt(columnSums.totalFilesSum)) ? 0 : parseInt(columnSums.totalFilesSum).toLocaleString()}</strong>
    </td>
    <td>
      <strong>{isNaN(parseInt(columnSums.totalImagesSum)) ? 0 : parseInt(columnSums.totalImagesSum).toLocaleString()}</strong>
    </td>
    <td></td>
  </tr>
</tbody>

                  </table>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 col-sm-12">
                <CCard
                  className="mb-4"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <h4 className="ms-1">Cumulative Report</h4>
                  <h5 className="ms-1">All Location: Files</h5>
                  <CCardBody>
                    <CChartBar data={barFile} labels="months" />
                  </CCardBody>
                </CCard>
              </div>
              <div className="col-md-6 col-sm-12">
                <CCard
                  className="mb-4"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <h4 className="ms-1">Cumulative Report</h4>
                  <h5 className="ms-1">All Location: Images</h5>
                  <CCardBody>
                    <CChartBar data={barImage} labels="months" />
                  </CCardBody>
                </CCard>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <CCard
                  className="mb-4"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <h4 className="ms-1">Case Type Report</h4>
                  <h5 className="ms-1">Civil Cases</h5>
                  <CCardBody>
                    <CChartBar data={civilCase} labels="months" />
                  </CCardBody>
                </CCard>
              </div>
              <div className="col-md-6 col-sm-12">
                <CCard
                  className="mb-4"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <h4 className="ms-1">Case Type Report</h4>
                  <h5 className="ms-1">Criminal Cases</h5>
                  <CCardBody>
                    <CChartBar data={criminalCase} labels="months" />
                  </CCardBody>
                </CCard>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <CCard
                  className="mb-4"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <h4 className="ms-1">
                    PRODUCTION REPORT FOR ({formattedYesterdayDate})
                  </h4>
                  <h5 className="ms-1">All Location: Files</h5>
                  <CCardBody>
                    <CChartBar data={todayFile} labels="months" />
                  </CCardBody>
                </CCard>
              </div>
              <div className="col-md-6 col-sm-12">
                <CCard
                  className="mb-4"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <h4 className="ms-1">
                    PRODUCTION REPORT FOR ({formattedYesterdayDate})
                  </h4>
                  <h5 className="ms-1">All Location: Images</h5>
                  <CCardBody>
                    <CChartBar data={todayImage} labels="months" />
                  </CCardBody>
                </CCard>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <CCard
                  className="mb-4"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <h4 className="ms-1">Weekly Report</h4>
                  <h5 className="ms-1">All Location: Files</h5>
                  <CCardBody>
                    <CChartDoughnut data={weekFile} labels="months" />
                  </CCardBody>
                </CCard>
              </div>
              <div className="col-md-6 col-sm-12">
                <CCard
                  className="mb-4"
                  style={{ marginLeft: "0px", marginRight: "0px" }}
                >
                  <h4 className="ms-1">Weekly Report</h4>
                  <h5 className="ms-1">All Location: Images</h5>
                  <CCardBody>
                    <CChartDoughnut data={weekImage} labels="months" />
                  </CCardBody>
                </CCard>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 col-sm-12">
                <CCard>
                  <h4 className="ms-1">
                    SCANNED REPORT FOR ({formattedYesterdayDate})
                  </h4>
                  <h5 className="ms-1">All Location: Images</h5>
                  <CCardBody>
                    <CChartBar
                      data={allLocationYesImage}
                      labels="months"
                    ></CChartBar>
                  </CCardBody>
                </CCard>
              </div>
              <div className="col-md-6 col-sm-12">
                <CCard>
                  <h4 className="ms-1">CUMULATIVE SCANNED TILL DATE</h4>
                  <h5 className="ms-1">All Location: Images</h5>
                  <CCardBody>
                    <CChartBar
                      data={allLocationImage}
                      labels="months"
                    ></CChartBar>
                  </CCardBody>
                </CCard>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};





export default Dashboard;
