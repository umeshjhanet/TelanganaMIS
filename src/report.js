import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "./Components/Header";
import Footer from "./Footer";
import axios from "axios";
import { MdFileDownload } from "react-icons/md";
import { API_URL } from "./Api";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
  const filedropdownRef = useRef(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showConfirmationBox, setShowConfirmationBox] = useState(false);
  const [showConfirmationBoxDate, setShowConfirmationBoxDate] = useState(false);
  const [totalLocations, setTotalLocations] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [showTableDropdown, setShowTableDropdown] = useState(false);
  const [exportTableFormat, setExportTableFormat] = useState('csv');

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
  const handleFileType = (fileType) => {
    if (!selectedFileTypes.includes(fileType)) {
      setSelectedFileTypes([...selectedFileTypes, fileType]);
      setSearchInput("");
    }
    setShowFileType(false); // Close the dropdown when a FileType is selected
  };
  const removeFileType = (fileType) => {
    setSelectedFileTypes(
      selectedFileTypes.filter((loc) => loc !== fileType)
    );
  };
  const handleExport = () => {
    setShowDropdown(!showDropdown);
  };
  const handleConfirmedExport = async () => {
    setShowConfirmation(false);
    const formatDate = (date) => {

      const jsdate = new Date(date);
      const year = jsdate.getFullYear();
      const month = (jsdate.getMonth() + 1).toString().padStart(2, '0');
      const day = jsdate.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    let formattedStartDate = '';
    let formattedEndDate = '';
    if (startDate && endDate) {
      formattedStartDate = formatDate(startDate);
      formattedEndDate = formatDate(endDate);
    }

    const params = {
      locationName: selectedLocations, // Add your location names
      startDate: formattedStartDate, // Replace with actual start date
      endDate: formattedEndDate, // Replace with actual end date
      format: exportFormat
    };

    try {
      const response = await axios.get(`${API_URL}/summarycsv`, {
        params,
        responseType: 'blob' // Important for file downloads
      });

      // Create a link element and use it to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      let filename = '';
      if (exportFormat === 'excel') filename = `summary.xlsx`;
      else filename = `summary.${exportFormat}`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting file:', error);
    }
  };

  const handleCancelExport = () => {
    setShowConfirmation(false);
  };

  const handleDropdownChange = (format) => {
    setExportFormat(format);
    setShowConfirmation(true);
  };

  const handleTableDropdownChange = (format) => {
    setExportTableFormat(format);
    setShowConfirmationBox(true);
  };

  const handleReportCsv = () => {
    setShowTableDropdown(!showTableDropdown);
  };

  const handleReportCsvConfirmation = async () => {
    console.log("Confirmation button clicked");
    try {
      const userLog = JSON.parse(localStorage.getItem("user"));
      console.log("User data retrieved from localStorage:", userLog);

      // Declare the CSV fetching function
      let fetchDataFunction;

      // Check if the user has a specific location assigned and is a "Cbsl User"
      if (userLog.locations && userLog.locations.length === 1 && userLog.locations[0].id && userLog.user_roles.includes("Cbsl User")) {
        // If user has a specific location, call the location-specific function
        fetchDataFunction = fetchSummaryReportTableCsvFileLocation;
        console.log("Using fetchSummaryReportTableCsvFileLocation");
      } else {
        // Otherwise, call the general function
        fetchDataFunction = fetchSummaryReportTableCsvFile;
        console.log("Using fetchSummaryReportTableCsvFile");
      }

      // Pass the export format as a parameter to the function
      const reportCsv = await fetchDataFunction({ format: exportTableFormat });
      console.log("Report CSV data fetched:", reportCsv);

      if (reportCsv) {
        // Create a link element to download the file with the correct format extension
        const link = document.createElement("a");
        link.href = reportCsv;
        let filename = '';
        if (exportTableFormat === 'excel') filename = `LocationWiseDetailedReport.xlsx`;
        else filename = `LocationWiseDetailedReport.${exportTableFormat}`;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log("File download triggered");
      } else {
        console.error("No CSV data available for download.");
      }

      // Hide the confirmation box after the download
      setShowConfirmationBox(false);
    } catch (error) {
      console.error("Error during CSV export:", error);
      setError("Error during CSV export. Please try again.");
    }
  };


  const handleReportCancelExport = () => {
    setShowConfirmationBox(false);
  };

  const handleDateReportCsv = () => {
    setShowConfirmationBox(true);
  };


  const handleDateReportCsvConfirmation = async () => {
    try {
      fetchDateSummaryReportTableCsvFile();
      if (dateReportCsv) {
        const link = document.createElement("a");
        link.href = dateReportCsv;
        link.setAttribute("download", "LocationWiseDetailedReport.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setShowConfirmationBox(false);
    } catch (error) {
      console.error("Error during CSV export:", error);
      setError("Error during CSV export. Please try again.");
    }
  };


  const handleDateReportCancelExport = () => {
    setShowConfirmationBox(false);
  };



  const fetchSummaryReportCsvFile = async (locationName, startDate, endDate) => {
    const formattedStartDate = startDate ? new Date(startDate) : null;
    const formattedEndDate = endDate ? new Date(endDate) : null;
    const formatDate = (date) => {
      // Format to YYYY-MM-DD
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    let apiUrl = `${API_URL}/summarycsv`;
    if (locationName && formattedStartDate && formattedEndDate) {
      apiUrl += `?${locationName.map(name => `locationName=${name}`).join("&")}&startDate=${formatDate(formattedStartDate)}&endDate=${formatDate(formattedEndDate)}`;
    } else if (locationName) {
      apiUrl += `?${locationName.map(name => `locationName=${name}`).join("&")}`;
    } else if (formattedStartDate && formattedEndDate) {
      apiUrl += `?startDate=${formatDate(formattedStartDate)}&endDate=${formatDate(formattedEndDate)}`;
    }

    try {
      const response = await axios.get(apiUrl, { responseType: "blob" });
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      setCsv(url);
    } catch (error) {
      console.error("Error in exporting data:", error);
    }
  };

  const fetchSummaryReportTableCsvFile = async ({ locationName, startDate, endDate, format }) => {
    // Format dates to YYYY-MM-DD
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Prepare API URL
    let apiUrl = `${API_URL}/reporttablecsv`;

    const params = [];
    if (locationName && locationName.length > 0) {
      params.push(locationName.map(name => `locationName=${name}`).join("&"));
    }
    if (startDate) {
      params.push(`startDate=${formatDate(new Date(startDate))}`);
    }
    if (endDate) {
      params.push(`endDate=${formatDate(new Date(endDate))}`);
    }
    if (format) {
      params.push(`format=${format}`);
    }

    if (params.length > 0) {
      apiUrl += `?${params.join("&")}`;
    }

    try {
      console.log("Fetching CSV report from URL:", apiUrl); // Debugging log
      const response = await axios.get(apiUrl, { responseType: "blob" });

      // Create a Blob and generate a URL for download
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      return url; // Return the generated URL
    } catch (error) {
      console.error("Error in exporting data:", error);
      throw error; // Re-throw the error so it can be handled by the caller
    }
  };
  const fetchDateSummaryReportTableCsvFile = async (locationName, startDate, endDate) => {
    const formattedStartDate = startDate ? new Date(startDate) : null;
    const formattedEndDate = endDate ? new Date(endDate) : null;
    const formatDate = (date) => {
      // Format to YYYY-MM-DD
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    let apiUrl = `${API_URL}/datewisereportcsv`;
    if (locationName && formattedStartDate && formattedEndDate) {
      apiUrl += `?${locationName.map(name => `locationName=${name}`).join("&")}&startDate=${formatDate(formattedStartDate)}&endDate=${formatDate(formattedEndDate)}`;
    } else if (locationName) {
      apiUrl += `?${locationName.map(name => `locationName=${name}`).join("&")}`;
    } else if (formattedStartDate && formattedEndDate) {
      apiUrl += `?startDate=${formatDate(formattedStartDate)}&endDate=${formatDate(formattedEndDate)}`;
    }

    try {
      const response = await axios.get(apiUrl, { responseType: "blob" });
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      setDateReportCsv(url);
    } catch (error) {
      console.error("Error in exporting data:", error);
    }
  };
  const fetchSummaryReportCsvFileLocation = async (startDate, endDate) => {
    try {
      // Get user information from localStorage
      const userLog = JSON.parse(localStorage.getItem('user'));

      // Check if the user has a specific location assigned
      let locationName = null;
      if (userLog.locations && userLog.locations.length === 1 && userLog.locations[0].id && userLog.user_roles.includes("Cbsl User")) {
        locationName = userLog.locations[0].name;
      }

      // Convert start and end dates to the correct format if provided
      const formatDate = (date) => {
        // Format to YYYY-MM-DD
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      let apiUrl = `${API_URL}/summarycsv`;
      const queryParams = [];

      if (locationName) {
        queryParams.push(`locationName=${locationName}`);
      }
      if (startDate) {
        queryParams.push(`startDate=${formatDate(startDate)}`);
      }
      if (endDate) {
        queryParams.push(`endDate=${formatDate(endDate)}`);
      }

      // If there are any query parameters, append them to the URL
      if (queryParams.length > 0) {
        apiUrl += `?${queryParams.join("&")}`;
      }

      console.log("CSV API URL:", apiUrl); // Log the constructed API URL

      const response = await axios.get(apiUrl, { responseType: "blob" });
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      setCsv(url);

    } catch (error) {
      console.error("Error in exporting data:", error);
      setError("Error in exporting data. Please try again.");
    }
  };

  const fetchSummaryReportTableCsvFileLocation = async (startDate, endDate) => {
    try {
      // Get user information from localStorage
      const userLog = JSON.parse(localStorage.getItem('user'));

      // Check if the user has a specific location assigned
      let locationName = null;
      if (userLog.locations && userLog.locations.length === 1 && userLog.locations[0].id && userLog.user_roles.includes("Cbsl User")) {
        locationName = userLog.locations[0].name;
      }

      // Convert start and end dates to the correct format if provided
      const formatDate = (date) => {
        // Format to YYYY-MM-DD
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      // Construct the API URL with default locationName parameter
      let apiUrl = `${API_URL}/reporttablecsv`;
      const queryParams = [];

      // Always include locationName if available
      if (locationName) {
        queryParams.push(`locationName=${locationName}`);
      }

      // Include startDate and endDate if provided
      if (startDate) {
        queryParams.push(`startDate=${formatDate(startDate)}`);
      }
      if (endDate) {
        queryParams.push(`endDate=${formatDate(endDate)}`);
      }

      // Append query parameters to the apiUrl if any
      if (queryParams.length > 0) {
        apiUrl += `?${queryParams.join("&")}`;
      }

      console.log("Report Table CSV API URL:", apiUrl); // Log the constructed API URL

      const response = await axios.get(apiUrl, { responseType: "blob" });
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      setReportCsv(url);

    } catch (error) {
      console.error("Error in exporting data:", error);
      setError("Error in exporting data. Please try again.");
    }
  };

  useEffect(() => {
    const locationName = selectedLocations;
    const fileType = selectedFileTypes;

    const formatDate = (date) => {
      // Format to YYYY-MM-DD
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const summaryData = async () => {
      try {
        const queryParams = {};

        // Optional: Fetch user info from localStorage
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
        if (fileType) {
          queryParams.fileType = selectedFileTypes;
        }

        const response = await axios.get(`${API_URL}/summary`, { params: queryParams });
        setSummary(response.data);
      } catch (error) {
        console.error("Error fetching summary data:", error);
        // Handle error state or display error message to user
      }
    };
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
        if (fileType) {
          queryParams.fileType = selectedFileTypes;
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

        console.log("API URL:", apiUrl); // Log the constructed API URL
        console.log("Query Params:", queryParams); // Log query parameters

        setIsLoading(true);
        const response = await axios.get(apiUrl, { params: queryParams });
        console.log("API Response:", response.data); // Log the API response
        setDateReport(response.data);
        setIsLoading(false);
        updateTotalLocations(response.data);
      } catch (error) {
        console.error("Error fetching report data:", error);
        setError("Error fetching report data. Please try again.");
        setIsLoading(false);
      }
    };

    const fetchReports = async (locationName, startDate, endDate) => {
      const userLog = JSON.parse(localStorage.getItem('user'));
      let locations = [];

      if (userLog && userLog.locations && userLog.locations.length === 1 && userLog.user_roles.includes("Cbsl User")) {
        locations = [userLog.locations[0].name];
      }

      // Ensure locationName is an array or set it to an empty array if not
      if (!Array.isArray(locationName)) {
        locationName = [locationName]; // Convert to array if it's not already
      }

      // Concatenate user's location if available
      const finalLocations = [...new Set([...locationName, ...locations])];

      await Promise.all([
        fetchSummaryReportTableCsvFileLocation(finalLocations, startDate, endDate),
        fetchSummaryReportCsvFileLocation(finalLocations, startDate, endDate),
        fetchSummaryReportTableCsvFile(finalLocations, startDate, endDate),
        fetchSummaryReportCsvFile(finalLocations, startDate, endDate)
      ]);
    };

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

    fetchReports(locationName, startDate, endDate);
    summaryData();
    fetchReportData();
    fetchDateReportData();
    fetchFileTypes();
    fetchDateSummaryReportTableCsvFile(locationName, startDate, endDate);

  }, [selectedLocations, selectedFileTypes, endDate]);

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
    'FlaggingFiles',
    'FlaggingImages',
    'CBSL_QAFiles',
    'CBSL_QAImages',
    'Export_PdfFiles',
    'Export_PdfImages',
    'Client_QAFiles',
    'Client_QAImages',
    'Digi_SignFiles',
    'Digi_SignImages'
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
  const fileTableHeaders = [
    'LocationName',
    'CollectionFiles',
    'CollectionImages',
    'ScannedFiles',
    'ScannedImages',
    'QCFiles',
    'QCImages',
    'FlaggingFiles',
    'FlaggingImages',
    'CBSL_QAFiles',
    'CBSL_QAImages',
    'Export_PdfFiles',
    'Export_PdfImages',
    'Client_QAFiles',
    'Client_QAImages',
    'Digi_SignFiles',
    'Digi_SignImages'
  ];
  function convertJSONToCSVTable(report, columnHeaders) {
    if (report.length === 0) return '';

    const headers = columnHeaders.join(',') + '\n';
    const rows = report
      .map(row => columnHeaders.map(field => row[field] || '').join(','))
      .join('\n');

    return headers + rows;
  }
  function downloadCSV(jsonData, headers) {
    const csvData = convertJSONToCSVTable(jsonData, headers);
    if (csvData === '') {
      alert('No data to export');
    } else {
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'Locationwisedetailedreport.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
  function downloadExcel(jsonData, headers) {
    const worksheet = XLSX.utils.json_to_sheet(jsonData, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'Locationwisedetailedreport.xlsx');
  }
  function downloadPDF(jsonData, headers) {
    const doc = new jsPDF({
      orientation: 'l', // Landscape orientation to fit wide tables
      unit: 'mm',
      format: 'a2', // A4 paper size
    });

    doc.autoTable({
      head: [headers], // Table headers
      body: jsonData.map(row => headers.map(header => row[header] || '')), // Table rows
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
    doc.save('Locationwisedetailedreport.pdf');
  }
  function downloadAllFormats(jsonData, headers) {
    if (exportTableFormat === 'csv') {
      downloadCSV(jsonData, headers);
      setShowConfirmationBox(false);
    }
    else if (exportTableFormat === 'excel') {
      downloadExcel(jsonData, headers);
      setShowConfirmationBox(false);
    }
    else if (exportTableFormat === 'pdf') {
      downloadPDF(jsonData, headers);
      setShowConfirmationBox(false);
    }
    else {
      return '';
    }
  }
  const fileDateTableHeaders = [
    'LocationName',
    'Date',
    'CollectionFiles',
    'CollectionImages',
    'ScannedFiles',
    'ScannedImages',
    'QCFiles',
    'QCImages',
    'FlaggingFiles',
    'FlaggingImages',
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
            <div className="row mt-2 me-1 search-report-card" >
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
              <div className="col-lg-3 col-md-2 col-sm-12 mt-1">
                <div
                  ref={filedropdownRef}
                  className="search-bar"
                  style={{
                    border: "1px solid #000",
                    padding: "5px",
                    borderRadius: "5px",
                    minHeight: "30px",
                  }}

                  contentEditable={true}
                  onClick={() => setShowFileType(!showFileType)}
                >
                  {selectedFileTypes.length === 0 && !showFileType && (
                    <span className="placeholder-text">Search File Type...</span>
                  )}
                  {selectedFileTypes.map((FileType, index) => (
                    <span key={index} className="selected-location">
                      {FileType}
                      <button
                        onClick={() => removeFileType(FileType)}
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
                {showFileType && (
                  <div className="location-card">
                    {Array.isArray(fileType) && fileType.length > 0 ? (
                      fileType.map((item, index) => (
                        <div key={index}>
                          <p onClick={() => handleFileType(item.filetype)}>
                            {item.filetype}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No file types available</p>
                    )}
                  </div>
                )}
              </div>

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
                    color: 'white',
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
                  <h6 style={{ color: "white", cursor: "pointer" }} onClick={() => setShowDropdown(!showDropdown)}>
                    <MdFileDownload style={{ fontSize: "20px" }} />
                    Export CSV
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
                        downloadAllFormatsSummary(summary, fileSummaryHeaders);
                      }}>Yes</button>
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
                          <div className="col-lg-2 col-md-4 col-sm-6" key={index}>
                            <div className="summary-card mt-3">
                              <div className="summary-title">
                                <h6 className="mt-2" style={{ textTransform: "capitalize" }}>
                                  Coll. of Records
                                </h6>
                              </div>
                              <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>
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
                                Coll. of Records
                              </h6>
                            </div>
                            <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>
                              Total Files:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return acc + (locationData ? parseInt(locationData.CollectionFiles) || 0 : 0);
                              }, 0).toLocaleString()}
                              <br />
                              Total Images:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return acc + (locationData ? parseInt(locationData.CollectionImages) || 0 : 0);
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
                              <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>
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
                            <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>
                              Total Files:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return acc + (locationData ? parseInt(locationData.ScannedFiles) || 0 : 0);
                              }, 0).toLocaleString()}
                              <br />
                              Total Images:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return acc + (locationData ? parseInt(locationData.ScannedImages) || 0 : 0);
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
                              <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>
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
                            <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>
                              Total Files:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return acc + (locationData ? parseInt(locationData.QCFiles) || 0 : 0);
                              }, 0).toLocaleString()}
                              <br />
                              Total Images:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return acc + (locationData ? parseInt(locationData.QCImages) || 0 : 0);
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
                                  Doc Classification
                                </h6>
                              </div>
                              <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>
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
                                Doc Classification
                              </h6>
                            </div>
                            <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>
                              Total Files:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return acc + (locationData ? parseInt(locationData.FlaggingFiles) || 0 : 0);
                              }, 0).toLocaleString()}
                              <br />
                              Total Images:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return acc + (locationData ? parseInt(locationData.FlsggingImages) || 0 : 0);
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
                              <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>
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
                            <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>
                              Total Files:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return acc + (locationData ? parseInt(locationData.IndexingFiles) || 0 : 0);
                              }, 0).toLocaleString()}
                              <br />
                              Total Images:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return acc + (locationData ? parseInt(locationData.IndexingImages) || 0 : 0);
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
                              <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>
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
                            <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>
                              Total Files:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return acc + (locationData ? parseInt(locationData.CBSL_QAFiles) || 0 : 0);
                              }, 0).toLocaleString()}
                              <br />
                              Total Images:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return acc + (locationData ? parseInt(locationData.CBSL_QAImages) || 0 : 0);
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
                              <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>
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
                            <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>
                              Total Files:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return acc + (locationData ? parseInt(locationData.Export_PdfFiles) || 0 : 0);
                              }, 0).toLocaleString()}
                              <br />
                              Total Images:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return acc + (locationData ? parseInt(locationData.Export_PdfImages) || 0 : 0);
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
                              <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>
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
                            <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>
                              Total Files:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return acc + (locationData ? parseInt(locationData.Client_QA_AcceptedFiles) || 0 : 0);
                              }, 0).toLocaleString()}
                              <br />
                              Total Images:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return acc + (locationData ? parseInt(locationData.Client_QA_AcceptedImages) || 0 : 0);
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
                                  Inventory Out
                                </h6>
                              </div>
                              <p className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: 'maroon' }}>
                                Total Files: {elem.Inv_Out_Files} <br />
                                Total Images:{elem.Inv_Out_Images}
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
                              Total Files:{" "}
                              {selectedLocations.reduce((acc, location) => {
                                const locationData = report.find((elem) => elem.LocationName === location);
                                return acc + (locationData ? parseInt(locationData.Inv_Out_Files) || 0 : 0);
                              }, 0).toLocaleString()}
                              <br />
                              Total Images:{" "}
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
                    <h6 style={{ color: "white", cursor: "pointer" }} onClick={handleReportCsv}>
                      {" "}
                      <MdFileDownload style={{ fontSize: "20px" }} />
                      Export CSV
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
                        <p className="fw-bold">Are you sure you want to export the CSV file?</p>
                        <button className="btn btn-success mt-3 ms-5" onClick={() => {
                          downloadAllFormats(report, fileTableHeaders);
                        }}>Yes</button>
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
                      style={{ color: "black", fontWeight: '300', textAlign: 'center' }}
                    >
                      <tr>
                        <th rowspan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle' }}>Location</th>
                        <th colspan="2" style={{ verticalAlign: 'middle' }}>Collection of Records</th>
                        <th colspan="2" style={{ verticalAlign: 'middle' }}>Scanning ADF</th>
                        <th colspan="2" style={{ verticalAlign: 'middle' }}>Image QC</th>
                        <th colspan="2" style={{ verticalAlign: 'middle' }}>Document Classification</th>
                        <th colSpan="2" style={{ verticalAlign: 'middle' }}>Indexing</th>
                        <th colSpan="2" style={{ verticalAlign: 'middle' }}>CBSL QA</th>
                        <th colSpan="2" style={{ verticalAlign: 'middle' }}>Export PDF</th>
                        <th colSpan="2" style={{ verticalAlign: 'middle' }}>Client QA</th>
                        <th colSpan="2" style={{ verticalAlign: 'middle' }}>CSV Generation</th>
                        <th colSpan="2" style={{ verticalAlign: 'middle' }}>Inventory Out</th>
                      </tr>
                      <tr
                        style={{ color: "black", fontWeight: '300' }}
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
                      {report &&
                        report.map((elem, index) => {
                          if (
                            selectedLocations.length === 0 ||
                            selectedLocations.includes(elem.LocationName)
                          ) {
                            return (
                              <tr key={index} style={{ backgroundColor: "white" }}>
                                <td style={{ whiteSpace: 'nowrap' }}>{elem.LocationName}</td>
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
            {selectedLocations && startDate && endDate ? (
              <>
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
                          DATE WISE DETAILED REPORT
                        </h6>
                      </div>
                      <div className="col-2">
                        <h6 style={{ color: "white", cursor: "pointer" }} onClick={handleDateReportCsv}>
                          {" "}
                          <MdFileDownload style={{ fontSize: "20px" }} />
                          Export CSV
                        </h6>
                      </div>

                      {showConfirmationBox && (
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
                      style={{ overflowX: "auto" }}
                    >
                      <h5 className="mt-1 mb-2">Total Locations: {totalLocations}</h5>
                      <table class="table table-hover table-bordered table-responsive  data-table">
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
                            <th colSpan="2" style={{ verticalAlign: 'middle' }}>Export PDF</th>
                            <th colSpan="2" style={{ verticalAlign: 'middle' }}>Client QA</th>
                            <th colSpan="2" style={{ verticalAlign: 'middle' }}>CSV Generation</th>
                            <th colSpan="2" style={{ verticalAlign: 'middle' }}>Inventory Out</th>
                          </tr>
                          <tr
                            style={{ color: "black", fontWeight: '300' }}
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
                                    <td style={{ whiteSpace: 'nowrap' }}>{elem.locationName}</td>
                                    <td style={{ whiteSpace: 'nowrap' }}>{elem.Date || "N/A"}</td>
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
                                    <td>{isNaN(parseInt(elem.Client_QCFiles)) ? "0" : parseInt(elem.Client_QCFiles).toLocaleString()}</td>
                                    <td>{isNaN(parseInt(elem.Client_QCImages)) ? "0" : parseInt(elem.Client_QCImages).toLocaleString()}</td>
                                    <td>0</td>
                                    <td>0</td>
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
