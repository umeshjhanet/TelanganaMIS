import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import axios from "axios";
import { MdFileDownload } from "react-icons/md";
import { API_URL } from "../Api";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaChevronDown } from "react-icons/fa";
import SearchBar from "../Components/SearchBar";
import Search from "../Components/Button";
import ReportCard from "../Components/ReportCard";
import SearchButton from "../Components/Button";


const Report = ({ showSideBar }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showLocation, setShowLocation] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [locationName, setLocationName] = useState("");
  const [showFileType, setShowFileType] = useState(false);
  const [selectedFileTypes, setSelectedFileTypes] = useState([]);
  const [fileType, setfileType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [summary, setSummary] = useState();
  const [report, setReport] = useState();
  const [dateReport, setDateReport] = useState();
  const [csv, setCsv] = useState(null);
  const [reportCsv, setReportCsv] = useState(null);
  const [dateReportCsv, setDateReportCsv] = useState(null);
  const dropdownRef = useRef(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showConfirmationBox, setShowConfirmationBox] = useState(false);
  const [showConfirmationBoxDate, setShowConfirmationBoxDate] = useState(false);
  const [totalLocations, setTotalLocations] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [showTableDropdown, setShowTableDropdown] = useState(false);
  const [exportTableFormat, setExportTableFormat] = useState('csv');
  const [inputText, setInputText] = useState("");
  const [locationSearchInput, setLocationSearchInput] = useState("");
  const [fileTypeSearchInput, setFileTypeSearchInput] = useState("");
  const [locations, setLocations] = useState();
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const userLog = JSON.parse(localStorage.getItem("user"));
  const userRoles = userLog?.user_roles || [];
  const dropdownMenuRef = useRef(null);



  const handleFileType = (fileType) => {
    if (!selectedFileTypes.includes(fileType)) {
      setSelectedFileTypes([...selectedFileTypes, fileType]);
      setFileTypeSearchInput("");
    }
    setShowFileType(false);
    setHighlightedIndex(-1);
  };

  const removeFileType = (fileType) => {
    setSelectedFileTypes(
      selectedFileTypes.filter((ft) => ft !== fileType)
    );
  };

  const handleExport = () => {
    setShowDropdown(!showDropdown);
  };

  const handleCancelExport = () => {
    setShowConfirmation(false);
  };

  const handleDropdownChange = (format) => {
    setExportFormat(format);
    setShowDropdown(false);
    setShowConfirmation(true);
  };

  const handleTableDropdownChange = (format) => {
    setExportTableFormat(format);
    setShowTableDropdown(false);
    setShowConfirmationBox(true);
  };

  const handleReportCsv = () => {
    setShowTableDropdown(!showTableDropdown);
  };


  const handleReportCancelExport = () => {
    setShowConfirmationBox(false);
  };

  const handleDateReportCsv = () => {
    setShowConfirmationBoxDate(true);
  };

  const handleDateReportCancelExport = () => {
    setShowConfirmationBoxDate(false);
  };

  const formatDate = (date) => {
    // Format to YYYY-MM-DD
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      let apiUrl = `${API_URL}/reportTable`;
      const queryParams = {};

      const userLog = JSON.parse(localStorage.getItem('user'));

      if (userLog?.locations && userLog.locations.length === 1 && userLog.user_roles.includes("Cbsl User")) {

        queryParams.locationName = userLog.locations[0].name;
      }
      else if (selectedLocations) {
        queryParams.locationName = selectedLocations;
      }

      if (startDate && endDate) {
        queryParams.startDate = formatDate(startDate);
        queryParams.endDate = formatDate(endDate);
      }
      if (fileType) {
        queryParams.fileType = selectedFileTypes;
      }




      const response = await axios.get(apiUrl, { params: queryParams });

      setReport(response.data);
      setIsLoading(false);
      updateTotalLocations(response.data);
    } catch (error) {
      console.error("Error fetching report data:", error);
      setError("Error fetching report data. Please try again.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchDateReportData = async () => {
    //setIsLoading(true);
    try {
      let apiUrl = `${API_URL}/datewisereport`;
      const queryParams = {};

      const userLog = JSON.parse(localStorage.getItem('user'));

      if (locationName) {
        queryParams.locationName = selectedLocations;
      }

      if (startDate && endDate) {
        queryParams.startDate = formatDate(startDate);
        queryParams.endDate = formatDate(endDate);
      }
      if (fileType) {
        queryParams.fileType = selectedFileTypes;
      }



      //setIsLoading(true);
      const response = await axios.get(apiUrl, { params: queryParams });

      setDateReport(response.data);
      //setIsLoading(false);
      updateTotalLocations(response.data);
    } catch (error) {
      console.error("Error fetching report data:", error);
      setError("Error fetching report data. Please try again.");
      //setIsLoading(false);
    } finally {
      // setIsLoading(false);
    }
  };
  const fetchLocation = async () => {
    //setIsLoading(true);
    try {
      let apiUrl = `${API_URL}/locations`;
      //setIsLoading(true);
      const response = await axios.get(apiUrl);

      // Extract just the LocationName values
      const locationNames = response.data.map(item => item.LocationName);

      setLocations(locationNames);
      //setIsLoading(false);
      updateTotalLocations(locationNames);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setError("Error fetching locations. Please try again.");
      //setIsLoading(false);
    } finally {
      //setIsLoading(false);
    }
  };

  useEffect(() => {
    const locationName = selectedLocations;
    const fileType = selectedFileTypes;

    const fetchFileTypes = async () => {
      try {
        const response = await axios.get(`${API_URL}/summaryfiletype`);
        setfileType(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Execute all initial API calls in parallel
        await Promise.all([
          fetchLocation(),
          fetchReportData(),
          fetchFileTypes(),
          ...(startDate && endDate ? [fetchDateReportData()] : [])
        ]);
      } catch (error) {
        console.error("Error in initial API calls:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []); // Empty dependency array - runs only once when component mounts

  const updateTotalLocations = (data) => {
    const uniqueLocations = [...new Set(data.map(elem => elem.LocationName))];
    setTotalLocations(uniqueLocations.length);

  };
  const Loader = () => (
    <div className="loader-overlay">
      <div className="loader"></div>
    </div>
  );
  const fileSummaryHeaders = [
    'TotalLocation',
    'CollectionFiles',
    'CollectionImages',
    'ScannedFiles',
    'ScannedImages',
    'QCFiles',
    'QCImages',
    // 'FlaggingFiles',
    // 'FlaggingImages',
    'IndexingFiles',
    'IndexingImages',
    'CBSL_QAFiles',
    'CBSL_QAImages',
    'Export_PdfFiles',
    'Export_PdfImages',
    'Client_QAFiles',
    'Client_QAImages',
    'Digi_SignFiles',
    'Digi_SignImages',
    'InventoryFiles',
    'InventoryImages'
  ];
  function convertJSONToCSVSummary(summary, columnHeaders) {
    if (summary.length === 0) return '';

    const headers = columnHeaders.join(',') + '\n';
    const rows = summary
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
        1: { cellWidth: 40 },
        2: { cellWidth: 40 },
        // Add more column widths if needed
      },
      pageBreak: 'auto', // Automatically handle page breaks
    });

    // Save the generated PDF
    doc.save('Summary.pdf');
  }
  function downloadAllFormatsSummary(summaryData, headers) {
    if (exportFormat === 'csv') {
      downloadCSVSummary(summaryData, headers);
      setShowConfirmation(false);
    }
    else if (exportFormat === 'excel') {
      downloadExcelSummary(summaryData, headers);
      setShowConfirmation(false);
    }
    else if (exportFormat === 'pdf') {
      downloadPDFSummary(summaryData, headers);
      setShowConfirmation(false);
    }
    else {
      return '';
    }
  }

  function downloadCSVFromTable() {
    const table = document.querySelector(".data-table"); // Select the table by className
    let csvContent = "";

    // Define the full header row
    const headerRow1 = [
      "Sr No",
      "Location",
      "Collection of Records", "", "Scanning ADF", "", "Image QC", "",
      "Document Classification", "", "Indexing", "", "CBSL QA", "", "Export PDF", "",
      "Client QA", "", "CSV Generation", "", "Inventory Out", ""
    ];

    // Define the second row of headers
    const headerRow2 = [
      "", "",  // Empty placeholders for Location and Date
      "Files", "Images",
      "Files", "Images",
      "Files", "Images",
      "Files", "Images",
      "Files", "Images",
      "Files", "Images",
      "Files", "Images",
      "Files", "Images",
      "Files", "Images",
      "Files", "Images"
    ];

    // Join both header rows to create the full CSV header
    csvContent += headerRow1.join(",") + "\n";
    csvContent += headerRow2.join(",") + "\n";

    // Extract the table body rows
    const rows = table.querySelectorAll("tbody tr");
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll("td");
      const rowContent = [];

      // Add Sr No (starts from 1)
      rowContent.push(rowIndex + 1);

      cells.forEach((cell) => {
        // Remove any commas from cell content to avoid CSV issues
        rowContent.push(cell.innerText.replace(/,/g, ""));
      });

      // Ensure the row has the correct number of columns
      while (rowContent.length < headerRow1.length) {
        rowContent.push(""); // Add empty data if there are fewer columns
      }

      csvContent += rowContent.join(",") + "\n";
    });

    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "Locationwisedetailedreport.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowConfirmationBox(false);
  }
  function exportTableToPDFTable() {
    const input = document.querySelector(".data-table"); // Target the table

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4',
      });

      // Add heading
      pdf.setFontSize(18);
      pdf.setTextColor(0, 0, 0); // Set text color to black
      pdf.text("LOCATION WISE DETAILED REPORT", 40, 30); // Add heading at position (40, 30)

      // Adjusting image width and height to fit in the PDF
      const imgWidth = 825; // Fit landscape A4 width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add the table image below the heading
      pdf.addImage(imgData, 'PNG', 20, 50, imgWidth, imgHeight); // Adjust y-coordinate to fit below heading

      pdf.save("Locationwisedetailedreport.pdf");
    });
  }
  function exportTableToExcelTable() {
    const table = document.querySelector(".data-table");
    const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
    XLSX.writeFile(wb, "Locationwisedetailedreport.xlsx");
  }

  function downloadAllFormats() {
    if (exportTableFormat === 'csv') {
      downloadCSVFromTable();
      setShowConfirmationBox(false);
    }
    else if (exportTableFormat === 'excel') {
      exportTableToExcelTable()
      setShowConfirmationBox(false);
    }
    else if (exportTableFormat === 'pdf') {
      exportTableToPDFTable();
      setShowConfirmationBox(false);
    }
    else {
      return '';
    }
  }

  const summaryRow = {
    TotalLocation: report ? report.length : 0,
    CollectionFiles: report ? report.reduce((sum, elem) => sum + Number(elem?.CollectionFiles) || 0, 0) : 0,
    CollectionImages: report ? report.reduce((sum, elem) => sum + Number(elem?.CollectionImages) || 0, 0) : 0,
    ScannedFiles: report ? report.reduce((sum, elem) => sum + Number(elem?.ScannedFiles) || 0, 0) : 0,
    ScannedImages: report ? report.reduce((sum, elem) => sum + Number(elem?.ScannedImages) || 0, 0) : 0,
    QCFiles: report ? report.reduce((sum, elem) => sum + Number(elem?.QCFiles) || 0, 0) : 0,
    QCImages: report ? report.reduce((sum, elem) => sum + Number(elem?.QCImages) || 0, 0) : 0,
    IndexingFiles: report ? report.reduce((sum, elem) => sum + Number(elem?.IndexingFiles) || 0, 0) : 0,
    IndexingImages: report ? report.reduce((sum, elem) => sum + Number(elem?.IndexingImages) || 0, 0) : 0,
    CBSL_QAFiles: report ? report.reduce((sum, elem) => sum + Number(elem?.CBSL_QAFiles) || 0, 0) : 0,
    CBSL_QAImages: report ? report.reduce((sum, elem) => sum + Number(elem?.CBSL_QAImages) || 0, 0) : 0,
    Client_QAFiles: report ? report.reduce((sum, elem) => sum + Number(elem?.Client_QAFiles) || 0, 0) : 0,
    Client_QAImages: report ? report.reduce((sum, elem) => sum + Number(elem?.Client_QAImages) || 0, 0) : 0,
    Export_PdfFiles: report ? report.reduce((sum, elem) => sum + Number(elem?.Export_PdfFiles) || 0, 0) : 0,
    Export_PdfImages: report ? report.reduce((sum, elem) => sum + Number(elem?.Export_PdfImages) || 0, 0) : 0,
    Digi_SignFiles: report ? report.reduce((sum, elem) => sum + Number(elem?.Digi_SignFiles) || 0, 0) : 0,
    Digi_SignImages: report ? report.reduce((sum, elem) => sum + Number(elem?.Digi_SignImages) || 0, 0) : 0,
    InventoryFiles: report ? report.reduce((sum, elem) => sum + Number(elem?.InventoryFiles) || 0, 0) : 0,
    InventoryImages: report ? report.reduce((sum, elem) => sum + Number(elem?.InventoryImages) || 0, 0) : 0,

  };

  const fileDateTableHeaders = [
    'locationName',
    'Date',
    'CollectionFiles',
    'CollectionImages',
    'ScannedFiles',
    'ScannedImages',
    'QCFiles',
    'QCImages',
    'FlaggingFiles',
    'FlaggingImages',
    'IndexingFiles',
    'IndexingImages',
    'CBSL_QAFiles',
    'CBSL_QAImages',
    'Export_PdfFiles',
    'Export_PdfImages',
    'Client_QCFiles',
    'Client_QCImages',
    'Digi_SignFiles',
    'Digi_SignImages'
  ];
  function convertJSONToCSVDate(dateReport, columnHeaders) {
    if (dateReport.length === 0) return '';

    const headers = columnHeaders.join(',') + '\n';
    const rows = dateReport
      .map(row => columnHeaders.map(field => row[field] || '').join(','))
      .join('\n');

    return headers + rows;
  }
  function downloadCSVDate(dateJsonData, headers) {
    const csvData = convertJSONToCSVDate(dateJsonData, headers);
    if (csvData === '') {
      alert('No data to export');
    } else {
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'Datewisedetailedreport.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setShowConfirmationBoxDate(false);
  }
  const [lastSearchTime, setLastSearchTime] = useState(null);
  const [lastSearchParams, setLastSearchParams] = useState(null);

  const handleClick = async () => {


    // Validate date selection (if either start or end date is selected)
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
      fileType: selectedFileTypes.join(","),
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
    queryParams.filetype = selectedFileTypes.join(",");

    if (startDate && endDate) {
      queryParams.startDate = formatDate(startDate);
      queryParams.endDate = formatDate(endDate);
    }



    try {
      await Promise.all([
        // summaryData(queryParams),
        fetchReportData(queryParams),
        fetchDateReportData(queryParams),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data. Please try again.");
      // Reset search tracking on error
      setLastSearchTime(null);
      setLastSearchParams(null);
    } finally {
      setIsLoading(false); // hide loader
      setTotalLocations(selectedLocations.length>0?selectedLocations.length:totalLocations)
    }
  };



  return (
    <>
      {isLoading && <Loader />}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />



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
            <div className="row mt-2 me-1 search-report-card" >
              {!userRoles.includes("Cbsl User") && (
                <div className="col-xl-3 col-lg-4 col-md-2 col-sm-12 mt-1" style={{ position: "relative" }}>
                  <SearchBar
                    items={locations}
                    selectedItems={selectedLocations}
                    onChange={newSelected => setSelectedLocations(newSelected)}
                    placeholder="Search locations..."
                    showSelectAll={true}
                  />
                </div>
              )}

              <div className="col-lg-3 col-md-2 col-sm-12 mt-1">
                <SearchBar
                  items={fileType ? fileType.map((ft) => ft.filetype) : []}
                  selectedItems={selectedFileTypes}
                  onChange={(newSelected) =>
                    setSelectedFileTypes(newSelected)
                  }
                  placeholder="Search File Types..."
                  showSelectAll={true}
                  Name="Files"
                />
              </div>

              <div className="col-lg-4 col-md-8 col-sm-12 d-flex flex-wrap mt-1">
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
                <p
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
                </p>
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

              <div className="col-md-2 mt-2"><SearchButton onClick={handleClick} Name="Search" /></div>
            </div>
            <div className="row mt-3 me-1">
              <div
                className="row"
                style={{
                  padding: "0px",
                  backgroundColor: "#4BC0C0",
                  paddingTop: "6px",
                  marginLeft: "0",
                }}
              >
                <div className="col-10">
                  <h6 className="" style={{ color: "white" }}>
                    SUMMARY REPORT
                  </h6>
                </div>
                <div className="col-2">
                  <h6 style={{ color: "white", cursor: "pointer" }} onClick={() => setShowDropdown(!showDropdown)}>
                    <MdFileDownload style={{ fontSize: "20px" }} />
                    Export
                  </h6>

                </div>
                {showDropdown && (
                  <div style={{ height: '0px', overflow: 'visible', display: 'flex', justifyContent: 'right' }}>
                    <div className="export-dropdown-card">
                      <p onClick={() => handleDropdownChange('csv')}>CSV</p>
                      <p onClick={() => handleDropdownChange('excel')}>Excel</p>
                      <p onClick={() => handleDropdownChange('pdf')}>PDF</p>
                    </div>
                  </div>
                )}
                {showConfirmation && (
                  <div className="confirmation-dialog">
                    <div className="confirmation-content">
                      <p className="fw-bold">Are you sure you want to export the {exportFormat.toUpperCase()} file?</p>
                      <button className="btn btn-success mt-3 ms-5" onClick={() => {
                        downloadAllFormatsSummary([summaryRow], fileSummaryHeaders);
                      }}>Yes</button>
                      <button className="btn btn-danger ms-3 mt-3" onClick={handleCancelExport}>No</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="main-summary-card ">
                <div className="row">
                  {
                    <ReportCard
                      name="Coll. of Records"
                      nameFilesData="CollectionFiles"
                      nameImagesData="CollectionImages"
                      repo={report}
                    />
                  }

                  {
                    <ReportCard
                      name="Scanning ADF"
                      nameFilesData="ScannedFiles"
                      nameImagesData="ScannedImages"
                      repo={report}
                    />
                  }
                  {
                    <ReportCard
                      name="Image QC"
                      nameFilesData="QCFiles"
                      nameImagesData="QCImages"
                      repo={report}
                    />
                  }
                  {
                    <ReportCard
                      name="Doc Classification"
                      nameFilesData="FlaggingFiles"
                      nameImagesData="FlaggingImages"
                      repo={report}
                    />
                  }
                  {
                    <ReportCard
                      name="Indexing"
                      nameFilesData="IndexingFiles"
                      nameImagesData="IndexingImages"
                      repo={report}
                    />
                  }

                  {
                    <ReportCard
                      name="CBSL QA"
                      nameFilesData="CBSL_QAFiles"
                      nameImagesData="CBSL_QAImages"
                      repo={report}
                    />
                  }
                  {
                    <ReportCard
                      name="Client QA"
                      nameFilesData="Client_QAFiles"
                      nameImagesData="Client_QAImages"
                      repo={report}
                    />
                  }
                  {
                    <ReportCard
                      name="Export PDF"
                      nameFilesData="Export_PdfFiles"
                      nameImagesData="Export_PdfImages"
                      repo={report}
                    />
                  }
                  {
                    <ReportCard
                      name="Digi Sign"
                      nameFilesData="Digi_SignFiles"
                      nameImagesData="Digi_SignImages"
                      repo={report}
                    />
                  }
                  {
                    <ReportCard
                      name="Inventory Out"
                      nameFilesData="Inv_Out_Files"
                      nameImagesData="Inv_Out_Images"
                      repo={report}
                    />
                  }

                </div>
              </div>
            </div>
            <div className="row mt-3 me-1">
              <div className="table-card">
                <div
                  className="row"
                  style={{
                    padding: "0px",
                    backgroundColor: "#4BC0C0",
                    paddingTop: "6px",
                  }}
                >
                  <div className="col-10">
                    <h6 className="" style={{ color: "white" }}>
                      LOCATION WISE DETAILED CUMULATIVE REPORT
                    </h6>
                  </div>
                  <div className="col-2">
                    <h6 style={{ color: "white", cursor: "pointer" }} onClick={handleReportCsv}>
                      {" "}
                      <MdFileDownload style={{ fontSize: "20px" }} />
                      Export
                    </h6>

                  </div>
                  {showTableDropdown && (
                    <div style={{ height: '0px', overflow: 'visible', display: 'flex', justifyContent: 'right' }}>
                      <div className="export-dropdown-card">
                        <p onClick={() => handleTableDropdownChange('csv')}>CSV</p>
                        <p onClick={() => handleTableDropdownChange('excel')}>Excel</p>
                        <p onClick={() => handleTableDropdownChange('pdf')}>PDF</p>
                      </div>
                    </div>
                  )}
                  {showConfirmationBox && (
                    <div className="confirmation-dialog">
                      <div className="confirmation-content">
                        <p className="fw-bold">Are you sure you want to export {exportTableFormat.toUpperCase()} file?</p>
                        <button className="btn btn-success mt-3 ms-5" onClick={downloadAllFormats}>Yes</button>
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
                  <table className="table table-hover table-bordered table-responsive  data-table">
                    <thead
                      style={{ color: "#4bc0c0", fontWeight: '300', textAlign: 'center' }}
                    >
                      <tr>
                        <th rowSpan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle' }}>Location</th>
                        <th colSpan="2" style={{ verticalAlign: 'middle' }}>Collection of Records</th>
                        <th colSpan="2" style={{ verticalAlign: 'middle' }}>Scanning ADF</th>
                        <th colSpan="2" style={{ verticalAlign: 'middle' }}>Image QC</th>
                        <th colSpan="2" style={{ verticalAlign: 'middle' }}>Document Classification</th>
                        <th colSpan="2" style={{ verticalAlign: 'middle' }}>Indexing</th>
                        <th colSpan="2" style={{ verticalAlign: 'middle' }}>CBSL QA</th>
                        <th colSpan="2" style={{ verticalAlign: 'middle' }}>Client QA</th>
                        <th colSpan="2" style={{ verticalAlign: 'middle' }}>Export PDF</th>
                        <th colSpan="2" style={{ verticalAlign: 'middle' }}>Digi Sign</th>
                        <th colSpan="2" style={{ verticalAlign: 'middle' }}>Inventory Out</th>
                      </tr>
                      <tr
                        style={{ color: "#4BC0C0", fontWeight: '300' }}
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
                      style={{ color: "#4bc0c0", height: "80px" }}
                    >
                      {report &&
                        report.map((elem, index) =>
                        // {
                        // if (
                        //   selectedLocations.length === 0 ||
                        //   selectedLocations.includes(elem.LocationName)
                        // ) {
                        //   return 
                        (
                          <tr key={index} style={{ backgroundColor: "white" }}>
                            <td style={{ whiteSpace: 'nowrap', textAlign: 'left' }}>{elem.LocationName}</td>
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
                            <td>{isNaN(parseInt(elem.Client_QAFiles)) ? "0" : parseInt(elem.Client_QAFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Client_QAImages)) ? "0" : parseInt(elem.Client_QAImages).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Export_PdfFiles)) ? "0" : parseInt(elem.Export_PdfFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Export_PdfImages)) ? "0" : parseInt(elem.Export_PdfImages).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Digi_SignFiles)) ? "0" : parseInt(elem.Digi_SignFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Digi_SignImages)) ? "0" : parseInt(elem.Digi_SignImages).toLocaleString()}</td>
                            <td>0</td>
                            <td>0</td>
                          </tr>
                        ))
                      }
                      {/* //   return null;
                        // })} */}
                      <tr style={{ backgroundColor: "#f1f1f1", fontWeight: "bold" }}>
                        <td style={{ textAlign: "left" }}>Total</td>

                        <td>{Number(report?.reduce((sum, elem) => sum + Number(elem?.CollectionFiles) || 0, 0)).toLocaleString('en-IN')}</td>
                        <td>{Number(report?.reduce((sum, elem) => sum + Number(elem?.CollectionImages) || 0, 0)).toLocaleString('en-IN')}</td>

                        <td>{Number(report?.reduce((sum, elem) => sum + Number(elem?.ScannedFiles) || 0, 0)).toLocaleString('en-IN')}</td>
                        <td>{Number(report?.reduce((sum, elem) => sum + Number(elem?.ScannedImages) || 0, 0)).toLocaleString('en-IN')}</td>
                        <td>{Number(report?.reduce((sum, elem) => sum + Number(elem?.QCFiles) || 0, 0)).toLocaleString('en-IN')}</td>
                        <td>{Number(report?.reduce((sum, elem) => sum + Number(elem?.QCImages) || 0, 0)).toLocaleString('en-IN')}</td>
                        <td>{Number(report?.reduce((sum, elem) => sum + Number(elem?.FlaggingFiles) || 0, 0)).toLocaleString('en-IN')}</td>
                        <td>{Number(report?.reduce((sum, elem) => sum + Number(elem?.FlaggingImages) || 0, 0)).toLocaleString('en-IN')}</td>
                        <td>{Number(report?.reduce((sum, elem) => sum + Number(elem?.IndexingFiles) || 0, 0)).toLocaleString('en-IN')}</td>
                        <td>{Number(report?.reduce((sum, elem) => sum + Number(elem?.IndexingImages) || 0, 0)).toLocaleString('en-IN')}</td>
                        <td>{Number(report?.reduce((sum, elem) => sum + Number(elem?.CBSL_QAFiles) || 0, 0)).toLocaleString('en-IN')}</td>
                        <td>{Number(report?.reduce((sum, elem) => sum + Number(elem?.CBSL_QAImages) || 0, 0)).toLocaleString('en-IN')}</td>
                        <td>{Number(report?.reduce((sum, elem) => sum + Number(elem?.Client_QAFiles) || 0, 0)).toLocaleString('en-IN')}</td>
                        <td>{Number(report?.reduce((sum, elem) => sum + Number(elem?.Client_QAImages) || 0, 0)).toLocaleString('en-IN')}</td>
                        <td>{Number(report?.reduce((sum, elem) => sum + Number(elem?.Export_PdfFiles) || 0, 0)).toLocaleString('en-IN')}</td>
                        <td>{Number(report?.reduce((sum, elem) => sum + Number(elem?.Export_PdfImages) || 0, 0)).toLocaleString('en-IN')}</td>
                        <td>{Number(report?.reduce((sum, elem) => sum + Number(elem?.Digi_SignFiles) || 0, 0)).toLocaleString('en-IN')}</td>
                        <td>{Number(report?.reduce((sum, elem) => sum + Number(elem?.Digi_SignImages) || 0, 0)).toLocaleString('en-IN')}</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {selectedLocations && startDate && endDate ? (
              <>
                <div className="row mt-3 me-1">
                  <div className="table-card">
                    <div
                      className="row"
                      style={{
                        padding: "0px",
                        backgroundColor: "#4BC0C0",
                        paddingTop: "6px",
                      }}
                    >
                      <div className="col-10">
                        <h6 className="" style={{ color: "white" }}>
                          DATE WISE DETAILED REPORT
                        </h6>
                      </div>
                      <div className="col-2">
                        <h6 style={{ color: "white", cursor: "pointer" }} onClick={handleDateReportCsv}>
                          {" "}
                          <MdFileDownload style={{ fontSize: "20px" }} />
                          Export
                        </h6>
                      </div>

                      {showConfirmationBoxDate && (
                        <div className="confirmation-dialog">
                          <div className="confirmation-content">
                            <p className="fw-bold">Are you sure you want to export the CSV file?</p>
                            <button className="btn btn-success mt-3 ms-5" onClick={() => {
                              downloadCSVDate(dateReport, fileDateTableHeaders);
                            }}>Yes</button>
                            <button className="btn btn-danger ms-3 mt-3" onClick={handleDateReportCancelExport}>No</button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div
                      className="row mt-3 ms-2 me-2"
                      style={{ overflowX: "auto", maxHeight: '500px' }}
                    >
                      <h5 className="mt-1 mb-2">Total Locations: {totalLocations}</h5>
                      <table className="table table-hover table-bordered table-responsive date-table">
                        <thead
                          style={{ color: "black", fontWeight: '300', textAlign: 'center' }}
                        >
                          <tr>
                            <th rowSpan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle' }}>Location</th>
                            <th rowSpan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle' }}>Date</th>
                            <th colSpan="2" style={{ verticalAlign: 'middle' }}>Collection of Records</th>
                            <th colSpan="2" style={{ verticalAlign: 'middle' }}>Scanning ADF</th>
                            <th colSpan="2" style={{ verticalAlign: 'middle' }}>Image QC</th>
                            <th colSpan="2" style={{ verticalAlign: 'middle' }}>Document Classification</th>
                            <th colSpan="2" style={{ verticalAlign: 'middle' }}>Indexing</th>
                            <th colSpan="2" style={{ verticalAlign: 'middle' }}>CBSL QA</th>
                            <th colSpan="2" style={{ verticalAlign: 'middle' }}>Client QA</th>
                            <th colSpan="2" style={{ verticalAlign: 'middle' }}>Export PDF</th>
                            <th colSpan="2" style={{ verticalAlign: 'middle' }}>Digi Sign</th>
                            <th colSpan="2" style={{ verticalAlign: 'middle' }}>Inventory Out</th>
                          </tr>
                          <tr
                            style={{ color: "#4BC0C0", fontWeight: '300' }}
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
                          style={{ color: "black", height: "80px" }}
                        >
                          {dateReport && dateReport.length > 0 ? (
                            dateReport.map((elem, index) => {
                              if (
                                selectedLocations.length === 0 ||
                                selectedLocations.includes(elem.locationName)
                              ) {
                                return (
                                  <tr key={index} style={{ backgroundColor: "white" }}>
                                    <td style={{ whiteSpace: 'nowrap', textAlign: 'left' }}>{elem.locationName}</td>
                                    <td style={{ whiteSpace: 'nowrap', textAlign: 'left' }}>{elem.Date ? new Date(elem.Date).toLocaleDateString("en-GB") : "N/A"}</td>
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
                                    <td>{isNaN(parseInt(elem.Client_QCFiles)) ? "0" : parseInt(elem.Client_QCFiles).toLocaleString()}</td>
                                    <td>{isNaN(parseInt(elem.Client_QCImages)) ? "0" : parseInt(elem.Client_QCImages).toLocaleString()}</td>
                                    <td>{isNaN(parseInt(elem.Export_PdfFiles)) ? "0" : parseInt(elem.Export_PdfFiles).toLocaleString()}</td>
                                    <td>{isNaN(parseInt(elem.Export_PdfImages)) ? "0" : parseInt(elem.Export_PdfImages).toLocaleString()}</td>
                                    <td>{Number(elem?.Digi_SignFiles) ? Number(elem.Digi_SignFiles).toLocaleString('en-IN') : '0'}</td>
                                    <td>{Number(elem?.Digi_SignImages) ? Number(elem.Digi_SignImages).toLocaleString('en-IN') : '0'}</td>
                                    <td>0</td>
                                    <td>0</td>
                                  </tr>
                                );
                              }
                              return null;
                            })
                          ) : (
                            <tr>
                              <td colSpan="20" style={{ textAlign: 'center' }}>No data available</td>
                            </tr>
                          )}
                        </tbody>

                      </table>
                    </div>
                  </div>
                </div>
              </>

            ) : <></>}

          </div>
        </div>
      </div>


    </>
  );
};

export default Report;
