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
import Chart from 'react-apexcharts';
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import Header from "./Components/Header";
import axios, { all } from "axios";
import "./App.css";
import Footer from "./Footer";
import { BarChart } from "@mui/x-charts/BarChart";
import { format, sub } from "date-fns";
import { MdFileDownload } from "react-icons/md";
import { API_URL } from "./Api";
import { Navigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


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
  const [exportTableFormat, setExportTableFormat] = useState('csv')
  const userLog = JSON.parse(localStorage.getItem("user"));
  console.log("User's Info", userLog);



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
    setShowLocation(false); // Close the dropdown when a location is selected
  };


  const removeLocation = (locationName) => {
    setSelectedLocations(
      selectedLocations.filter((loc) => loc !== locationName)
    );
  };


  const handleExport = () => {
    setShowFormatDropdown(!showFormatDropdown);
  };
  const handleCancelExport = () => {
    setShowConfirmation(false);
  };

  const handleTableDropdownChange = (format) => {
    setExportTableFormat(format);
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
          console.log("Table Data", response.data); // Log inside the then block
        })
        .catch((error) => console.error(error));
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



    fetchMonthImageGraphData(locationName);
    fetchAllGraphImageData(locationName);
    fetchTableData();
    fetchExportCsvFile();


  }, [selectedLocations]);



  const columnSums = calculateColumnSum();
  const isDistrictHeadUser =
    userLog && userLog.user_roles.includes("All District Head");


  if (!userLog) {
    Navigate('/');
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

  const fileSummaryHeaders = [
    'LocationName',
    'Prev_Files',
    'Prev_Images',
    'Yes_Files',
    'Yes_Images',
    'Today_Files',
    'Today_Images',
    'Total_Files',
    'Total_Images'
  ];

  function convertJSONToCSVSummary(tableData, columnHeaders) {
    if (tableData.length === 0) return '';

    const headers = columnHeaders.join(',') + '\n';
    const rows = tableData
      .map(row => columnHeaders.map(field => row[field] || '').join(','))
      .join('\n');

    return headers + rows;
  }
  function downloadCSVSummary(summaryData, headers) {
    const csvData = convertJSONToCSVSummary(summaryData, headers);
    if (csvData === '') {
      alert('No data to export');
    } else {
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'Summary.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
  function downloadExcelSummary(summaryData, headers) {
    const worksheet = XLSX.utils.json_to_sheet(summaryData, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'Summary.xlsx');
  }
  function downloadPDFSummary(summaryData, headers) {
    const doc = new jsPDF({
      orientation: 'l', // Landscape orientation to fit wide tables
      unit: 'mm',
      format: 'a2', // A4 paper size
    });

    doc.autoTable({
      head: [headers], // Table headers
      body: summaryData.map(row => headers.map(header => row[header] || '')), // Table rows
      startY: 20, // Start position of the table
      margin: { top: 10 }, // Margin from the top of the page
      theme: 'grid', // Optional: use a grid theme for better visibility
      styles: {
        cellPadding: 2, // Cell padding
        fontSize: 10, // Font size
        valign: 'middle', // Vertical alignment
        overflow: 'linebreak', // Ensure text wraps correctly
        halign: 'left', // Horizontal alignment
      },
      headStyles: {
        fillColor: [22, 160, 133], // Header background color (teal)
        textColor: [255, 255, 255], // Header text color (white)
        halign: 'center', // Center-align header text
      },
      bodyStyles: {
        fillColor: [255, 255, 255], // Body cell background color (white)
        textColor: [0, 0, 0], // Body cell text color (black)
      },
      columnStyles: {
        // Adjust column widths if necessary
        0: { cellWidth: 30 },
        1: { cellWidth: 50 },
        2: { cellWidth: 50 },
        // Add more column widths if needed
      },
      pageBreak: 'auto', // Automatically handle page breaks
    });

    // Save the generated PDF
    doc.save('Summary.pdf');
  }
  function downloadAllFormatsSummary(summaryData, headers) {
    if (exportTableFormat === 'csv') {
      downloadCSVSummary(summaryData, headers);
      setShowConfirmation(false);
    }
    else if (exportTableFormat === 'excel') {
      downloadExcelSummary(summaryData, headers);
      setShowConfirmation(false);
    }
    else if (exportTableFormat === 'pdf') {
      downloadPDFSummary(summaryData, headers);
      setShowConfirmation(false);
    }
    else {
      return '';
    }
  }

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2 col-md-2 "></div>
          <div className="col-lg-10 col-md-10">
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
            <div className="row search-report-card">
              <div className="col-md-4 col-sm-12">
                <div
                  ref={dropdownRef}
                  className="search-bar "
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
              <Card>
                  <CardBody>
                    <CardTitle tag="h5">SCANNED REPORT OF LAST 30 DAYS </CardTitle>
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
                    <h6 style={{ color: "white" ,cursor:"pointer"  }} onClick={handleExport}>
                      {" "}
                      <MdFileDownload style={{ fontSize: "20px" }} />
                      Export CSV
                    </h6>
                  </div>
                  {showFormatDropdown && (
                    <div style={{ height: '0px', overflow: 'visible', display: 'flex', justifyContent: 'right' }}>
                      <div className="export-dropdown-card">
                        <p onClick={() => handleTableDropdownChange('csv')}>CSV</p>
                        <p onClick={() => handleTableDropdownChange('excel')}>Excel</p>
                        <p onClick={() => handleTableDropdownChange('pdf')}>PDF</p>
                      </div>
                    </div>
                  )}
                  {showConfirmation && (
                    <div className="confirmation-dialog">
                      <div className="confirmation-content">
                        <p className="fw-bold">Are you sure you want to export the CSV file?</p>
                        <button className="btn btn-success mt-3 ms-5" onClick={() => {
                          downloadAllFormatsSummary(tableData, fileSummaryHeaders);
                        }}>Yes</button>
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
                        <th rowspan="2" style={{verticalAlign:'middle'}}>Sr. No.</th>
                        <th rowspan="2" style={{verticalAlign:'middle'}}>Location</th>
                        <th colspan="2">Scanned ({formattedPreviousDate})</th>
                        <th colspan="2">
                          Scanned ({formattedYesterdayDate})
                        </th>
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
                    <CardSubtitle className="text-muted" tag="h6">All Location: Images</CardSubtitle>
                    <Chart
                      options={formatChartData(allLocationImage,["#088395"]).options}
                      series={formatChartData(allLocationImage,["#088395"]).series}
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
}


export default DistrictHeadDashboard