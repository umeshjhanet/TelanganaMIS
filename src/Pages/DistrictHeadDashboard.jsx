import React, { useEffect, useState, useRef } from "react";
import Chart from "react-apexcharts";
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import Header from "../Components/Header";
import axios, { all } from "axios";
import "../App.css";
import Footer from "../Components/Footer";
import { BarChart } from "@mui/x-charts/BarChart";
import { format, sub } from "date-fns";
import { MdFileDownload } from "react-icons/md";
import { API_URL } from "../Api";
import { Navigate } from "react-router-dom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import { FaChevronDown } from "react-icons/fa";
import SearchBar from "../Components/SearchBar";
import SearchButton from "../Components/Button";
import BarGraph from "../Components/BarGraph";
import DonutGraph from "../Components/DonutGraph";
import ProjectStatusTable from "../Components/ProjectStatusTable";

const DistrictHeadDashboard = ({ showSideBar }) => {
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


  const filteredLocations =
    locations?.filter(
      (locationName) =>
        locationName &&
        locationName.toLowerCase().includes(locationSearchInput.toLowerCase())
    ) || [];



  const dropdownMenuRef = useRef(null); // Add this ref for the dropdown menu

  

  // Update your handleLocation function
 


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
   
    try {
      const response = await axios.post(`${API_URL}/locations`);
      //setLocations(response.data);
      const locationNames = response.data.map((item) => item.LocationName);
      setLocations(locationNames);
      //setFilteredLocations(response.data);
    } catch (error) {
      console.error(error);
    }
    //setIsLoading(false);
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
      .post(`${API_URL}/graphmonth`, params)
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
    axios
      .post(`${API_URL}/tabularData`)
      .then((response) => {
     
        let data = response.data;
        if (selectedLocations.length > 0) {

          data = data.filter(item =>
            selectedLocations.includes(item.LocationName)
          );
         
          setTableData(data);
        } else {
          setTableData(response.data);
        }

      })
      .catch((error) => console.error(error));
  };

const fetchAllGraphImageData = async (queryParams) => {
  try {
    const apiUrl = `${API_URL}/graph10`;

    const body = {};
    if (queryParams?.locationNames) {
      body.locationNames = queryParams.locationNames
        .split(',')
        .map(loc => loc.trim());
    }

    const response = await axios.post(apiUrl, body);
    const apiData = response.data;

    if (!apiData || apiData.length === 0) return;

    const labels = apiData.map(item => item["Location Name"] || item["locationname"] || "Unknown");
    const data = apiData.map(item => item["Images"] || 0);

    setAllLocationImage({
      labels,
      datasets: [{
        label: "Images",
        data,
        backgroundColor: "#02B2AF",
      }],
    });

  } catch (error) {
    console.error("Error in fetchAllGraphImageData:", error);
  }
};

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchLocationData(),
          fetchMonthImageGraphData(locationName),
          fetchAllGraphImageData(locationName),
          fetchTableData(),
          fetchExportCsvFile(),
        ]);
      } catch (error) {
        console.error("Error fetching dat:", error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
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
    const table = document.querySelector(".data-table"); // Select the table by className
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

      // For the last row (Total row), handle the colSpan=2 logic
      if (index === rows.length - 1) {
        // Insert an empty cell after "Total" to account for the colSpan=2
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

  const Loader = () => (
    <div className="loader-overlay">
      <div className="loader"></div>
    </div>
  );

  return (
    <>
      {isLoading && <Loader />}
      <div className="container-fluid">
        <div className="row">
          <div className={`${showSideBar ? 'col-lg-1 col-md-0' : 'col-lg-2 col-md-0'} d-none d-lg-block`}></div>
          <div className={`${showSideBar ? 'col-lg-11 col-md-12' : 'col-lg-10 col-md-12 '} col-sm-12`}>
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
                className="col-lg-4 col-md-2 col-sm-12 mt-1"
                style={{ position: 'relative' }}
              >
                <SearchBar
                  items={locations} // all available locations
                  selectedItems={selectedLocations} // current selections
                  onChange={(newSelected) =>
                    setSelectedLocations(newSelected)
                  } // update handler
                  placeholder="Search locations..."
                  showSelectAll={true}
                />
              </div>

              <div className="col-12 col-md-6 d-flex align-items-center gap-3 flex-nowrap">
                <SearchButton
                  onClick={handleClick}
                  Name="Search"
                />
                <SearchButton
                  onClick={handleReset}
                  Name="Reset"
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="card">
                <BarGraph
                  Heading="SCANNED REPORT OF LAST 30 DAYS"
                  barFile={monthImage}
                  color={["#4BC0C0"]}
                  bar="bar"
                  height={390}
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="row mt-2">
                <ProjectStatusTable
                  tableData={tableData}
                  columnSums={columnSums}
                  formattedPreviousDate={formattedPreviousDate}
                  formattedYesterdayDate={formattedYesterdayDate}
                  formattedCurrentDate={formattedCurrentDate}
                  showFormatDropdown={showFormatDropdown}
                  handleExport={handleExport}
                  showConfirmation={showConfirmation}
                  exportTableFormat={exportTableFormat}
                  handleTableDropdownChange={handleTableDropdownChange}
                  downloadAllFormatsSummary={downloadAllFormatsSummary}
                  handleCancelExport={handleCancelExport}
                />
              </div>
            </div>

            <div className="row mt-2">
              <BarGraph
                Heading="Cumulative Scanned Till Date"
                subTitle="All Location: Images"
                barFile={allLocationImage}
                color={["#088395"]}
                bar="bar"
                height={350}
              />
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default DistrictHeadDashboard;
