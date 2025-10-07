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
import Chart from "react-apexcharts";
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import Header from "./Components/Header";
import axios, { all } from "axios";
import "./App.css";
import Footer from "./Components/Footer";
import { BarChart } from "@mui/x-charts/BarChart";
import { format, sub } from "date-fns";
import { MdFileDownload } from "react-icons/md";
import { API_URL } from "./Api";
import { Navigate } from "react-router-dom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import { FaChevronDown } from "react-icons/fa";

const DistrictHeadDashboard = () => {
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
  //const [filteredLocations, setFilteredLocations] = useState([]);
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
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  const [exportTableFormat, setExportTableFormat] = useState("csv");
  const userLog = JSON.parse(localStorage.getItem("user"));

  const [locationSearchInput, setLocationSearchInput] = useState("");


  const screenWidth = window.innerWidth;


  // Add these state variables

  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Filtered locations based on search input
  // const filteredLocations = locations?.filter(item =>
  //   item.Location.toLowerCase().includes(locationSearchInput.toLowerCase())
  // ) || [];
  const filteredLocations =
    locations?.filter(
      (locationName) =>
        locationName &&
        locationName.toLowerCase().includes(locationSearchInput.toLowerCase())
    ) || [];



  const dropdownMenuRef = useRef(null); // Add this ref for the dropdown menu

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
          setShowLocation(false);
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

  // Update your handleLocation function
  const handleLocation = (locationName) => {
    if (!selectedLocations.includes(locationName)) {
      setSelectedLocations([...selectedLocations, locationName]);
      setShowLocation(false);
    }
    setLocationSearchInput("");
    setShowLocation(false);
    setHighlightedIndex(-1);
  };
  const removeLocation = (locationToRemove) => {
    setSelectedLocations(selectedLocations.filter(location => location !== locationToRemove));
  };


  const [monthImage, setMonthImage] = useState({
    labels: [],
    datasets: [
      {
        label: "Images",
        backgroundColor: "#02B2AF",
        data: [],
      },
    ],
  });
  const [allLocationImage, setAllLocationImage] = useState({
    labels: [],
    datasets: [
      {
        label: "Images",
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

  // const handleLocation = (location) => {
  //   if (!selectedLocations.includes(location)) {
  //     setSelectedLocations([...selectedLocations, location]);
  //   }
  //   setSearchInput('');
  //   setFilteredLocations(locations);
  //   setShowLocation(false);
  // };

  // const removeLocation = (location) => {
  //   setSelectedLocations(selectedLocations.filter((loc) => loc !== location));
  // };
  // const handleLocation = (location) => {
  //   if (!selectedLocations.includes(location)) {
  //     setSelectedLocations([...selectedLocations, location]);
  //   }
  //   setLocationSearchInput("");
  //   setShowLocation(false);
  // };

  // const removeLocation = (locationToRemove) => {
  //   setSelectedLocations(
  //     selectedLocations.filter((location) => location !== locationToRemove)
  //   );
  // };


  // const handleSearchChange = (e) => {
  //   const value = e.target.value;
  //   setSearchInput(value);

  //   if (value === "") {
  //     setFilteredLocations(locations);
  //   } else {
  //     setFilteredLocations(
  //       locations.filter((loc) =>
  //         loc.LocationName.toLowerCase().includes(value.toLowerCase())
  //       )
  //     );
  //   }
  // };
  const handleExport = () => {
    setShowFormatDropdown(!showFormatDropdown);
  };
  const handleCancelExport = () => {
    setShowConfirmation(false);
  };

  const handleTableDropdownChange = (format) => {
    setExportTableFormat(format);
    setShowFormatDropdown(false);
    setShowConfirmation(true);
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
  const fetchLocationData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/locations`);
      //setLocations(response.data);
      //setFilteredLocations(response.data);
      const locationNames = response.data.map((item) => item.LocationName);
      setLocations(locationNames);

    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };
  //const locationName = selectedLocations;
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
      
      })
      .catch((error) => {
        console.error("Error in exporting data:", error);
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
      
        setMonthImage({
          labels: labels.filter((label) => label !== "id"),
          datasets: [
            {
              ...monthImage.datasets[0],
              data: data,
            },
          ],
        });
     
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const fetchTableData = () => {
    let apiUrl = `${API_URL}/tabularData`;

    if (selectedLocations && selectedLocations.length > 0) {
      const locationQuery = selectedLocations
        .map((location) => `locationName=${encodeURIComponent(location)}`)
        .join("&");
      apiUrl += `?${locationQuery}`;
    }
    axios
      .get(apiUrl)
      .then((response) => {
        setTableData(response.data);
       
      })
      .catch((error) => console.error(error));
  };
  
  const fetchAllGraphImageData = async (queryParams) => {
    try {
      let apiUrl = `${API_URL}/graph10`;

      // Extract locations from queryParams if they exist
      const locations = queryParams?.locationNames
        ? queryParams.locationNames.split(',')
        : [];

      if (locations.length > 0) {
        const locationQuery = locations
          .map(location => `locationname=${encodeURIComponent(location.trim())}`)
          .join('&');
        apiUrl += `?${locationQuery}`;
      }

    

      const response = await axios.get(apiUrl);
      const apiData = response.data;

  
      if (!apiData || apiData.length === 0) {
        console.error("No data received from the API");
        return;
      }

      const labels = apiData.map(item => item["Location Name"] || item["locationname"] || "Unknown");
      const data = apiData.map(item => item["Images"] || 0);

     

      setAllLocationImage({
        labels: labels,
        datasets: [{
          label: "Images",
          data: data,
          backgroundColor: "#02B2AF",
        }],
      });

    } catch (error) {
      console.error("Error in fetchAllGraphImageData:", {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
    }
  };

  useEffect(() => {

    fetchLocationData();
    fetchMonthImageGraphData(locationName);
    fetchAllGraphImageData(locationName);
    fetchTableData();
    fetchExportCsvFile();
  }, []);
  const columnSums = calculateColumnSum();
  const isDistrictHeadUser =
    userLog && userLog.user_roles.includes("All District Head");
  if (!userLog) {
    Navigate("/");
  }
  const formatChartData = (data, colors) => ({
    options: {
      chart: {
        toolbar: {
          show: false,
        },
        stacked: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: -15,
        colors: ["transparent"],
      },
      legend: {
        show: true,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "30%",
          borderRadius: 2,
        },
      },
      colors: colors,
      xaxis: {
        categories: data.labels,
      },
      responsive: [
        {
          breakpoint: 1024,
          options: {
            plotOptions: {
              bar: {
                columnWidth: "30%",
                borderRadius: 7,
              },
            },
          },
        },
      ],
    },
    series: [
      {
        name: data.datasets[0].label,
        data: data.datasets[0].data,
      },
    ],
  });

  function downloadCSVFromTable() {
    const table = document.querySelector(".data-table"); // Select the table by class
    let csvContent = "";

    // Define the full header row
    const headerRow1 = [
      "Sr. No.",
      "Location",
      `Scanned (${formattedPreviousDate})`,
      "",
      `Scanned (${formattedYesterdayDate})`,
      "",
      `Scanned (${formattedCurrentDate})`,
      "",
      "Cumulative till date",
      "",
    ];

    // Define the second row of headers
    const headerRow2 = [
      "",
      "",
      "Files",
      "Images",
      "Files",
      "Images",
      "Files",
      "Images",
      "Files",
      "Images",
      "",
    ];

    // Join both header rows to create the full CSV header
    csvContent += headerRow1.join(",") + "\n";
    csvContent += headerRow2.join(",") + "\n";

    // Extract the table body rows
    const rows = table.querySelectorAll("tbody tr");
    rows.forEach((row, index) => {
      const cells = row.querySelectorAll("td");
      const rowContent = [];

      cells.forEach((cell) => {
        // Remove any commas from cell content to avoid CSV issues
        rowContent.push(cell.innerText.replace(/,/g, ""));
      });

      // Ensure the row has the correct number of columns
      while (rowContent.length < headerRow1.length) {
        rowContent.push(""); // Add empty data if there are fewer columns
      }

      // For the last row (Total row), handle the colspan=2 logic
      if (index === rows.length - 1) {
        // Insert an empty cell after "Total" to account for the colspan=2
        rowContent.splice(1, 0, "");
      }

      csvContent += rowContent.join(",") + "\n";
    });

    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "Scannedreport.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  function exportTableToPDFTable() {
    const input = document.querySelector(".data-table"); // Target the table

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });

      // Add heading
      pdf.setFontSize(18);
      pdf.setTextColor(0, 0, 0); // Set text color to black
      pdf.text(
        "PROJECT UPDATE OF SCANNING FOR DISTRICT COURT OF TELANGANA",
        40,
        30
      ); // Add heading at position (40, 30)

      // Adjusting image width and height to fit in the PDF
      const imgWidth = 825; // Fit landscape A4 width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add the table image below the heading
      pdf.addImage(imgData, "PNG", 20, 50, imgWidth, imgHeight); // Adjust y-coordinate to fit below heading

      pdf.save("Scannedreport.pdf");
    });
  }
  function exportTableToExcelTable() {
    const table = document.querySelector(".data-table");
    const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
    XLSX.writeFile(wb, "Scannedreport.xlsx");
  }
  function downloadAllFormatsSummary() {
    if (exportTableFormat === "csv") {
      downloadCSVFromTable();
      setShowConfirmation(false);
    } else if (exportTableFormat === "excel") {
      exportTableToExcelTable();
      setShowConfirmation(false);
    } else if (exportTableFormat === "pdf") {
      exportTableToPDFTable();
      setShowConfirmation(false);
    } else {
      return "";
    }
  }
  // Helper function outside component
  const filterLocations = (data, searchTerm) => {
    if (!data || !searchTerm) return data;
    return data.filter((item) =>
      item.LocationName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleReset = async () => {

    setSelectedLocations([]);

  }

  const [lastSearchTime, setLastSearchTime] = useState(null);
  const [lastSearchParams, setLastSearchParams] = useState(null);

  const handleClick = async () => {


    // Prepare current search parameters
    const currentParams = {
      locations: selectedLocations.join(","),

    };

    // Check if this is the same as last search
    if (lastSearchParams && JSON.stringify(lastSearchParams) === JSON.stringify(currentParams)) {
      toast.info("Same search parameters detected. Please wait before searching again.");
      return;
    }

    // Check cooldown period (5 seconds)
    const now = Date.now();



    setLastSearchTime(now);
    setLastSearchParams(currentParams);

    const queryParams = {
      locationNames: currentParams.locations
    };

   



    try {
      await Promise.all([
        


        fetchMonthImageGraphData(queryParams),

        fetchAllGraphImageData(queryParams),
        fetchTableData(),
        fetchExportCsvFile(),

      ]);
      // toast.success("Data loaded successfully");
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data. Please try again.");
      // Reset search tracking on error
      setLastSearchTime(null);
      setLastSearchParams(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2 col-md-2 "></div>
          <div className="col-lg-10 col-md-10">
            <div className="row mt-2">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h4> Telangana Dashboard</h4>
                <p
                  style={{
                    fontSize: "12px",
                    color: "maroon",
                    textAlign: "right",
                  }}
                >
                  Last Active Login:{" "}
                  {userLog ? userLog.last_active_login : "Guest"}
                </p>
              </div>
            </div>
           
            <div
              className="row mt-2 search-report-card d-flex gap-4 flex-wrap align-items-center"
              style={{ gap: '24px' }}
            >
              <div
                className="col-sm-3 col-lg-3 d-flex align-items-center gap-3"
                style={{ position: 'relative', minWidth: '250px' }}
              >
                <div
                  ref={dropdownRef}
                  className="search-bar"
                  onClick={() => setShowLocation(true)}
                  style={{
                    border: '1px solid #000',
                    padding: '5px',
                    borderRadius: '5px',
                    // minHeight: '30px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '5px',
                    alignItems: 'center',
                    cursor: 'pointer',
                    width: '250px',
                    minWidth: '250px',
                    maxWidth: '250px',
                    height: selectedLocations.length >= 2 ? '60px' : 'auto',
                    overflowY: selectedLocations.length >= 2 ? 'auto' : 'hidden',
                    overflowX: 'hidden',
                  }}
                >
                  <div>
                    {selectedLocations.map((location, index) => (
                      <span key={index} className="selected-location">
                        {location}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeLocation(location);
                          }}
                          style={{
                            backgroundColor: 'black',
                            color: 'white',
                            border: 'none',
                            marginLeft: '5px',
                            borderRadius: '50%',
                            width: '18px',
                            height: '18px',
                            fontSize: '12px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          ×
                        </button>
                        &nbsp;
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder={selectedLocations.length === 0 ? 'Select Locations...' : ''}
                      value={locationSearchInput}
                      onChange={(e) => {
                        setLocationSearchInput(e.target.value);
                        setShowLocation(true);
                      }}
                      onKeyDown={handleLocationKeyDown}
                      style={{
                        border: 'none',
                        outline: 'none',
                        width: selectedLocations.length > 0 ? '70px' : '100%',
                        backgroundColor: 'transparent',
                        minWidth: '60px',
                      }}
                    />
                  </div>
                  {selectedLocations.length < 1 ? <FaChevronDown style={{ color: 'grey' }} /> : ''}
                </div>

                {showLocation && (
                  <div
                    ref={dropdownMenuRef}
                    className="location-card"
                    style={{
                      position: 'absolute',
                      zIndex: 1000,
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      width: '230px',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      top: '100%',
                      marginLeft: '1px',
                      marginTop: '3px',
                    }}
                  >
                    {filteredLocations.map((locationName, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '8px 12px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #eee',
                          backgroundColor: index === highlightedIndex ? '#f0f0f0' : 'transparent',
                        }}
                        onClick={() => {
                          handleLocation(locationName);
                          setShowLocation(false);
                        }}
                        onMouseEnter={() => setHighlightedIndex(index)}
                      >
                        {locationName}
                      </div>
                    ))}
                    {filteredLocations.length === 0 && (
                      <div style={{ padding: '8px 12px', color: '#999' }}>No locations found</div>
                    )}
                  </div>
                )}
              </div>

              <div className="col-12 col-md-6 d-flex align-items-center gap-3 flex-nowrap">
                <button
                  style={{
                    backgroundColor: '#4BC0C0',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '5px',
                    whiteSpace: 'nowrap',
                  }}
                  onClick={handleClick}
                  className="me-2"
                >
                  Search
                </button>
                <button
                  style={{
                    backgroundColor: '#4BC0C0',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '5px',
                    whiteSpace: 'nowrap',
                  }}
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </div>
            <div className="row mt-2">
              <div className="card">
                <Card>
                  <CardBody>
                    <CardTitle tag="h5">
                      SCANNED REPORT OF LAST 30 DAYS{" "}
                    </CardTitle>
                    <Chart
                      options={formatChartData(monthImage, ["#4BC0C0"]).options}
                      series={formatChartData(monthImage, ["#4BC0C0"]).series}
                      type="bar"
                      height="379"
                    />
                  </CardBody>
                </Card>
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
                    <h6
                      style={{ color: "white", cursor: "pointer" }}
                      onClick={handleExport}
                    >
                      {" "}
                      <MdFileDownload style={{ fontSize: "20px" }} />
                      Export CSV
                    </h6>
                  </div>
                  {showFormatDropdown && (
                    <div
                      style={{
                        height: "0px",
                        overflow: "visible",
                        display: "flex",
                        justifyContent: "right",
                      }}
                    >
                      <div className="export-dropdown-card">
                        <p onClick={() => handleTableDropdownChange("csv")}>
                          CSV
                        </p>
                        <p onClick={() => handleTableDropdownChange("excel")}>
                          Excel
                        </p>
                        <p onClick={() => handleTableDropdownChange("pdf")}>
                          PDF
                        </p>
                      </div>
                    </div>
                  )}
                  {showConfirmation && (
                    <div className="confirmation-dialog">
                      <div className="confirmation-content">
                        <p className="fw-bold">
                          Are you sure you want to export the{" "}
                          {exportTableFormat.toUpperCase()} file?
                        </p>
                        <button
                          className="btn btn-success mt-3 ms-5"
                          onClick={downloadAllFormatsSummary}
                        >
                          Yes
                        </button>
                        <button
                          className="btn btn-danger ms-3 mt-3"
                          onClick={handleCancelExport}
                        >
                          No
                        </button>
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
                        <th rowspan="2" style={{ verticalAlign: "middle" }}>
                          Sr. No.
                        </th>
                        <th rowspan="2" style={{ verticalAlign: "middle" }}>
                          Location
                        </th>
                        <th colspan="2">Scanned ({formattedPreviousDate})</th>
                        <th colspan="2">Scanned ({formattedYesterdayDate})</th>
                        <th colspan="2">Scanned ({formattedCurrentDate})</th>
                        <th colspan="2">Cumulative till date</th>
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
                         
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td style={{ textAlign: "left" }}>
                                  {elem.LocationName}
                                </td>
                                <td>
                                  {isNaN(parseInt(elem.Prev_Files))
                                    ? 0
                                    : parseInt(
                                      elem.Prev_Files
                                    ).toLocaleString()}
                                </td>
                                <td>
                                  {isNaN(parseInt(elem.Prev_Images))
                                    ? 0
                                    : parseInt(
                                      elem.Prev_Images
                                    ).toLocaleString()}
                                </td>
                                <td>
                                  {isNaN(parseInt(elem.Yes_Files))
                                    ? 0
                                    : parseInt(elem.Yes_Files).toLocaleString()}
                                </td>
                                <td>
                                  {isNaN(parseInt(elem.Yes_Images))
                                    ? 0
                                    : parseInt(
                                      elem.Yes_Images
                                    ).toLocaleString()}
                                </td>
                                <td>
                                  {isNaN(parseInt(elem.Today_Files))
                                    ? 0
                                    : parseInt(
                                      elem.Today_Files
                                    ).toLocaleString()}
                                </td>
                                <td>
                                  {isNaN(parseInt(elem.Today_Images))
                                    ? 0
                                    : parseInt(
                                      elem.Today_Images
                                    ).toLocaleString()}
                                </td>
                                <td>
                                  {isNaN(parseInt(elem.Total_Files))
                                    ? 0
                                    : parseInt(
                                      elem.Total_Files
                                    ).toLocaleString()}
                                </td>
                                <td>
                                  {isNaN(parseInt(elem.Total_Images))
                                    ? 0
                                    : parseInt(
                                      elem.Total_Images
                                    ).toLocaleString()}
                                </td>
                              </tr>
                            );
                          
                          return null;
                        })}

                      <tr style={{ color: "black" }}>
                        <td colspan="2">
                          <strong>Total</strong>
                        </td>

                        <td>
                          <strong>
                            {isNaN(parseInt(columnSums.prevFilesSum))
                              ? 0
                              : parseInt(
                                columnSums.prevFilesSum
                              ).toLocaleString()}
                          </strong>
                        </td>
                        <td>
                          <strong>
                            {isNaN(parseInt(columnSums.prevImagesSum))
                              ? 0
                              : parseInt(
                                columnSums.prevImagesSum
                              ).toLocaleString()}
                          </strong>
                        </td>
                        <td>
                          <strong>
                            {isNaN(parseInt(columnSums.yesFilesSum))
                              ? 0
                              : parseInt(
                                columnSums.yesFilesSum
                              ).toLocaleString()}
                          </strong>
                        </td>
                        <td>
                          <strong>
                            {isNaN(parseInt(columnSums.yesImagesSum))
                              ? 0
                              : parseInt(
                                columnSums.yesImagesSum
                              ).toLocaleString()}
                          </strong>
                        </td>
                        <td>
                          <strong>
                            {isNaN(parseInt(columnSums.todayFilesSum))
                              ? 0
                              : parseInt(
                                columnSums.todayFilesSum
                              ).toLocaleString()}
                          </strong>
                        </td>
                        <td>
                          <strong>
                            {isNaN(parseInt(columnSums.todayImagesSum))
                              ? 0
                              : parseInt(
                                columnSums.todayImagesSum
                              ).toLocaleString()}
                          </strong>
                        </td>
                        <td>
                          <strong>
                            {isNaN(parseInt(columnSums.totalFilesSum))
                              ? 0
                              : parseInt(
                                columnSums.totalFilesSum
                              ).toLocaleString()}
                          </strong>
                        </td>
                        <td>
                          <strong>
                            {isNaN(parseInt(columnSums.totalImagesSum))
                              ? 0
                              : parseInt(
                                columnSums.totalImagesSum
                              ).toLocaleString()}
                          </strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="row mt-2">
              <Card>
                <CardBody>
                  <CardTitle tag="h5">Cumulative Scanned Till Date</CardTitle>
                  <CardSubtitle className="text-muted" tag="h6">
                    All Location: Images
                  </CardSubtitle>
                  <Chart
                    options={
                      formatChartData(allLocationImage, ["#088395"]).options
                    }
                    series={
                      formatChartData(allLocationImage, ["#088395"]).series
                    }
                    type="bar"
                    height="350"
                  />
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default DistrictHeadDashboard;
