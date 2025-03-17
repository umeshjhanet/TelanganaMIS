import React, { useEffect, useState, useRef } from "react";
import Chart from 'react-apexcharts';
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import axios, { all } from "axios";
import "./App.css";
import { format, sub } from "date-fns";
import { MdFileDownload } from "react-icons/md";
import { VscTable } from "react-icons/vsc";
import { API_URL } from "./Api";
import { useNavigate } from 'react-router-dom';
import { FaChartBar, FaChartLine } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Locationwiseclientreport from "./locationwiseclient";
import Header2 from "./Components/Header2";
const newData = [{ name: 'Page A', uv: 400, pv: 2400, amt: 2400 }, { name: 'Page B', uv: 450, pv: 2400, amt: 2400 },];

const Locationwisereport = () => {

    const currentDate = new Date();
    const yesterdayDate = sub(currentDate, { days: 1 });
    const previousDate = sub(currentDate, { days: 2 });
    const formattedCurrentDate = format(currentDate, "dd-MM-yyyy");
    const formattedYesterdayDate = format(yesterdayDate, "dd-MM-yyyy");
    const formattedPreviousDate = format(previousDate, "dd-MM-yyyy");
    const [tableData, setTableData] = useState([]);
    const [csv, setCsv] = useState(null);
    const dropdownRef = useRef(null);
    const [showLocation, setShowLocation] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [locationData, setLocationData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [statusDetails, setStatusDetails] = useState(false);
    const [showFileTable, setShowFileTable] = useState(false);
    const [showImageTable, setShowImageTable] = useState(false);
    const [showTodayFileTable, setShowTodayFileTable] = useState(false);
    const [showTodayImageTable, setShowTodayImageTable] = useState(false);
    const [report, setReport] = useState([]);
    const [cardCumulative, setCardCumulative] = useState([]);
    const [cardToday, setCardToday] = useState([]);
    const [yesterdayReport, setYesterdayReport] = useState([]);
    const [chartFileType, setChartFileType] = useState("bar");
    const [chartImageType, setChartImageType] = useState("bar");
    const [chartTodayFileType, setChartTodayFileType] = useState("bar");
    const [chartTodayImageType, setChartTodayImageType] = useState("bar");
    const [dailyRemarks, setDailyRemarks] = useState('');
    const [cumulativeRemarks, setCumulativeRemarks] = useState('');
    const [dailySpecialRequests, setDailySpecialRequests] = useState('');
    const [cumulativeSpecialRequests, setCumulativeSpecialRequests] = useState('');
    const [isViewDailyModalOpen, setIsViewDailyModalOpen] = useState(false);
    const [isViewCumulativeModalOpen, setIsViewCumulativeModalOpen] = useState(false);
    const navigate = useNavigate();

    const rawUserLog = localStorage.getItem('user');
    const userLog = JSON.parse(rawUserLog || '{}');

    // Safely check if locations exist and are an array
    const locations = Array.isArray(userLog?.locations) ? userLog.locations : [];
    const isEmptyLocations =
        locations.length === 1 &&
        locations[0].id === null &&
        locations[0].name === null;
    console.log('locations:', locations); // Debugging to confirm structure
    console.log('isEmptyLocations:', isEmptyLocations);
    const [barImage, setBarImage] = useState({
        labels: [],
        datasets: [
            {
                label: "No. of Images",
                // backgroundColor: "#8DECB4",
                data: [],
            },
        ],
    });
    const [barFile, setBarFile] = useState({
        labels: [],
        datasets: [
            {
                label: "No. of Files",
                // backgroundColor: "#8DECB4",
                data: [],
            },
        ],
    });
    const [remarks, setRemarks] = useState({
        labels: [],
        datasets: [
            {
                label: "No. of Files",
                backgroundColor: "#8DECB4",
                data: [],
            },
        ],
    });
    const [todayImage, setTodayImage] = useState({
        labels: [],
        datasets: [
            {
                label: "No. of Images",
                // backgroundColor: "#1679AB",
                data: [],
            },
        ],
    });
    const [todayFile, setTodayFile] = useState({
        labels: [],
        datasets: [
            {
                label: "No. of Files",
                // backgroundColor: "#1679AB",
                data: [],
            },
        ],
    });
    const [allLocationImage, setAllLocationImage] = useState({
        labels: [],
        datasets: [
            {
                label: "No. of Images",
                // backgroundColor: "#AF8260",
                data: [],
            },
        ],
    });
    const [allLocationYesImage, setAllLocationYesImage] = useState({
        labels: [],
        datasets: [
            {
                label: "Images",
                backgroundColor: "#66b3ff",
                data: [],
            },
        ],
    });

    const [chartData, setChartData] = useState({
        options: {
            chart: {
                type: 'bar',
                height: 350,
                toolbar: { show: false },
                events: {
                    legendClick: function (chartContext, seriesIndex, config) {
                        // Find the corresponding line/bar index
                        const pairedIndex = seriesIndex % 2 === 0 ? seriesIndex + 1 : seriesIndex - 1;

                        // Toggle both the clicked series and its pair
                        chartContext.toggleSeries(config.config.series[seriesIndex].name);
                        chartContext.toggleSeries(config.config.series[pairedIndex].name);
                    }
                }
            },
            xaxis: { categories: [] },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '60%',
                    grouped: true
                }
            },
            dataLabels: { enabled: false },
            tooltip: {
                enabled: true,
                shared: false, // Ensures tooltip shows values for all series
                intersect: false, // Prevents conflicting tooltip behavior
                y: {
                    formatter: function (val) {
                        return val >= 100000 ? (val / 100000).toFixed(2) + " L" : val.toLocaleString();
                    }
                }
            },
            stroke: { width: [0, 2], curve: 'smooth' },
            colors: [
                '#FF5733', '#FF5733', // Scanned (Bar & Line)
                '#4BC0C0', '#4BC0C0', // QC
                '#FFBD33', '#FFBD33', // Flagging
                '#335700', '#335700', // Indexing
                '#FF33A1', '#FF33A1', // Offered for QA
                '#3674B5', '#3674B5'  // Customer QA Done
            ],
            grid: { padding: { left: 20, right: 20 } },
            legend: { show: true }
        },
        series: [] // Dynamically updated
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
            let apiUrl = `${API_URL}/currentstatusimages`;

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

                    // Labels representing the different processes
                    const labels = ["Scanned", "QC", "Flagging", "Indexing", "Offered for QA", "Client QA Done"];

                    // Extract the first (and only) item in the response for process counts
                    const data = apiData[0];

                    // Create datasets for the chart
                    const datasets = [
                        {
                            label: 'Processes',
                            data: [
                                parseFloat(data.Scanned) || 0,
                                parseFloat(data.QC) || 0,
                                parseFloat(data.Flagging) || 0,
                                parseFloat(data.Indexing) || 0,
                                parseFloat(data.OfferedforQA) || 0,
                                parseFloat(data.ClientQADone) || 0,
                            ],

                        }
                    ];

                    // Set the bar image state with the new data
                    setBarImage({
                        labels: labels,  // Labels representing the processes
                        datasets: datasets,
                    });
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        };
        const fetchTodayGraphImageData = (selectedLocations) => {
            let apiUrl = `${API_URL}/todaystatusimages`;

            // Append location query parameters if selected
            if (selectedLocations && selectedLocations.length > 0) {
                const locationQuery = selectedLocations
                    .map((location) => `locationNames=${encodeURIComponent(location)}`)
                    .join("&");
                apiUrl += `?${locationQuery}`;
            }

            // Fetch data from API
            axios
                .get(apiUrl)
                .then((response) => {
                    const apiData = response.data;

                    // Handle case where no data is returned
                    if (!apiData || apiData.length === 0) {
                        console.error("No data received from the API");
                        return;
                    }

                    console.log("API Data:", apiData);

                    // Labels representing the different processes
                    const labels = ["Scanned", "QC", "Flagging", "Indexing", "Offered for QA", "Client QA Done"];

                    // If the API returns a single object (totals), no need to access the first item
                    const data = apiData;

                    // Create datasets for the chart
                    const datasets = [
                        {
                            label: 'Processes',
                            backgroundColor: ["#4BC0C0", "#FF6384", "#36A2EB", "#FFCE56"],  // Custom colors for each bar
                            data: [
                                parseFloat(data.Scanned) || 0,
                                parseFloat(data.QC) || 0,
                                parseFloat(data.Flagging) || 0,
                                parseFloat(data.Indexing) || 0,
                                parseFloat(data.OfferedforQA) || 0,
                                parseFloat(data.ClientQADone) || 0,
                            ],
                        }
                    ];

                    // Update the chart data
                    setTodayImage({
                        labels: labels,
                        datasets: datasets,
                    });
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        };
        const fetchGraphFileData = (selectedLocations) => {
            let apiUrl = `${API_URL}/currentstatusfiles`;

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

                    // Labels representing the different processes
                    const labels = ["Scanned", "QC", "Flagging", "Indexing", "Offered for QA", "Client QA Done"];

                    // Extract the first (and only) item in the response for process counts
                    const data = apiData[0];

                    // Create datasets for the chart
                    const datasets = [
                        {
                            label: 'Processes',
                            data: [
                                parseFloat(data.Scanned) || 0,
                                parseFloat(data.QC) || 0,
                                parseFloat(data.Flagging) || 0,
                                parseFloat(data.Indexing) || 0,
                                parseFloat(data.OfferedforQA) || 0,
                                parseFloat(data.ClientQADone) || 0,
                            ],

                        }
                    ];

                    // Set the bar image state with the new data
                    setBarFile({
                        labels: labels,  // Labels representing the processes
                        datasets: datasets,
                    });
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        };
        const fetchTodayGraphFileData = (selectedLocations) => {
            let apiUrl = `${API_URL}/todaystatusfiles`;

            // Append location query parameters if selected
            if (selectedLocations && selectedLocations.length > 0) {
                const locationQuery = selectedLocations
                    .map((location) => `locationNames=${encodeURIComponent(location)}`)
                    .join("&");
                apiUrl += `?${locationQuery}`;
            }

            // Fetch data from API
            axios
                .get(apiUrl)
                .then((response) => {
                    const apiData = response.data;

                    // Handle case where no data is returned
                    if (!apiData || apiData.length === 0) {
                        console.error("No data received from the API");
                        return;
                    }

                    console.log("API Data:", apiData);

                    // Labels representing the different processes
                    const labels = ["Scanned", "QC", "Flagging", "Indexing", "Offered for QA", "Client QA Done"];

                    // If the API returns a single object (totals), no need to access the first item
                    const data = apiData;

                    // Create datasets for the chart
                    const datasets = [
                        {
                            label: 'Processes',
                            backgroundColor: ["#4BC0C0", "#FF6384", "#36A2EB", "#FFCE56"],  // Custom colors for each bar
                            data: [
                                parseFloat(data.Scanned) || 0,
                                parseFloat(data.QC) || 0,
                                parseFloat(data.Flagging) || 0,
                                parseFloat(data.Indexing) || 0,
                                parseFloat(data.OfferedforQA) || 0,
                                parseFloat(data.ClientQADone) || 0,
                            ],
                        }
                    ];

                    // Update the chart data
                    setTodayFile({
                        labels: labels,
                        datasets: datasets,
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
        const fetchStatusDetails = (selectedLocations) => {
            // Prepare the query parameters
            const params = {};

            // Check if selectedLocations is an array and add it to the params
            if (selectedLocations && selectedLocations.length > 0) {
                params.locationname = selectedLocations; // This allows passing multiple location names
            }

            axios
                .get(`${API_URL}/statusDetails`, { params }) // Include params in the request
                .then((response) => {
                    setStatusDetails(response.data);
                    console.log("Table Data", response.data); // Log inside the then block
                })
                .catch((error) => console.error(error));
        };
        const fetchData = async (selectedLocations = []) => {
            try {
                if (!Array.isArray(selectedLocations)) {
                    console.error("selectedLocations is not an array:", selectedLocations);
                    selectedLocations = [];
                }

                let params = {};
                if (selectedLocations.length > 0) {
                    params.locationname = selectedLocations.join(","); // Convert array to comma-separated values
                }

                console.log("Fetching data with params:", params);

                const response = await axios.get(`${API_URL}/cumulative-status-images`, { params });

                if (!response || !response.data) {
                    console.error("No response or response data from API");
                    setChartData(prevData => ({
                        ...prevData,
                        options: { ...prevData.options, xaxis: { categories: [] } },
                        series: []
                    }));
                    return;
                }

                const data = response.data;
                if (!Array.isArray(data) || data.length === 0) {
                    console.warn("API returned no data or empty array");
                    setChartData(prevData => ({
                        ...prevData,
                        options: { ...prevData.options, xaxis: { categories: [] } },
                        series: []
                    }));
                    return;
                }

                // Prepare data for the last 30 days
                const last30Days = data.map(item => ({
                    date: item.formattedDate || "Unknown Date",
                    scanned: parseInt(item.ScannedImages, 10) || 0,
                    qc: parseInt(item.QCImages, 10) || 0,
                    flagging: parseInt(item.FlaggingImages, 10) || 0,
                    index: parseInt(item.IndexImages, 10) || 0,
                    offeredForQA: parseInt(item.CBSLQAImages, 10) || 0,
                    clientQADone: parseInt(item.ApprovedImages, 10) || 0,
                }));

                // Extract data arrays for charting
                const dates = last30Days.map(item => item.date);
                const scannedData = last30Days.map(item => item.scanned);
                const qcData = last30Days.map(item => item.qc);
                const flaggingData = last30Days.map(item => item.flagging);
                const indexData = last30Days.map(item => item.index);
                const cbslqaData = last30Days.map(item => item.offeredForQA);
                const clientData = last30Days.map(item => item.clientQADone);

                console.log("Processed Chart Data:", { dates, scannedData, qcData, flaggingData, indexData, cbslqaData, clientData });

                // Update chart data
                setChartData(prevData => ({
                    ...prevData,
                    options: {
                        ...prevData.options,
                        xaxis: { categories: dates }
                    },
                    series: [
                        { name: 'Scanned', type: "bar", data: scannedData },
                        { name: 'Scanned (Trend)', type: "line", data: scannedData },

                        { name: 'QC', type: "bar", data: qcData },
                        { name: 'QC (Trend)', type: "line", data: qcData },

                        { name: 'Flagging', type: "bar", data: flaggingData },
                        { name: 'Flagging (Trend)', type: "line", data: flaggingData },

                        { name: 'Indexing', type: "bar", data: indexData },
                        { name: 'Indexing (Trend)', type: "line", data: indexData },

                        { name: 'Offered for QA', type: "bar", data: cbslqaData },
                        { name: 'Offered for QA (Trend)', type: "line", data: cbslqaData },

                        { name: 'Customer QA Done', type: "bar", data: clientData },
                        { name: 'Customer QA Done (Trend)', type: "line", data: clientData }
                    ]
                }));
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        const fetchReportData = (locationName) => {
            const params = {};
            if (locationName) {
                params.locationName = selectedLocations;
            }
            axios
                .get(`${API_URL}/Table`, { params })
                .then((response) => {
                    setReport(response.data);
                    console.log("Table Data", response.data);
                })
                .catch((error) => console.error(error));
        };
        const fetchYesterdayReportData = (selectedLocations) => {
            // Create an object to hold query parameters
            const params = {};

            // If selectedLocations are provided, join them into a comma-separated string
            if (selectedLocations && selectedLocations.length > 0) {
                params.locationNames = selectedLocations.join(',');
            }

            // Make the API request with optional parameters
            axios
                .get(`${API_URL}/yesterday-table`, { params })
                .then((response) => {
                    setYesterdayReport(response.data);
                    console.log("Table Data", response.data); // Log inside the then block
                })
                .catch((error) => console.error(error));
        };
        const fetchAllYesGraphImageData = (selectedLocations) => {
            let apiUrl = `${API_URL}/today-location-process-graph`;

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
                    const imagesData = apiData.map((item) => item["Scanned"]);
                    const qcImagesData = apiData.map((item) => item["QC"]);
                    const flaggingImagesData = apiData.map((item) => item["Flagging"]);
                    const indexingImagesData = apiData.map((item) => item["Indexing"]);
                    const cbslQaImagesData = apiData.map((item) => item["Offered for QA"]);
                    const clientQaImagesData = apiData.map((item) => item["Customer QA Done"]);

                    console.log("Yesterday Labels:", labels);
                    console.log("Scanned Images:", imagesData);
                    console.log("QC Images:", qcImagesData);
                    console.log("Flagging Images:", flaggingImagesData);
                    console.log("Indexing Images:", indexingImagesData);
                    console.log("CBSL QA Images:", cbslQaImagesData);
                    console.log("Client QA Images:", clientQaImagesData);

                    setAllLocationYesImage({
                        labels: labels,
                        datasets: [
                            {
                                label: "Scanned",
                                data: imagesData,
                                backgroundColor: "#02B2AF",
                            },
                            {
                                label: "QC",
                                data: qcImagesData,
                                backgroundColor: "#FF6384",
                            },
                            {
                                label: "Flagging",
                                data: flaggingImagesData,
                                backgroundColor: "#36A2EB",
                            },
                            {
                                label: "Indexing",
                                data: indexingImagesData,
                                backgroundColor: "#FFCE56",
                            },
                            {
                                label: "Offered for QA",
                                data: cbslQaImagesData,
                                backgroundColor: "#4BC0C0",
                            },
                            {
                                label: "Customer QA Done",
                                data: clientQaImagesData,
                                backgroundColor: "#9966FF",
                            },
                        ],
                    });
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        };
        const fetchAllGraphImageData = (selectedLocations) => {
            let apiUrl = `${API_URL}/cumulative-location-process-graph`;

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
                    const imagesData = apiData.map((item) => item["Scanned"]);
                    const qcImagesData = apiData.map((item) => item["QC"]);
                    const flaggingImagesData = apiData.map((item) => item["Flagging"]);
                    const indexingImagesData = apiData.map((item) => item["Indexing"]);
                    const cbslQaImagesData = apiData.map((item) => item["Offered for QA"]);
                    const clientQaImagesData = apiData.map((item) => item["Customer QA Done"]);

                    console.log("Labels:", labels);
                    console.log("Images Data:", imagesData);
                    console.log("QC Images Data:", qcImagesData);
                    console.log("Flagging Images Data:", flaggingImagesData);
                    console.log("Indexing Images Data:", indexingImagesData);
                    console.log("CBSL QA Images Data:", cbslQaImagesData);
                    console.log("Client QA Images Data:", clientQaImagesData);

                    setAllLocationImage({
                        labels: labels,
                        datasets: [
                            {
                                label: "Scanned",
                                data: imagesData,
                                backgroundColor: "#02B2AF",
                            },
                            {
                                label: "QC",
                                data: qcImagesData,
                                backgroundColor: "#FF6384",
                            },
                            {
                                label: "Flagging",
                                data: flaggingImagesData,
                                backgroundColor: "#36A2EB",
                            },
                            {
                                label: "Indexing",
                                data: indexingImagesData,
                                backgroundColor: "#FFCE56",
                            },
                            {
                                label: "Offered for QA",
                                data: cbslQaImagesData,
                                backgroundColor: "#4BC0C0",
                            },
                            {
                                label: "Customer QA Done",
                                data: clientQaImagesData,
                                backgroundColor: "#9966FF",
                            },
                        ],
                    });
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        };
        const fetchCumulativeRemarks = async (selectedLocations) => {
            const params = {};
            if (locationName) {
                params.locationName = selectedLocations;
            }
            axios
                .get(`${API_URL}/getcumulativeremarks`, { params })
                .then((response) => {
                    setCardCumulative(response.data);
                    console.log("cumulativeRemarks Data", response.data);
                })
                .catch((error) => console.error(error));
        };

        const fetchTodayRemarks = async (selectedLocations) => {
            const params = {};
            if (locationName) {
                params.locationName = selectedLocations;
            }
            axios
                .get(`${API_URL}/getdailyremarks`, { params })
                .then((response) => {
                    setCardCumulative(response.data);
                    console.log("dailyRemarks Data", response.data);
                })
                .catch((error) => console.error(error));
        };
        fetchTodayRemarks(locationName);
        fetchCumulativeRemarks(locationName);


        fetchAllGraphImageData(locationName);
        fetchAllYesGraphImageData(locationName);
        fetchReportData(locationName);
        fetchYesterdayReportData(locationName);
        fetchData(locationName);
        fetchGraphImageData(locationName);
        fetchTodayGraphImageData(locationName);
        fetchGraphFileData(locationName);
        fetchTodayGraphFileData(locationName);
        fetchTableData();
        fetchExportCsvFile();
        fetchStatusDetails(locationName);

    }, [selectedLocations]);

    const columnSums = calculateColumnSum();

    if (!userLog) {
        navigate('/');
    }
    // Log the content of allLocationImage before passing it to the BarChart component
    console.log("allLocationImage content:", allLocationImage);
    const formatProcessChartData = (data, colors = ["#02B2AF", "#02B2AF", "#FF6384", "#FF6384", "#4335A7",
        "#4335A7", "#FF9D23", "#FF9D23", "#5CB338", "#5CB338", "#9966FF", "#9966FF",]) => ({
            options: {
                chart: {
                    type: 'bar',  // Mixed chart type
                    toolbar: { show: false },
                    events: {
                        legendClick: function (chartContext, seriesIndex, config) {
                            // Find the corresponding bar/line index
                            const pairedIndex = seriesIndex % 2 === 0 ? seriesIndex + 1 : seriesIndex - 1;

                            // Toggle both the clicked series and its pair
                            chartContext.toggleSeries(config.config.series[seriesIndex].name);
                            chartContext.toggleSeries(config.config.series[pairedIndex].name);
                        }
                    }
                },
                dataLabels: { enabled: false },
                tooltip: {
                    enabled: true,
                    shared: false,  // Ensures tooltips show all values together
                    intersect: false,
                    y: {
                        formatter: function (val) {
                            return val >= 100000 ? (val / 100000).toFixed(2) + " L" : val.toLocaleString();
                        }
                    }
                },
                stroke: { width: [2, 2, 2, 2, 2, 2], curve: 'smooth' },
                legend: { show: true },
                colors: [...colors, ...colors], // Ensures bars & lines have the same colors
                xaxis: { categories: data.labels || [] },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '50%'
                    }
                },
                responsive: [{ breakpoint: 1024, options: { chart: { type: 'bar' } } }]
            },
            series: [
                // Bars
                { name: "Scanned", type: "bar", data: data.datasets[0]?.data || [] },
                { name: "Scanned (Trend)", type: "line", data: data.datasets[0]?.data || [] },

                { name: "QC", type: "bar", data: data.datasets[1]?.data || [] },
                { name: "QC (Trend)", type: "line", data: data.datasets[1]?.data || [] },

                { name: "Flagging", type: "bar", data: data.datasets[2]?.data || [] },
                { name: "Flagging (Trend)", type: "line", data: data.datasets[2]?.data || [] },

                { name: "Indexing", type: "bar", data: data.datasets[3]?.data || [] },
                { name: "Indexing (Trend)", type: "line", data: data.datasets[3]?.data || [] },

                { name: "Offered for QA", type: "bar", data: data.datasets[4]?.data || [] },
                { name: "Offered for QA (Trend)", type: "line", data: data.datasets[4]?.data || [] },

                { name: "Customer QA Done", type: "bar", data: data.datasets[5]?.data || [] },
                { name: "Customer QA Done (Trend)", type: "line", data: data.datasets[5]?.data || [] }
            ]
        });

    const formatChartData = (data, colors) => ({
        options: {
            chart: {
                type: 'line',
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            tooltip: {
                enabled: true,
                y: {
                    formatter: function (val) {
                        if (val >= 100000) {
                            return (val / 100000).toFixed(2) + " L"; // Convert to lakhs
                        }
                        return val.toLocaleString(); // Format numbers below 1 lakh normally
                    }
                },
                x: {
                    show: false // Hide date from tooltip
                }
            },
            stroke: {
                show: true,
                width: 2,
                curve: 'smooth',
            },
            legend: {
                show: true,
            },
            colors: colors,
            xaxis: {
                categories: data.labels,  // Location names for x-axis
            },
            responsive: [
                {
                    breakpoint: 1024,
                    options: {
                        chart: {
                            type: 'line',
                        },
                    },
                },
            ],
        },
        series: data.datasets,
    });
    const handleFileTable = () => {
        setShowFileTable(!showFileTable);
    }
    const closeFileTable = () => {
        setShowFileTable(false);
    };
    const handleImageTable = () => {
        setShowImageTable(!showImageTable);
    }
    const closeImageTable = () => {
        setShowImageTable(false);
    };
    const handleTodayFileTable = () => {
        setShowTodayFileTable(!showTodayFileTable);
    }
    const closeTodayFileTable = () => {
        setShowTodayFileTable(false);
    };
    const handleTodayImageTable = () => {
        setShowTodayImageTable(!showTodayImageTable);
    }
    const closeTodayImageTable = () => {
        setShowTodayImageTable(false);
    };
    const handlePrint = () => {
        window.print(); // This will open the print dialog
    };
    const exportToCSV = () => {
        if (!report || report.length === 0) {
            return;
        }

        // Define the header for the CSV
        const headers = [
            "Location Name",
            "Scanned Files",
            "Scanned Images",
            "QC Files",
            "QC Images",
            "Flagging Files",
            "Flagging Images",
            "Indexing Files",
            "Indexing Images",
            "Offered for QA Files",
            "Offered for QA Images",
            "Client QA Done Files",
            "Client QA Done Images"
        ];

        // Map the data rows for the CSV
        const rows = report.map(user => [
            user.LocationName || '',
            user.ScannedFiles || '',
            user.ScannedImages || '',
            user.QCFiles || '',
            user.QCImages || '',
            user.FlaggingFiles || '',
            user.FlaggingImages || '',
            user.IndexingFiles || '',
            user.IndexingImages || '',
            user.CBSLQAFiles || '',
            user.CBSLQAImages || '',
            user.ApprovedFiles || '',
            user.ApprovedImages || ''
        ]);

        // Combine the headers and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Create a Blob from the CSV string
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);

        // Create a temporary link element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users_data.csv';
        a.click();

        // Clean up the URL and the link element
        window.URL.revokeObjectURL(url);
    };
    const exportToCSVYesterday = () => {
        if (!yesterdayReport || yesterdayReport.length === 0) {
            return;
        }

        // Define the header for the CSV
        const headers = [
            "Location Name",
            "Scanned Files",
            "Scanned Images",
            "QC Files",
            "QC Images",
            "Flagging Files",
            "Flagging Images",
            "Indexing Files",
            "Indexing Images",
            "Offered for QA Files",
            "Offered for QA Images",
            "Client QA Done Files",
            "Client QA Done Images"
        ];

        // Map the data rows for the CSV
        const rows = yesterdayReport.map(user => [
            user.locationname || '',
            user.ScannedFiles || '',
            user.ScannedImages || '',
            user.QCFiles || '',
            user.QCImages || '',
            user.FlaggingFiles || '',
            user.FlaggingImages || '',
            user.IndexingFiles || '',
            user.IndexingImages || '',
            user.CBSLQAFiles || '',
            user.CBSLQAImages || '',
            user.ApprovedFiles || '',
            user.ApprovedImages || ''
        ]);

        // Combine the headers and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Create a Blob from the CSV string
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);

        // Create a temporary link element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users_data.csv';
        a.click();

        // Clean up the URL and the link element
        window.URL.revokeObjectURL(url);
    };
    const handleViewDailyClick = (dailyRemarks, dailySpecialRequests) => {
        setDailyRemarks(dailyRemarks)
        setDailySpecialRequests(dailySpecialRequests)
        setIsViewDailyModalOpen(true);
    };
    const handleViewCumulativeClick = (cumulativeRemarks, cumulativeSpecialRequests) => {
        setCumulativeRemarks(cumulativeRemarks);
        setCumulativeSpecialRequests(cumulativeSpecialRequests)
        setIsViewCumulativeModalOpen(!isViewCumulativeModalOpen);
    };

    return (
        <>
            <Header2 />
            {isEmptyLocations ? (
                <>
                    <div className="container-fluid">
                        <div className="row mt-2">
                            <div
                                style={{ display: "flex", justifyContent: "space-between" }}
                            >
                                <h4>Telangana High Court Digitization Project</h4>
                            </div>
                        </div>
                        <div className="row  mt-2">
                            <div>
                                <div className="search-report-card" style={{ height: '60px', padding: '10px' }}>
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
                                </div>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div>
                                <div className="search-report-card"
                                    style={{ display: "flex", justifyContent: "space-between", height: '50px', padding: '10px' }}
                                >
                                    {statusDetails && statusDetails.map((elem, index) => (
                                        <>
                                            <div className="col-md-3 col-sm-12" key={index}>
                                                <p>Project Start Date: <b>{`${new Date(elem.Start_Date).getDate().toString().padStart(2, '0')}-${(new Date(elem.Start_Date).getMonth() + 1).toString().padStart(2, '0')}-${new Date(elem.Start_Date).getFullYear()}`}</b></p>

                                            </div>
                                            <div className="col-md-3 col-sm-12">
                                                <p>No. of Locations: <b>{elem.Total_locations}</b></p>
                                            </div>
                                            <div className="col-md-3 col-sm-12">
                                                <p>No. of Files Scanned: <b>{parseInt(elem.Total_Files).toLocaleString()}</b></p>
                                            </div>
                                            <div className="col-md-3 col-sm-12">
                                                <p>No. of Images Scanned: <b>{parseInt(elem.Total_Images).toLocaleString()}</b></p>
                                            </div>
                                        </>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="row mt-4">
                            <Card>
                                <CardBody>
                                    <CardTitle tag="h5">PRODUCTION REPORT FOR ({formattedYesterdayDate})</CardTitle>
                                    <CardSubtitle className="text-muted" tag="h6">All Location: Images</CardSubtitle>
                                    <Chart
                                        options={formatProcessChartData(allLocationYesImage).options}
                                        series={formatProcessChartData(allLocationYesImage).series}
                                        type="bar"
                                        height="350"
                                    />

                                </CardBody>
                            </Card>
                        </div>
                        <div className="row mt-3">
                            <div>
                                <Card>
                                    <CardBody>
                                        <CardTitle tag="h5">Comparative Workflow Trend of Last 10 Days (Figure in Lakhs)</CardTitle>
                                        <Chart
                                            options={chartData.options}
                                            series={chartData.series}
                                            type="bar"
                                            height={350}
                                        />
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                        <div className="row mt-4">
                            <Card>
                                <CardBody>
                                    <CardTitle tag="h5">Cumulative Production Till Date (Figure in Lakhs)</CardTitle>
                                    <CardSubtitle className="text-muted" tag="h6">All Location: Images</CardSubtitle>
                                    <Chart
                                        options={formatProcessChartData(allLocationImage).options}
                                        series={formatProcessChartData(allLocationImage).series}
                                        type="bar"
                                        height="350"
                                    />
                                </CardBody>
                            </Card>
                        </div>

                        {/* Older graph and table */}
                        <div className="row mt-2">
                            <div>
                                <div className="table-card" style={{ marginBottom: '25px' }}>
                                    <div
                                        className="d-flex justify-content-between align-items-center"
                                        style={{
                                            padding: "10px 10px 0px",
                                            backgroundColor: "#4BC0C0",
                                            // paddingTop: "15px",
                                        }}
                                    >
                                        <h6 className="text-center" style={{ color: "white" }}>
                                            PROJECT UPDATE REPORT OF  {formattedYesterdayDate} FOR SCANNING AND DIGITIZATION OF CASE
                                            RECORDS FOR DISTRICT COURT OF TELANGANA
                                        </h6>
                                        <h6 style={{ color: "white", cursor: "pointer" }} onClick={exportToCSVYesterday}>
                                            {" "}
                                            <MdFileDownload style={{ fontSize: "20px" }} />
                                            Export CSV
                                        </h6>
                                    </div>
                                    <div
                                        className="row mt-2 ms-2 me-2"
                                        style={{ overflowX: "auto", overflowY: 'auto' }}
                                    >
                                        <table class="table table-hover table-bordered table-responsive data-table">
                                            <thead
                                                style={{ color: "#4bc0c0", fontWeight: '300', textAlign: 'center' }}
                                            >
                                                <tr>
                                                    <th rowspan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle' }}>Location</th>
                                                    {/* <th rowspan="2" style={{ verticalAlign: 'middle' }}>Files Received</th> */}
                                                    <th colspan="2" style={{ verticalAlign: 'middle' }}>Scanned</th>
                                                    <th colspan="2" style={{ verticalAlign: 'middle' }}>QC</th>
                                                    <th colspan="2" style={{ verticalAlign: 'middle' }}>Flagging</th>
                                                    <th colspan="2" style={{ verticalAlign: 'middle' }}>Indexing</th>
                                                    <th colspan="2" style={{ verticalAlign: 'middle' }}>Offered for QA</th>
                                                    <th colspan="2" style={{ verticalAlign: 'middle' }}>Client QA Done</th>
                                                    {/* <th colspan="2" style={{ verticalAlign: 'middle' }}>Rectified by CBSL</th> */}
                                                    {/* <th colspan="2" style={{ verticalAlign: 'middle' }}>Delivered</th> */}
                                                    <th>Remarks</th>
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
                                                    {/* <th>Files</th>
                                            <th>Images</th> */}
                                                    {/* <th>Files</th>
                                            <th>Images</th> */}
                                                </tr>
                                            </thead>
                                            <tbody
                                                style={{ color: "gray" }}
                                            >
                                                {yesterdayReport &&
                                                    yesterdayReport.map((elem, index) => (
                                                        <tr key={index} style={{ backgroundColor: "white" }}>
                                                            <td style={{ whiteSpace: 'nowrap', textAlign: 'left' }}>{elem.locationname}</td>
                                                            {/* <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.InputFiles)) ? "0" : parseInt(elem.InputFiles).toLocaleString()}</td> */}
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.ScannedFiles)) ? "0" : parseInt(elem.ScannedFiles).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.ScannedImages)) ? "0" : parseInt(elem.ScannedImages).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.QCFiles)) ? "0" : parseInt(elem.QCFiles).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.QCImages)) ? "0" : parseInt(elem.QCImages).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.FlaggingFiles)) ? "0" : parseInt(elem.FlaggingFiles).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.FlaggingImages)) ? "0" : parseInt(elem.FlaggingImages).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.IndexFiles)) ? "0" : parseInt(elem.IndexFiles).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.IndexImages)) ? "0" : parseInt(elem.IndexImages).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.CBSLQAFiles)) ? "0" : parseInt(elem.CBSLQAFiles).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.CBSLQAImages)) ? "0" : parseInt(elem.CBSLQAImages).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.ApprovedFiles)) ? "0" : parseInt(elem.ApprovedFiles).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.ApprovedImages)) ? "0" : parseInt(elem.ApprovedImages).toLocaleString()}</td>
                                                            {/* <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.RectifiedFiles)) ? "0" : parseInt(elem.RectifiedFiles).toLocaleString()}</td>
                                                    <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.RectifiedImages)) ? "0" : parseInt(elem.RectifiedImages).toLocaleString()}</td> */}
                                                            {/* <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.Export_PdfFiles)) ? "0" : parseInt(elem.Export_PdfFiles).toLocaleString()}</td>
                                                    <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.Export_PdfImages)) ? "0" : parseInt(elem.Export_PdfImages).toLocaleString()}</td> */}
                                                            <td className="text-center"><button
                                                                className="btn client-view-btn"
                                                                onClick={() => handleViewDailyClick(elem.Remarks, elem.SpecialRequests)}
                                                            >
                                                                View
                                                            </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                                {yesterdayReport && (
                                                    <tr style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", textAlign: 'end' }}>
                                                        <td>Total: </td>
                                                        {/* <td>{yesterdayReport.reduce((acc, elem) => acc + (isNaN(parseInt(elem.InputFiles)) ? 0 : parseInt(elem.InputFiles)), 0).toLocaleString()}</td> */}
                                                        <td>{yesterdayReport.reduce((acc, elem) => acc + (isNaN(parseInt(elem.ScannedFiles)) ? 0 : parseInt(elem.ScannedFiles)), 0).toLocaleString()}</td>
                                                        <td>{yesterdayReport.reduce((acc, elem) => acc + (isNaN(parseInt(elem.ScannedImages)) ? 0 : parseInt(elem.ScannedImages)), 0).toLocaleString()}</td>
                                                        <td>{yesterdayReport.reduce((acc, elem) => acc + (isNaN(parseInt(elem.QCFiles)) ? 0 : parseInt(elem.QCFiles)), 0).toLocaleString()}</td>
                                                        <td>{yesterdayReport.reduce((acc, elem) => acc + (isNaN(parseInt(elem.QCImages)) ? 0 : parseInt(elem.QCImages)), 0).toLocaleString()}</td>
                                                        <td>{yesterdayReport.reduce((acc, elem) => acc + (isNaN(parseInt(elem.FlaggingFiles)) ? 0 : parseInt(elem.FlaggingFiles)), 0).toLocaleString()}</td>
                                                        <td>{yesterdayReport.reduce((acc, elem) => acc + (isNaN(parseInt(elem.FlaggingImages)) ? 0 : parseInt(elem.FlaggingImages)), 0).toLocaleString()}</td>
                                                        <td>{yesterdayReport.reduce((acc, elem) => acc + (isNaN(parseInt(elem.IndexFiles)) ? 0 : parseInt(elem.IndexFiles)), 0).toLocaleString()}</td>
                                                        <td>{yesterdayReport.reduce((acc, elem) => acc + (isNaN(parseInt(elem.IndexImages)) ? 0 : parseInt(elem.IndexImages)), 0).toLocaleString()}</td>
                                                        <td>{yesterdayReport.reduce((acc, elem) => acc + (isNaN(parseInt(elem.CBSLQAFiles)) ? 0 : parseInt(elem.CBSLQAFiles)), 0).toLocaleString()}</td>
                                                        <td>{yesterdayReport.reduce((acc, elem) => acc + (isNaN(parseInt(elem.CBSLQAImages)) ? 0 : parseInt(elem.CBSLQAImages)), 0).toLocaleString()}</td>
                                                        <td>{yesterdayReport.reduce((acc, elem) => acc + (isNaN(parseInt(elem.ApprovedFiles)) ? 0 : parseInt(elem.ApprovedFiles)), 0).toLocaleString()}</td>
                                                        <td>{yesterdayReport.reduce((acc, elem) => acc + (isNaN(parseInt(elem.ApprovedImages)) ? 0 : parseInt(elem.ApprovedImages)), 0).toLocaleString()}</td>
                                                        {/* <td>{yesterdayReport.reduce((acc, elem) => acc + (isNaN(parseInt(elem.RectifiedFiles)) ? 0 : parseInt(elem.RectifiedFiles)), 0).toLocaleString()}</td>
                                                <td>{yesterdayReport.reduce((acc, elem) => acc + (isNaN(parseInt(elem.RectifiedImages)) ? 0 : parseInt(elem.RectifiedImages)), 0).toLocaleString()}</td> */}
                                                        {/* <td>{yesterdayReport.reduce((acc, elem) => acc + (isNaN(parseInt(elem.Export_PdfFiles)) ? 0 : parseInt(elem.Export_PdfFiles)), 0).toLocaleString()}</td>
                                                <td>{yesterdayReport.reduce((acc, elem) => acc + (isNaN(parseInt(elem.Export_PdfImages)) ? 0 : parseInt(elem.Export_PdfImages)), 0).toLocaleString()}</td> */}
                                                        <td></td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div>
                                <div className="table-card" style={{ marginBottom: '25px' }}>
                                    <div
                                        className="d-flex justify-content-between align-items-center"
                                        style={{
                                            padding: "10px 10px 0px",
                                            backgroundColor: "#4BC0C0",
                                            // paddingTop: "15px",
                                        }}
                                    >

                                        <h6 className="text-center" style={{ color: "white" }}>
                                            PROJECT UPDATE CUMULATIVE REPORT FOR SCANNING AND DIGITIZATION OF CASE
                                            RECORDS FOR DISTRICT COURT OF TELANGANA
                                        </h6>


                                        <h6 style={{ color: "white", cursor: "pointer" }} onClick={exportToCSV}>
                                            {" "}
                                            <MdFileDownload style={{ fontSize: "20px" }} />
                                            Export CSV
                                        </h6>


                                    </div>
                                    <div
                                        className="row mt-2 ms-2 me-2"
                                        style={{ overflowX: "auto", overflowY: 'auto' }}
                                    >
                                        <table class="table table-hover table-bordered table-responsive data-table">
                                            <thead
                                                style={{ color: "#4bc0c0", fontWeight: '300', textAlign: 'center' }}
                                            >
                                                <tr>
                                                    <th rowspan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle' }}>Location</th>
                                                    {/* <th rowspan="2" style={{ verticalAlign: 'middle' }}>Files Received</th> */}
                                                    <th colspan="2" style={{ verticalAlign: 'middle' }}>Scanned</th>
                                                    <th colspan="2" style={{ verticalAlign: 'middle' }}>QC</th>
                                                    <th colspan="2" style={{ verticalAlign: 'middle' }}>Flagging</th>
                                                    <th colspan="2" style={{ verticalAlign: 'middle' }}>Indexing</th>
                                                    <th colspan="2" style={{ verticalAlign: 'middle' }}>Offered for QA</th>
                                                    <th colspan="2" style={{ verticalAlign: 'middle' }}>Client QA Done</th>
                                                    {/* <th colspan="2" style={{ verticalAlign: 'middle' }}>Rectified by CBSL</th> */}
                                                    {/* <th colspan="2" style={{ verticalAlign: 'middle' }}>Delivered</th> */}
                                                    <th>Remarks</th>
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
                                                    {/* <th>Files</th>
                                            <th>Images</th> */}
                                                    {/* <th>Files</th>
                                            <th>Images</th> */}
                                                </tr>
                                            </thead>
                                            <tbody
                                                style={{ color: "gray" }}
                                            >
                                                {report &&
                                                    report.map((elem, index) => (
                                                        <tr key={index} style={{ backgroundColor: "white" }}>
                                                            <td style={{ whiteSpace: 'nowrap', textAlign: 'left' }}>{elem.LocationName}</td>
                                                            {/* <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.InputFiles)) ? "0" : parseInt(elem.InputFiles).toLocaleString()}</td> */}
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.ScannedFiles)) ? "0" : parseInt(elem.ScannedFiles).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.ScannedImages)) ? "0" : parseInt(elem.ScannedImages).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.QCFiles)) ? "0" : parseInt(elem.QCFiles).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.QCImages)) ? "0" : parseInt(elem.QCImages).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.FlaggingFiles)) ? "0" : parseInt(elem.FlaggingFiles).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.FlaggingImages)) ? "0" : parseInt(elem.FlaggingImages).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.IndexFiles)) ? "0" : parseInt(elem.IndexFiles).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.IndexImages)) ? "0" : parseInt(elem.IndexImages).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.CBSLQAFiles)) ? "0" : parseInt(elem.CBSLQAFiles).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.CBSLQAImages)) ? "0" : parseInt(elem.CBSLQAImages).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.ApprovedFiles)) ? "0" : parseInt(elem.ApprovedFiles).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.ApprovedImages)) ? "0" : parseInt(elem.ApprovedImages).toLocaleString()}</td>
                                                            {/* <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.RectifiedFiles)) ? "0" : parseInt(elem.RectifiedFiles).toLocaleString()}</td>
                                                    <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.RectifiedImages)) ? "0" : parseInt(elem.RectifiedImages).toLocaleString()}</td> */}
                                                            {/* <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.Export_PdfFiles)) ? "0" : parseInt(elem.Export_PdfFiles).toLocaleString()}</td>
                                                    <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.Export_PdfImages)) ? "0" : parseInt(elem.Export_PdfImages).toLocaleString()}</td> */}
                                                            <td className="text-center"><button
                                                                className="btn client-view-btn"
                                                                onClick={() => handleViewCumulativeClick(elem.Remarks, elem.SpecialRequests)}
                                                            >
                                                                View
                                                            </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }

                                                {/* Total Row */}
                                                {report && (
                                                    <tr style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", textAlign: 'end' }}>
                                                        <td>Total: </td>
                                                        {/* <td>{report.reduce((acc, elem) => acc + (isNaN(parseInt(elem.InputFiles)) ? 0 : parseInt(elem.InputFiles)), 0).toLocaleString()}</td> */}
                                                        <td>{report.reduce((acc, elem) => acc + (isNaN(parseInt(elem.ScannedFiles)) ? 0 : parseInt(elem.ScannedFiles)), 0).toLocaleString()}</td>
                                                        <td>{report.reduce((acc, elem) => acc + (isNaN(parseInt(elem.ScannedImages)) ? 0 : parseInt(elem.ScannedImages)), 0).toLocaleString()}</td>
                                                        <td>{report.reduce((acc, elem) => acc + (isNaN(parseInt(elem.QCFiles)) ? 0 : parseInt(elem.QCFiles)), 0).toLocaleString()}</td>
                                                        <td>{report.reduce((acc, elem) => acc + (isNaN(parseInt(elem.QCImages)) ? 0 : parseInt(elem.QCImages)), 0).toLocaleString()}</td>
                                                        <td>{report.reduce((acc, elem) => acc + (isNaN(parseInt(elem.FlaggingFiles)) ? 0 : parseInt(elem.FlaggingFiles)), 0).toLocaleString()}</td>
                                                        <td>{report.reduce((acc, elem) => acc + (isNaN(parseInt(elem.FlaggingImages)) ? 0 : parseInt(elem.FlaggingImages)), 0).toLocaleString()}</td>
                                                        <td>{report.reduce((acc, elem) => acc + (isNaN(parseInt(elem.IndexFiles)) ? 0 : parseInt(elem.IndexFiles)), 0).toLocaleString()}</td>
                                                        <td>{report.reduce((acc, elem) => acc + (isNaN(parseInt(elem.IndexImages)) ? 0 : parseInt(elem.IndexImages)), 0).toLocaleString()}</td>
                                                        <td>{report.reduce((acc, elem) => acc + (isNaN(parseInt(elem.CBSLQAFiles)) ? 0 : parseInt(elem.CBSLQAFiles)), 0).toLocaleString()}</td>
                                                        <td>{report.reduce((acc, elem) => acc + (isNaN(parseInt(elem.CBSLQAImages)) ? 0 : parseInt(elem.CBSLQAImages)), 0).toLocaleString()}</td>
                                                        <td>{report.reduce((acc, elem) => acc + (isNaN(parseInt(elem.ApprovedFiles)) ? 0 : parseInt(elem.ApprovedFiles)), 0).toLocaleString()}</td>
                                                        <td>{report.reduce((acc, elem) => acc + (isNaN(parseInt(elem.ApprovedImages)) ? 0 : parseInt(elem.ApprovedImages)), 0).toLocaleString()}</td>
                                                        {/* <td>{report.reduce((acc, elem) => acc + (isNaN(parseInt(elem.RectifiedFiles)) ? 0 : parseInt(elem.RectifiedFiles)), 0).toLocaleString()}</td>
                                                <td>{report.reduce((acc, elem) => acc + (isNaN(parseInt(elem.RectifiedImages)) ? 0 : parseInt(elem.RectifiedImages)), 0).toLocaleString()}</td> */}
                                                        {/* <td>{report.reduce((acc, elem) => acc + (isNaN(parseInt(elem.Export_PdfFiles)) ? 0 : parseInt(elem.Export_PdfFiles)), 0).toLocaleString()}</td>
                                                <td>{report.reduce((acc, elem) => acc + (isNaN(parseInt(elem.Export_PdfImages)) ? 0 : parseInt(elem.Export_PdfImages)), 0).toLocaleString()}</td> */}
                                                        <td></td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-md-4 col-sm-12">
                                <Card>
                                    <CardBody>
                                        <CardTitle tag="h5" className="d-flex justify-content-between align-items-center">
                                            <span>Cumulative Files</span>
                                            <div className="d-flex justify-content-between align-items-center">
                                                {/* <div className="me-2" onClick={toggleChartFileType} style={{ cursor: "pointer" }}>
                                                {chartFileType === "line" ? <FaChartBar size={20} /> : <FaChartLine size={20} />}
                                            </div> */}
                                                <VscTable size={20} onClick={handleFileTable} style={{ cursor: 'pointer' }} />
                                            </div>
                                        </CardTitle>
                                        <Chart
                                            options={formatChartData(barFile, ["#4BC0C0"]).options}
                                            series={formatChartData(barFile, ["#4BC0C0"]).series}
                                            type={chartFileType}
                                            height="350"
                                        />
                                    </CardBody>
                                </Card>
                            </div>
                            {showFileTable && (
                                <div className="table-popup">
                                    <div className="table-content">
                                        <div className="popup-header d-flex justify-content-between align-items-center">
                                            <h5>Cumulative (Files)</h5>
                                            <button
                                                onClick={closeFileTable}
                                                className="btn"
                                                style={{ backgroundColor: 'gray', color: 'white', padding: '0 5px' }}
                                            >
                                                X
                                            </button>
                                        </div>
                                        <table className="table table-bordered">
                                            <thead style={{ color: '#4BC0C0' }}>
                                                <tr>
                                                    <th></th>
                                                    <th>Scanned</th>
                                                    <th>QC</th>
                                                    <th>Flagging</th>
                                                    <th>Indexing</th>
                                                    <th>Offered for QA</th>
                                                    <th>Client QA Done</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Mapping through barFile datasets to generate rows */}
                                                {barFile.datasets.map((dataset, index) => (
                                                    <tr key={index}>
                                                        <td>{dataset.name}</td>
                                                        {dataset.data.map((value, dataIndex) => (
                                                            <td key={dataIndex} style={{ textAlign: 'end' }}>
                                                                {parseInt(value).toLocaleString()}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}

                                                {/* Calculating and displaying the total row */}
                                                <tr>
                                                    <td style={{ textAlign: 'end' }}><strong>Total: </strong></td>
                                                    {barFile.datasets[0].data.map((_, colIndex) => {
                                                        const total = barFile.datasets.reduce(
                                                            (sum, dataset) => sum + parseInt(dataset.data[colIndex] || 0),
                                                            0
                                                        );
                                                        return (
                                                            <td key={colIndex} style={{ textAlign: 'end' }}>
                                                                <strong>{total.toLocaleString()}</strong>
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                            <div className="col-md-4 col-sm-12">
                                <Card>
                                    <CardBody>
                                        <CardTitle tag="h5" className="d-flex justify-content-between align-items-center">
                                            <span>Cumulative Images</span>
                                            <div className="d-flex justify-content-between align-items-center">
                                                {/* <div className="me-2" onClick={toggleChartImageType} style={{ cursor: "pointer" }}>
                                                {chartImageType === "line" ? <FaChartBar size={20} /> : <FaChartLine size={20} />}
                                            </div> */}
                                                <VscTable size={20} onClick={handleImageTable} style={{ cursor: 'pointer' }} />
                                            </div>
                                        </CardTitle>

                                        <Chart
                                            options={formatChartData(barImage, ["#FF6384"]).options}
                                            series={formatChartData(barImage, ["#FF6384"]).series}
                                            type={chartImageType}
                                            height="350"
                                        />
                                    </CardBody>
                                </Card>
                            </div>
                            {showImageTable && (
                                <div className="table-popup">
                                    <div className="table-content">
                                        <div className="popup-header d-flex justify-content-between align-items-center">
                                            <h5>Cumulative (Images)</h5>
                                            <button
                                                onClick={closeImageTable}
                                                className="btn"
                                                style={{ backgroundColor: 'gray', color: 'white', padding: '0 5px' }}
                                            >
                                                X
                                            </button>
                                        </div>
                                        <table className="table table-bordered">
                                            <thead style={{ color: '#4BC0C0' }}>
                                                <tr>
                                                    <th></th>
                                                    <th>Scanned</th>
                                                    <th>QC</th>
                                                    <th>Flagging</th>
                                                    <th>Indexing</th>
                                                    <th>Offered for QA</th>
                                                    <th>Client QA Done</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Mapping through barFile datasets to generate rows */}
                                                {barImage.datasets.map((dataset, index) => (
                                                    <tr key={index}>
                                                        <td>{dataset.name}</td>
                                                        {dataset.data.map((value, dataIndex) => (
                                                            <td key={dataIndex} style={{ textAlign: 'end' }}>
                                                                {parseInt(value).toLocaleString()}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}

                                                {/* Calculating and displaying the total row */}
                                                <tr>
                                                    <td style={{ textAlign: 'end' }}><strong>Total: </strong></td>
                                                    {barImage.datasets[0].data.map((_, colIndex) => {
                                                        const total = barImage.datasets.reduce(
                                                            (sum, dataset) => sum + parseInt(dataset.data[colIndex] || 0),
                                                            0
                                                        );
                                                        return (
                                                            <td key={colIndex} style={{ textAlign: 'end' }}>
                                                                <strong>{total.toLocaleString()}</strong>
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                            <div className="col-md-4 col-sm-12">
                                <Card>
                                    <CardBody style={{ height: '430px' }}>
                                        <div className="row">
                                            <h5>Remarks:</h5>
                                            <div>
                                                {cardCumulative && cardCumulative.length > 0 ? (
                                                    cardCumulative.map((elem, index) => (
                                                        <p key={index} style={{ marginBottom: "5px" }}>
                                                            {elem.CombinedRemarks}
                                                        </p>
                                                    ))
                                                ) : (
                                                    <p>No remarks available.</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="row" style={{ marginTop: '10px' }}>
                                            <h5>Special Requests:</h5>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-4 col-sm-12">
                                <Card>
                                    <CardBody>
                                        <CardTitle tag="h5" className="d-flex justify-content-between align-items-center">
                                            <span>Process(Files) Dated: {formattedYesterdayDate}</span>
                                            <div className="d-flex justify-content-between align-items-center">
                                                {/* <div className="me-2" onClick={toggleChartTodayFileType} style={{ cursor: "pointer" }}>
                                                {chartTodayFileType === "line" ? <FaChartBar size={20} /> : <FaChartLine size={20} />}
                                            </div> */}
                                                <VscTable size={20} onClick={handleTodayFileTable} style={{ cursor: 'pointer' }} />
                                            </div>
                                        </CardTitle>

                                        <Chart
                                            options={formatChartData(todayFile, ["#4BC0C0"]).options}
                                            series={formatChartData(todayFile, ["#4BC0C0"]).series}
                                            type={chartTodayFileType}
                                            height="350"
                                        />
                                    </CardBody>
                                </Card>
                            </div>
                            {showTodayFileTable && (
                                <div className="table-popup">
                                    <div className="table-content">
                                        <div className="popup-header d-flex justify-content-between align-items-center">
                                            <h5>Process(Files) Dated: {formattedYesterdayDate}</h5>
                                            <button
                                                onClick={closeTodayFileTable}
                                                className="btn"
                                                style={{ backgroundColor: 'gray', color: 'white', padding: '0 5px' }}
                                            >
                                                X
                                            </button>
                                        </div>
                                        <table className="table table-bordered">
                                            <thead style={{ color: '#4BC0C0' }}>
                                                <tr>
                                                    <th></th>
                                                    <th>Scanned</th>
                                                    <th>QC</th>
                                                    <th>Flagging</th>
                                                    <th>Indexing</th>
                                                    <th>Offered for QA</th>
                                                    <th>Client QA Done</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Mapping through barFile datasets to generate rows */}
                                                {todayFile.datasets.map((dataset, index) => (
                                                    <tr key={index}>
                                                        <td>{dataset.name}</td>
                                                        {dataset.data.map((value, dataIndex) => (
                                                            <td key={dataIndex} style={{ textAlign: 'end' }}>
                                                                {parseInt(value).toLocaleString()}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}

                                                {/* Calculating and displaying the total row */}
                                                <tr>
                                                    <td style={{ textAlign: 'end' }}><strong>Total: </strong></td>
                                                    {todayFile.datasets[0].data.map((_, colIndex) => {
                                                        const total = todayFile.datasets.reduce(
                                                            (sum, dataset) => sum + parseInt(dataset.data[colIndex] || 0),
                                                            0
                                                        );
                                                        return (
                                                            <td key={colIndex} style={{ textAlign: 'end' }}>
                                                                <strong>{total.toLocaleString()}</strong>
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                            <div className="col-md-4 col-sm-12">
                                <Card>
                                    <CardBody>
                                        <CardTitle tag="h5" className="d-flex justify-content-between align-items-center">
                                            <span>Process(Images) Dated: {formattedYesterdayDate}</span>
                                            <div className="d-flex justify-content-between align-items-center">
                                                {/* <div className="me-2" onClick={toggleChartTodayImageType} style={{ cursor: "pointer" }}>
                                                {chartTodayImageType === "line" ? <FaChartBar size={20} /> : <FaChartLine size={20} />}
                                            </div> */}
                                                <VscTable size={20} onClick={handleTodayImageTable} style={{ cursor: 'pointer' }} />
                                            </div>
                                        </CardTitle>
                                        <Chart
                                            options={formatChartData(todayImage, ["#FF6384"]).options}
                                            series={formatChartData(todayImage, ["#FF6384"]).series}
                                            type={chartTodayImageType}
                                            height="350"
                                        />
                                    </CardBody>
                                </Card>
                            </div>
                            <div className="col-md-4 col-sm-12">
                                <Card>
                                    <CardBody style={{ height: '430px' }}>
                                        <div className="row">
                                            <h5>Remarks:</h5>
                                            <div>
                                                {cardToday && cardToday.length > 0 ? (
                                                    cardToday.map((elem, index) => (
                                                        <p key={index} style={{ marginBottom: "5px" }}>
                                                            {elem.CombinedTodayRemarks}
                                                        </p>
                                                    ))
                                                ) : (
                                                    <p>No remarks available.</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="row" style={{ marginTop: '10px' }}>
                                            <h5>Special Requests:</h5>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                            {showTodayImageTable && (
                                <div className="table-popup">
                                    <div className="table-content">
                                        <div className="popup-header d-flex justify-content-between align-items-center">
                                            <h5>Process(Images) Dated: {formattedYesterdayDate}</h5>
                                            <button
                                                onClick={closeTodayImageTable}
                                                className="btn"
                                                style={{ backgroundColor: 'gray', color: 'white', padding: '0 5px' }}
                                            >
                                                X
                                            </button>
                                        </div>
                                        <table className="table table-bordered">
                                            <thead style={{ color: '#4BC0C0' }}>
                                                <tr>
                                                    <th></th>
                                                    <th>Scanned</th>
                                                    <th>QC</th>
                                                    <th>Flagging</th>
                                                    <th>Indexing</th>
                                                    <th>Offered for QA</th>
                                                    <th>Client QA Done</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Mapping through barFile datasets to generate rows */}
                                                {todayImage.datasets.map((dataset, index) => (
                                                    <tr key={index}>
                                                        <td>{dataset.name}</td>
                                                        {dataset.data.map((value, dataIndex) => (
                                                            <td key={dataIndex} style={{ textAlign: 'end' }}>
                                                                {parseInt(value).toLocaleString()}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}

                                                {/* Calculating and displaying the total row */}
                                                <tr>
                                                    <td style={{ textAlign: 'end' }}><strong>Total: </strong></td>
                                                    {todayImage.datasets[0].data.map((_, colIndex) => {
                                                        const total = todayImage.datasets.reduce(
                                                            (sum, dataset) => sum + parseInt(dataset.data[colIndex] || 0),
                                                            0
                                                        );
                                                        return (
                                                            <td key={colIndex} style={{ textAlign: 'end' }}>
                                                                <strong>{total.toLocaleString()}</strong>
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                        </div>

                    </div>
                    <div className='d-none d-xl-block d-sm-none'>
                        <div className='container footer'>
                            <div className='row'>
                                <div className='col-12 text-center'>
                                    <p>© 2024 CBSLGROUP All rights reserved</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='d-block d-xl-none d-sm-block'>
                        <div className='container '>
                            <div className='row'>
                                <div className='col-12 text-center'>
                                    <p>© 2024 CBSLGROUP All rights reserved</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {isViewDailyModalOpen && (
                        <ViewDailyRemarksModal
                            remarks={dailyRemarks}
                            special_requests={dailySpecialRequests}
                            onClose={() => setIsViewDailyModalOpen(false)}
                        />
                    )}
                    {isViewCumulativeModalOpen && (
                        <ViewCumulativeRemarksModal
                            remarks={cumulativeRemarks}
                            special_requests={cumulativeSpecialRequests}
                            onClose={() => setIsViewCumulativeModalOpen(false)}
                        />
                    )}
                </>
            ) : (
                <>
                    <Locationwiseclientreport location={userLog.locations} />
                </>
            )}

        </>
    )
}

const ViewDailyRemarksModal = ({ remarks, onClose, special_requests }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>View Remarks</h2>
                <p><b>Remarks:</b> {remarks}</p>
                <p><b>Special Requests:</b> {special_requests}</p>
                <button className='btn add-btn ms-0' style={{ backgroundColor: 'red' }} onClick={onClose}>Close</button>
            </div>
        </div>
    );
};
const ViewCumulativeRemarksModal = ({ remarks, onClose, special_requests }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>View Remarks</h2>
                <p>Remarks: {remarks}</p>
                <p>Special Requests: {special_requests}</p>
                <button className='btn add-btn ms-0' style={{ backgroundColor: 'red' }} onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Locationwisereport