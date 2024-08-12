import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "./Components/Header";
import Footer from "./Footer";
import axios from "axios";
import { MdFileDownload } from "react-icons/md";
import { API_URL } from "./Api";
import { format, sub } from "date-fns";
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import Chart from 'react-apexcharts';

const DailyReport = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showLocation, setShowLocation] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const currentDate = new Date();
    const yesterdayDate = sub(currentDate, { days: 1 });
    const previousDate = sub(currentDate, { days: 2 });
    const formattedCurrentDate = format(currentDate, "dd-MM-yyyy");
    const formattedYesterdayDate = format(yesterdayDate, "dd-MM-yyyy");
    const formattedPreviousDate = format(previousDate, "dd-MM-yyyy");
    const [tableData, setTableData] = useState([]);
    const [manPowerData, setManPowerData] = useState([]);
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
    const [allWeekImage, setAllWeekImage] = useState({ labels: [], datasets: [] });
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
    const [totalLocations, setTotalLocations] = useState(0);
    const filedropdownRef = useRef(null);

    // const userLog = JSON.parse(localStorage.getItem('user'));
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

    const handleReportCsv = () => {
        setShowConfirmationBox(true);
    };
    const handleDateReportCsv = () => {
        setShowConfirmationBox(true);
    };

    const handleReportCsvConfirmation = async () => {
        try {
            const userLog = JSON.parse(localStorage.getItem('user'));

            // Determine the appropriate function to fetch CSV data
            let fetchDataFunction;
            if (userLog.locations && userLog.locations.length === 1 && userLog.locations[0].id && userLog.user_roles.includes("Cbsl User")) {
                // User has a specific location assigned
                fetchSummaryReportTableCsvFileLocation();
            } else {
                // User does not have a specific location assigned (handle based on selected location)
                fetchSummaryReportTableCsvFile();
            }

            if (reportCsv) {
                const link = document.createElement("a");
                link.href = reportCsv;
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

    const handleReportCancelExport = () => {
        setShowConfirmationBox(false);
    };
    const handleDateReportCancelExport = () => {
        setShowConfirmationBox(false);
    };

    const fetchSummaryReportTableCsvFile = async (locationName, startDate, endDate) => {
        const formattedStartDate = startDate ? new Date(startDate) : null;
        const formattedEndDate = endDate ? new Date(endDate) : null;
        const formatDate = (date) => {
            // Format to YYYY-MM-DD
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        let apiUrl = `${API_URL}/reporttablecsv`;
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
            setReportCsv(url);
        } catch (error) {
            console.error("Error in exporting data:", error);
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

        const fetchReportData = async () => {
            try {
                let apiUrl = `${API_URL}/reportTable`;
                const queryParams = {};

                const userLog = JSON.parse(localStorage.getItem('user'));

                if (userLog.locations && userLog.locations.length === 1 && userLog.locations[0].id && userLog.user_roles.includes("Cbsl User")) {
                    queryParams.locationName = userLog.locations[0].name;
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
                fetchSummaryReportTableCsvFile(finalLocations, startDate, endDate),
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
        const fetchAllWeekImageData = (selectedLocations) => {

            let apiUrl = `${API_URL}/weekimages`;

            if (selectedLocations && selectedLocations.length > 0) {
                const locationName = selectedLocations
                    .map((location) => `locationName=${encodeURIComponent(location)}`)
                    .join("&");
                apiUrl += `?${locationName}`;
            }

            axios
                .get(apiUrl)
                .then((response) => {
                    const apiData = response.data;
                    if (!apiData || apiData.length === 0) {
                        console.error("No data received from the API");
                        return;
                    }

                    // Extract dates and image data
                    const labels = apiData.map((entry) => entry.date);
                    const scannedImages = apiData.map((entry) => entry.ScannedImages);
                    const qcImages = apiData.map((entry) => entry.QCImages);
                    const flaggingImages = apiData.map((entry) => entry.FlaggingImages);
                    const indexingImages = apiData.map((entry) => entry.IndexingImages);
                    const cbslQAImages = apiData.map((entry) => entry.CBSL_QAImages);
                    const exportPdfImages = apiData.map((entry) => entry.Export_PdfImages);
                    const clientQAAcceptedImages = apiData.map((entry) => entry.Client_QA_AcceptedImages);
                    const clientQARejectedImages = apiData.map((entry) => entry.Client_QA_RejectedImages);
                    const digiSignImages = apiData.map((entry) => entry.Digi_SignImages);

                    // Construct datasets
                    const datasets = [
                        { label: "Scanned Images", data: scannedImages },
                        { label: "QC Images", data: qcImages },
                        { label: "Flagging Images", data: flaggingImages },
                        { label: "Indexing Images", data: indexingImages },
                        { label: "CBSL QA Images", data: cbslQAImages },
                        { label: "Export PDF Images", data: exportPdfImages },
                        { label: "Client QA Accepted Images", data: clientQAAcceptedImages },
                        { label: "Client QA Rejected Images", data: clientQARejectedImages },
                        { label: "Digi Sign Images", data: digiSignImages }
                    ];

                    setAllWeekImage({
                        labels: labels,
                        datasets: datasets,
                    });
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
        const fetchTableData = () => {
            axios
                .get(`${API_URL}/tabularData`)
                .then((response) => {
                    setTableData(response.data);
                    console.log("Table Data", response.data); // Log inside the then block
                })
                .catch((error) => console.error(error));
        };


        const fetchManPowerData = async() => {
            try {
                let apiUrl = `${API_URL}/user-counts`;
                const queryParams = {};

                const userLog = JSON.parse(localStorage.getItem('user'));

                if (userLog.locations && userLog.locations.length === 1 && userLog.locations[0].id && userLog.user_roles.includes("Cbsl User")) {
                    queryParams.locationName = userLog.locations[0].name;
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
                setManPowerData(response.data);
                setIsLoading(false);
                updateTotalLocations(response.data);
            } catch (error) {
                console.error("Error fetching report data:", error);
                setError("Error fetching report data. Please try again.");
                setIsLoading(false);
            }
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
        fetchExportCsvFile();
        fetchManPowerData();
        fetchTableData();
        fetchReports(locationName, startDate, endDate);
        fetchReportData();
        fetchMonthImageGraphData(locationName);
        fetchAllWeekImageData(locationName);
        fetchGraphImageData(selectedLocations);
        fetchDateReportData();
        fetchFileTypes();
        fetchDateSummaryReportTableCsvFile(locationName, startDate, endDate);

    }, [selectedLocations, selectedFileTypes, endDate]);

    const updateTotalLocations = (data) => {
        const uniqueLocations = [...new Set(data.map(elem => elem.LocationName))];
        setTotalLocations(uniqueLocations.length);
    };

    const formatChartData = (data, colors) => ({
        options: {
            chart: {
                toolbar: {
                    show: true,
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
    const formatWeekChartData = (data, colors) => ({
        options: {
          chart: {
            toolbar: {
              show: true,
            },
            stacked: false,
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            show: true,
            width: -1,
            colors: ["transparent"],
          },
          legend: {
            show: true,
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "80%",
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
        series: data.datasets.map((dataset, index) => ({
          name: dataset.label,
          data: dataset.data,
          color: colors[index]
        }))
      });

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
    const columnSums = calculateColumnSum();

    const Loader = () => (
        <div className="loader-overlay">
            <div className="loader"></div>
        </div>
    );
    return (
        <>
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
                                    Site Wise Cumulative Project Summary Report
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
                                        <h6 style={{ color: "white", cursor: "pointer" }} onClick={handleExport}>
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
                        <div className="row mt-2">
                            <Card>
                                <CardBody>
                                    <CardTitle tag="h5">Cumulative Images </CardTitle>
                                    <Chart
                                        options={formatChartData(barImage, ["#508C9B"]).options}
                                        series={formatChartData(barImage, ["#508C9B"]).series}
                                        type="bar"
                                        height="350"
                                    />
                                </CardBody>
                            </Card>
                        </div>
                        <div className="row mt-2">
                            <Card>
                                <CardBody>
                                    <CardTitle tag="h5">Weekly Report(Images)</CardTitle>
                                    <CardSubtitle className="text-muted" tag="h6">{selectedLocations}</CardSubtitle>
                                    <Chart
                                        options={formatWeekChartData(allWeekImage, ["#088395", "#F0A500", "#FF3D00", "#4CAF50", "#FF9800", "#9C27B0", "#2196F3", "#E91E63", "#607D8B"]).options}
                                        series={formatWeekChartData(allWeekImage, ["#088395", "#F0A500", "#FF3D00", "#4CAF50", "#FF9800", "#9C27B0", "#2196F3", "#E91E63", "#607D8B"]).series}
                                        type="bar"
                                        height="350"
                                    />
                                </CardBody>
                            </Card>
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
                        <div className="row mt-2 me-1 search-report-card" >
                            
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
                        <div className="row mt-2">
                            <div
                                className="row"
                                style={{
                                    padding: "5px",
                                    backgroundColor: "#4BC0C0",
                                    paddingTop: "15px",
                                }}
                            >

                                <h6 className="" style={{ color: "white" }}>
                                   Man Power
                                </h6>
                            </div>
                            <div className="row mt-2">
                            <table class="table table-hover table-bordered table-responsive  data-table">
                                <thead>
                                    <tr>
                                        <th>Location Name</th>
                                        <th>Scan User</th>
                                        <th>QC User</th>
                                        <th>Flagging User</th>
                                        <th>Index User</th>
                                        <th>CBSL QA User</th>
                                        <th>Export pdf User</th>
                                        <th>Client QA User</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {manPowerData && manPowerData.map((elem, index) => (
                                        <tr key={index}>
                                            <td>{elem.LocationName}</td>
                                            <td>{elem.ScannedUser}</td>
                                            <td>{elem.QCUser}</td>
                                            <td>{elem.FlaggingUser}</td>
                                            <td>{elem.IndexingUser}</td>
                                            <td>{elem.CBSL_QAUser}</td>
                                            <td>{elem.Export_PdfUser}</td>
                                            <td>{elem.Client_QA_AcceptedUser}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DailyReport