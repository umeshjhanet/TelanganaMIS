import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import axios from "axios";
import { MdFileDownload } from "react-icons/md";
import { API_URL } from "./Api";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaChevronDown } from "react-icons/fa";


const Report = () => {
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
  //  const filedropdownRef = useRef(null);
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


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLocation(false);
      }
      if (filedropdownRef.current && !filedropdownRef.current.contains(event.target)) {
        setShowFileType(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
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


  // const handleFileKeyDown = (e) => {

  // }


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


  const filedropdownRef = useRef(null);
  const dropdownMenuRef = useRef(null);

  const filteredFileTypes =
    fileType && Array.isArray(fileType)
      ? fileType.filter(item =>
        item.filetype.toLowerCase().includes(fileTypeSearchInput.toLowerCase())
      )
      : [];


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

  const handleFileKeyDown = (e) => {
    if (!showFileType) {
      setShowFileType(true);
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => {
          const newIndex = prev < filteredFileTypes.length - 1 ? prev + 1 : prev;

          if (dropdownMenuRef.current && newIndex !== prev) {
            const highlightedElement =
              dropdownMenuRef.current.children[newIndex];
            if (highlightedElement) {
              highlightedElement.scrollIntoView({
                block: "nearest",
                behavior: "smooth",
              });
            }
          }

          return newIndex;
        });
        break;

      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => {
          const newIndex = prev > 0 ? prev - 1 : -1;

          if (dropdownMenuRef.current && newIndex !== prev && newIndex >= 0) {
            const highlightedElement =
              dropdownMenuRef.current.children[newIndex];
            if (highlightedElement) {
              highlightedElement.scrollIntoView({
                block: "nearest",
                behavior: "smooth",
              });
            }
          }

          return newIndex;
        });
        break;

      case "Enter":
        e.preventDefault();
        if (filteredFileTypes.length === 1) {
          handleFileType(filteredFileTypes[0].filetype);
          return;
        }
        if (highlightedIndex >= 0 && filteredFileTypes[highlightedIndex]) {
          handleFileType(filteredFileTypes[highlightedIndex].filetype);
        }
        break;

      case "Backspace":
        if (fileTypeSearchInput === "" && selectedFileTypes.length > 0) {
          removeFileType(selectedFileTypes[selectedFileTypes.length - 1]);
        }
        break;

      case "Escape":
        setShowFileType(false);
        setHighlightedIndex(-1);
        break;

      default:
        break;
    }
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
  const fetchDateReportData = async () => {
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



      setIsLoading(true);
      const response = await axios.get(apiUrl, { params: queryParams });

      setDateReport(response.data);
      setIsLoading(false);
      updateTotalLocations(response.data);
    } catch (error) {
      console.error("Error fetching report data:", error);
      setError("Error fetching report data. Please try again.");
      setIsLoading(false);
    }
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
  useEffect(() => {
    const locationName = selectedLocations;
    const fileType = selectedFileTypes;


    const fetchFileTypes = () => {
      setIsLoading(true);
      axios.get(`${API_URL}/summaryfiletype`)
        .then(response => {
          setfileType(response.data)
          setIsLoading(false);
        })
        .catch(error => console.error(error));
      setIsLoading(false);
    }
    fetchLocation();
    // summaryData();
    fetchReportData();
    if (startDate && endDate) {
      fetchDateReportData();
    }
    fetchFileTypes();
  }, []);

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
    const table = document.querySelector(".data-table"); // Select the table by class
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
    }
  };


  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

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
            <div className="row mt-2 me-1 search-report-card" >
              <div className="col-lg-3 col-md-2 col-sm-12 mt-1" style={{ position: "relative" }}>
                <div
                  ref={dropdownRef}
                  className="search-bar"
                  style={{
                    border: "1px solid #000",
                    padding: "5px",
                    borderRadius: "5px",
                    minHeight: "30px",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    position: "relative",
                    width: "242px"
                  }}
                  onClick={() => setShowLocation(true)}
                >
                  {selectedLocations.map((location, index) => (
                    <span key={index} className="selected-location" style={{ backgroundColor: "#f1ececff", padding: "5px", borderRadius: "5px", margin: "2px", display: "inline-block" }}>
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
                      paddingRight: "25px" // Add padding to prevent text overlapping the icon
                    }}
                  />

                  {/* FaChevronDown icon with fixed position */}
                  <FaChevronDown
                    style={{
                      color: 'grey',
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none' // Makes the icon non-interactive
                    }}
                  />
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
                      maxHeight: '200px',
                      overflowY: 'auto',
                      top: '100%',
                      marginLeft: '1px',
                      marginTop: '3px',

                    }}
                  >

                    {filteredLocations.map((location, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '8px 12px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #eee',
                          backgroundColor: index === highlightedIndex ? '#f0f0f0' : 'transparent',
                        }}
                        onClick={() => handleLocation(location)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                      >
                        {location}
                      </div>
                    ))}
                    {filteredLocations.length === 0 && (
                      <div style={{ padding: '8px 12px', color: '#999' }}>
                        No locations found
                      </div>
                    )}
                  </div>
                )}
              </div>



              <div className="col-lg-3 col-md-2 col-sm-12 mt-1">
                <div
                  ref={filedropdownRef}
                  className="search-bar"
                  style={{
                    border: "1px solid #000",
                    padding: "5px",
                    borderRadius: "5px",
                    minHeight: "30px",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    position: "relative"
                  }}
                  onClick={() => setShowFileType(true)}
                >


                  {selectedFileTypes.map((fileType, index) => (
                    <span
                      key={index}
                      className="selected-location"
                      style={{
                        backgroundColor: '#f1ececff',
                        padding: '5px',
                        borderRadius: '5px',
                        margin: '2px',
                        display: 'inline-block',

                      }}
                    >
                      {fileType}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFileType(fileType);
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
                          cursor: 'pointer',
                        }}
                      >
                        ×
                      </button>
                      &nbsp;
                    </span>
                  ))}

                  <input
                    type="text"
                    placeholder={selectedFileTypes.length === 0 ? "Search File Type..." : ""}
                    value={fileTypeSearchInput}
                    onChange={(e) => {
                      setFileTypeSearchInput(e.target.value);
                      setShowFileType(true);
                    }}
                    onKeyDown={handleFileKeyDown}
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



                {showFileType && (
                  <div
                    className="location-card"
                    ref={dropdownMenuRef}
                    style={{
                      position: "absolute",
                      width: "242px",
                      backgroundColor: "white",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      minHeight: "170px",
                      overflowY: "auto",
                      zIndex: 1000,
                      marginTop: "2px",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                      maxHeight: "200px"

                    }}
                  >
                    {filteredFileTypes.length > 0 ? (
                      filteredFileTypes.map((item, index) => (
                        <div
                          key={index}
                          style={{
                            padding: "8px 12px",
                            cursor: "pointer",
                            borderBottom: "1px solid #eee",
                            backgroundColor:
                              index === highlightedIndex ? "#f0f0f0" : "transparent",
                          }}
                          onClick={() => handleFileType(item.filetype)}
                          onMouseEnter={() => setHighlightedIndex(index)}
                        >
                          {item.filetype}
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: "8px 12px", color: "#999" }}>
                        No file types available
                      </div>
                    )}
                  </div>
                )}
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

              <div className="col-md-2"><button className="btn add-btn" onClick={handleClick}>Search</button></div>
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
                    <div className="col-lg-2 col-md-4 col-sm-6">
                      <div className="summary-card mt-3">
                        <div className="summary-title">
                          <h6 className="mt-2" style={{ textTransform: "capitalize" }}>
                            Coll. of Records
                          </h6>
                        </div>
                        <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>

                          Files: {Number(report?.reduce((sum, elem) => sum + Number(elem?.CollectionFiles) || 0, 0)).toLocaleString('en-IN')}
                          <br />

                          Images: {Number(report?.reduce((sum, elem) => sum + Number(elem?.CollectionImages) || 0, 0)).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                  }

                  {

                    <div className="col-lg-2 col-md-4 col-sm-6">
                      <div className="summary-card mt-3">
                        <div className="summary-title">
                          <h6 style={{ textTransform: "capitalize" }}>
                            Scanning ADF
                          </h6>
                        </div>
                        <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>


                          Files: {Number(report?.reduce((sum, elem) => sum + Number(elem?.ScannedFiles) || 0, 0)).toLocaleString('en-IN')}
                          <br />

                          Images: {Number(report?.reduce((sum, elem) => sum + Number(elem?.ScannedImages) || 0, 0)).toLocaleString('en-IN')}
                        </p>

                      </div>
                    </div>

                  }
                  {

                    <div className="col-lg-2 col-md-4 col-sm-6">
                      <div className="summary-card mt-3">
                        <div className="summary-title">
                          <h6 style={{ textTransform: "capitalize" }}>
                            Image QC
                          </h6>
                        </div>
                        <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>

                          Files: {Number(report?.reduce((sum, elem) => sum + Number(elem?.QCFiles) || 0, 0)).toLocaleString('en-IN')}
                          <br />
                          Images: {Number(report?.reduce((sum, elem) => sum + Number(elem?.QCImages) || 0, 0)).toLocaleString('en-IN')}
                        </p>

                      </div>
                    </div>

                  }
                  {

                    <div className="col-lg-2 col-md-4 col-sm-6">
                      <div className="summary-card mt-3">
                        <div className="summary-title">
                          <h6 className="mt-2" style={{ textTransform: "capitalize" }}>
                            Doc Classification
                          </h6>
                        </div>
                        <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>


                          Files: {Number(report?.reduce((sum, elem) => sum + Number(elem?.FlaggingFiles) || 0, 0)).toLocaleString('en-IN')}
                          <br />
                          Images: {Number(report?.reduce((sum, elem) => sum + Number(elem?.FlaggingImages) || 0, 0)).toLocaleString('en-IN')}
                        </p>

                      </div>
                    </div>

                  }
                  {

                    <div className="col-lg-2 col-md-4 col-sm-6">
                      <div className="summary-card mt-3">
                        <div className="summary-title">
                          <h6 style={{ textTransform: "capitalize" }}>
                            Indexing
                          </h6>
                        </div>
                        <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>

                          Files: {Number(report?.reduce((sum, elem) => sum + Number(elem?.IndexingFiles) || 0, 0)).toLocaleString('en-IN')}
                          <br />
                          Images: {Number(report?.reduce((sum, elem) => sum + Number(elem?.IndexingImages) || 0, 0)).toLocaleString('en-IN')}

                        </p>

                      </div>
                    </div>

                  }
                  {

                    <div className="col-lg-2 col-md-4 col-sm-6">
                      <div className="summary-card mt-3">
                        <div className="summary-title">
                          <h6 style={{ textTransform: "capitalize" }}>
                            CBSL QA
                          </h6>
                        </div>
                        <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>

                          Files: {Number(report?.reduce((sum, elem) => sum + Number(elem?.CBSL_QAFiles) || 0, 0)).toLocaleString('en-IN')}
                          <br />
                          Images: {Number(report?.reduce((sum, elem) => sum + Number(elem?.CBSL_QAImages) || 0, 0)).toLocaleString('en-IN')}

                        </p>

                      </div>
                    </div>

                  }
                  {

                    <div className="col-lg-2 col-md-4 col-sm-6">
                      <div className="summary-card mt-3">
                        <div className="summary-title">
                          <h6 style={{ textTransform: "capitalize" }}>
                            Client QA
                          </h6>
                        </div>
                        <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>

                          Files: {Number(report?.reduce((sum, elem) => sum + Number(elem?.Client_QAFiles) || 0, 0)).toLocaleString('en-IN')}
                          <br />
                          Images: {Number(report?.reduce((sum, elem) => sum + Number(elem?.Client_QAImages) || 0, 0)).toLocaleString('en-IN')}

                        </p>


                      </div>
                    </div>

                  }
                  {

                    <div className="col-lg-2 col-md-4 col-sm-6">
                      <div className="summary-card mt-3">
                        <div className="summary-title">
                          <h6 style={{ textTransform: "capitalize" }}>
                            Export PDF
                          </h6>
                        </div>
                        <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>

                          Files: {Number(report?.reduce((sum, elem) => sum + Number(elem?.Export_PdfFiles) || 0, 0)).toLocaleString('en-IN')}
                          <br />
                          Images: {Number(report?.reduce((sum, elem) => sum + Number(elem?.Export_PdfImages) || 0, 0)).toLocaleString('en-IN')}
                        </p>

                      </div>
                    </div>

                  }

                  {

                    <div className="col-lg-2 col-md-4 col-sm-6">
                      <div className="summary-card mt-3">
                        <div className="summary-title">
                          <h6 style={{ textTransform: "capitalize" }}>
                            Digi Sign
                          </h6>
                        </div>
                        <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>

                          Files: {Number(report?.reduce((sum, elem) => sum + Number(elem?.Digi_SignFiles) || 0, 0)).toLocaleString('en-IN')}
                          <br />
                          Images: {Number(report?.reduce((sum, elem) => sum + Number(elem?.Digi_SignImages) || 0, 0)).toLocaleString('en-IN')}
                        </p>

                      </div>
                    </div>

                  }
                  {
                    summary && (
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
                                <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>
                                  Files: {elem.Inv_Out_Files} <br />
                                  Images: {elem.Inv_Out_Images}
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
                              <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>
                                Files:{" "}
                                {selectedLocations.reduce((acc, location) => {
                                  const locationData = report.find((elem) => elem.LocationName === location);
                                  return acc + (locationData ? parseInt(locationData.Inv_Out_Files) || 0 : 0);
                                }, 0).toLocaleString()}
                                <br />
                                Images:{" "}
                                {selectedLocations.reduce((acc, location) => {
                                  const locationData = report.find((elem) => elem.LocationName === location);
                                  return acc + (locationData ? parseInt(locationData.Inv_Out_Images) || 0 : 0);
                                }, 0).toLocaleString()}
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
                  <table class="table table-hover table-bordered table-responsive  data-table">
                    <thead
                      style={{ color: "#4bc0c0", fontWeight: '300', textAlign: 'center' }}
                    >
                      <tr>
                        <th rowspan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle' }}>Location</th>
                        <th colspan="2" style={{ verticalAlign: 'middle' }}>Collection of Records</th>
                        <th colspan="2" style={{ verticalAlign: 'middle' }}>Scanning ADF</th>
                        <th colspan="2" style={{ verticalAlign: 'middle' }}>Image QC</th>
                        <th colspan="2" style={{ verticalAlign: 'middle' }}>Document Classification</th>
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
                      <table class="table table-hover table-bordered table-responsive date-table">
                        <thead
                          style={{ color: "black", fontWeight: '300', textAlign: 'center' }}
                        >
                          <tr>
                            <th rowspan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle' }}>Location</th>
                            <th rowspan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle' }}>Date</th>
                            <th colspan="2" style={{ verticalAlign: 'middle' }}>Collection of Records</th>
                            <th colspan="2" style={{ verticalAlign: 'middle' }}>Scanning ADF</th>
                            <th colspan="2" style={{ verticalAlign: 'middle' }}>Image QC</th>
                            <th colspan="2" style={{ verticalAlign: 'middle' }}>Document Classification</th>
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
                                    {/* <td>{isNaN(parseInt(elem.Digi_SignFiles)) ? "0" : parseInt(elem.Digi_SignFiles).toLocaleString()}</td>
                                    <td>{isNaN(parseInt(elem.Digi_SignImages)) ? "0" : parseInt(elem.Digi_SignImages).toLocaleString()}</td> */}
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
      <Footer />

    </>
  );
};

export default Report;
