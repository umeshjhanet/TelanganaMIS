import React, { useEffect, useState, useRef } from "react";
import Chart from 'react-apexcharts';
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import Header from "./Components/Header";
import axios, { all } from "axios";
import "./App.css";
import { format, sub } from "date-fns";
import { MdFileDownload } from "react-icons/md";
import DistrictHeadDashboard from "./DistrictHeadDashboard";
import { API_URL } from "./Api";
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

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
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  const [exportTableFormat, setExportTableFormat] = useState('csv');
  const [chartData, setChartData] = useState(null);
  const navigate = useNavigate();

  const userLog = JSON.parse(localStorage.getItem("user"));
  console.log("User's Info", userLog);

  const [barFile, setBarFile] = useState({
    labels: [],
    datasets: [
      {
        label: "Files",
        backgroundColor: " #ad33ff",
        data: [],
      },
    ],
  });
  const [barImage, setBarImage] = useState({
    labels: [],
    datasets: [
      {
        label: "Images",
        backgroundColor: "#ad33ff",
        data: [],
      },
    ],
  });
  const [todayFile, setTodayFile] = useState({
    labels: [],
    datasets: [
      {
        label: "Files",
        backgroundColor: "#ff4dff",
        data: [],
      },
    ],
  });
  const [todayImage, setTodayImage] = useState({
    labels: [],
    datasets: [
      {
        label: "Images",
        backgroundColor: "#ff4dff",
        data: [],
      },
    ],
  });
  const [allWeekImage, setAllWeekImage] = useState({ labels: [], datasets: [] });
  const [weekImage, setWeekImage] = useState([]);
  const [weekFile, setWeekFile] = useState([]);
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
  const [civilCase, setCivilCase] = useState({
    labels: [],
    datasets: [
      {
        label: "Civil cases",
        backgroundColor: "#f87979",
        data: [],
      },
    ],
  });
  const [criminalCase, setCriminalCase] = useState({
    labels: [],
    datasets: [
      {
        label: "Criminal cases",
        backgroundColor: "#f87979",
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
              label: "Files", // Use location name as label for each dataset
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
              label: "Images",
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
              label: "Files",
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
              label: "Images",
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

    const fetchWeekImageGraphData = async () => {
      try {
        const params = {
          params: {
            locationNames: selectedLocations,
          },
        };
        const response = await axios.get(`${API_URL}/graph6`, params);
        const apiData = response.data;

        if (Array.isArray(apiData)) {
          setWeekImage(apiData);
        } else {
          console.error("Unexpected data format for weekImage:", apiData);
        }
      } catch (error) {
        console.error("Error fetching weekImage data:", error);
      }
    };

    const fetchWeekFileGraphData = async () => {
      try {
        const params = { params: { locationNames: selectedLocations } };
        const response = await axios.get(`${API_URL}/graph5`, params);
        const apiData = response.data;
        if (Array.isArray(apiData)) {
          setWeekFile(apiData);
        } else {
          console.error("Unexpected data format for weekFile:", apiData);
        }
      } catch (error) {
        console.error("Error fetching weekFile data:", error);
      }
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
                label: "Images",
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
                label: "Images",
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
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/7daysimages`, {
          params: { locationName },
        });

        const data = response.data;

        // Process data for the chart
        const dates = data.map((item) => item.date);
        const scannedImages = data.map((item) => parseInt(item.ScannedImages, 10));
        const qcImages = data.map((item) => parseInt(item.QCImages, 10));
        const cbslQaImages = data.map((item) => parseInt(item.CBSL_QAImages, 10));

        setChartData({
          series: [
            { name: "Scanned Images", type: "bar", data: scannedImages, color: "#1E90FF" },
            { name: "QC Images", type: "bar", data: qcImages, color: "#32CD32" },
            { name: "CBSL QA Images", type: "bar", data: cbslQaImages, color: "#FF4500" },
            { name: "Scanned Images (Line)", type: "line", data: scannedImages, color: "#1E90FF" },
            { name: "QC Images (Line)", type: "line", data: qcImages, color: "#32CD32" },
            { name: "CBSL QA Images (Line)", type: "line", data: cbslQaImages, color: "#FF4500" },
          ],
          options: {
            chart: {
              type: "line",
              toolbar: { show: true },
            },
            stroke: {
              width: [0, 0, 0, 2, 2, 2], // Line series has width 2, bars have 0
              curve: "smooth",
            },
            xaxis: {
              categories: dates,
              title: { text: "Date" },
            },
            yaxis: {
              title: { text: "Images Count" },
            },
            plotOptions: {
              bar: {
                columnWidth: "50%",
                dataLabels: { position: "top" },
              },
            },
            dataLabels: {
              enabled: true,
              enabledOnSeries: [0, 1, 2], // Only for bar series
              formatter: (val) => val,
              offsetY: -10,
              style: { fontSize: "12px", colors: ["#304758"] },
            },
            tooltip: {
              shared: true,
              sharedOnSeries: [3,4,5],
              intersect: false,
            },
            legend: {
              position: "top",
            },
          },
        });
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    fetchData();
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
    fetchAllWeekImageData(locationName);

  }, [selectedLocations]);

  const columnSums = calculateColumnSum();
  console.log("WEEK", weekFile);
  if (!userLog) {
    navigate('/');
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
  const formatWeekChartData = (data, colors) => ({
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
        width: -1,
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
    series: data.datasets.map((dataset, index) => ({
      name: dataset.label,
      data: dataset.data,
      color: colors[index]
    }))
  });


  const formatDonutData = (data) => {
    const labels = data.map(item => item.scandate);
    const series = data.map(item => parseInt(item.scannedfiles || item.scannedimages, 10));

    console.log('Labels:', labels);
    console.log('Series:', series);

    return {
      options: {
        chart: {
          type: 'donut',
          toolbar: {
            show: false,
          },
        },
        labels: labels,
        responsive: [
          {
            breakpoint: 1024,
            options: {
              chart: {
                width: '100%',
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      },
      series: series,
    };
  };

  const donutImageData = formatDonutData(weekImage);
  const donutFileData = formatDonutData(weekFile);

  function downloadCSVFromTable() {
    const table = document.querySelector(".data-table"); // Select the table by class
    let csvContent = "";

    // Define the full header row
    const headerRow1 = [
      "Sr. No.",
      "Location",
      `Scanned (${formattedPreviousDate})`, "",
      `Scanned (${formattedYesterdayDate})`, "",
      `Scanned (${formattedCurrentDate})`, "",
      "Cumulative till date", ""
    ];

    // Define the second row of headers
    const headerRow2 = [
      "", "",
      "Files", "Images",
      "Files", "Images",
      "Files", "Images",
      "Files", "Images",
      ""
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
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4',
      });

      // Add heading
      pdf.setFontSize(18);
      pdf.setTextColor(0, 0, 0); // Set text color to black
      pdf.text("PROJECT UPDATE OF SCANNING FOR DISTRICT COURT OF TELANGANA", 40, 30); // Add heading at position (40, 30)

      // Adjusting image width and height to fit in the PDF
      const imgWidth = 825; // Fit landscape A4 width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add the table image below the heading
      pdf.addImage(imgData, 'PNG', 20, 50, imgWidth, imgHeight); // Adjust y-coordinate to fit below heading

      pdf.save("Scannedreport.pdf");
    });
  }
  function exportTableToExcelTable() {
    const table = document.querySelector(".data-table");
    const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
    XLSX.writeFile(wb, "Scannedreport.xlsx");
  }
  function downloadAllFormatsSummary() {
    if (exportTableFormat === 'csv') {
      downloadCSVFromTable();
      setShowConfirmation(false);
    }
    else if (exportTableFormat === 'excel') {
      exportTableToExcelTable()
      setShowConfirmation(false);
    }
    else if (exportTableFormat === 'pdf') {
      exportTableToPDFTable();
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
                    <h6 style={{ color: "white", cursor: "pointer" }} onClick={handleExport}>
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
                        <button className="btn btn-success mt-3 ms-5" onClick={downloadAllFormatsSummary}>Yes</button>
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
                        <th rowspan="2" style={{ verticalAlign: 'middle' }}>Sr. No.</th>
                        <th rowspan="2" style={{ verticalAlign: 'middle' }}>Location</th>
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
                                <td style={{ textAlign: 'left' }}>{elem.LocationName}</td>
                                <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.Prev_Files)) ? 0 : parseInt(elem.Prev_Files).toLocaleString()}</td>
                                <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.Prev_Images)) ? 0 : parseInt(elem.Prev_Images).toLocaleString()}</td>
                                <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.Yes_Files)) ? 0 : parseInt(elem.Yes_Files).toLocaleString()}</td>
                                <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.Yes_Images)) ? 0 : parseInt(elem.Yes_Images).toLocaleString()}</td>
                                <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.Today_Files)) ? 0 : parseInt(elem.Today_Files).toLocaleString()}</td>
                                <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.Today_Images)) ? 0 : parseInt(elem.Today_Images).toLocaleString()}</td>
                                <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.Total_Files)) ? 0 : parseInt(elem.Total_Files).toLocaleString()}</td>
                                <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.Total_Images)) ? 0 : parseInt(elem.Total_Images).toLocaleString()}</td>

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
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <Card>
                  <CardBody>
                    <CardTitle tag="h5">Cumulative Files </CardTitle>
                    <Chart
                      options={formatChartData(barFile, ["#508C9B"]).options}
                      series={formatChartData(barFile, ["#508C9B"]).series}
                      type="bar"
                      height='350'
                    />
                  </CardBody>
                </Card>

              </div>
              <div className="col-md-6 col-sm-12">
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
            </div>
            <div className="row mt-4">
              <div className="col-md-6 col-sm-12">
                <Card>
                  <CardBody>
                    <CardTitle tag="h5">Civil Cases (Files & Images) </CardTitle>
                    <Chart
                      options={formatChartData(civilCase, ['#50B498']).options}
                      series={formatChartData(civilCase, ['#50B498']).series}
                      type="bar"
                      height="350"
                    />
                  </CardBody>
                </Card>

              </div>
              <div className="col-md-6 col-sm-12">
                <Card>
                  <CardBody>
                    <CardTitle tag="h5">Criminal Cases (Files & Images) </CardTitle>
                    <Chart
                      options={formatChartData(criminalCase, ['#50B498']).options}
                      series={formatChartData(criminalCase, ['#50B498']).series}
                      type="bar"
                      height="350"
                    />
                  </CardBody>
                </Card>

              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-6 col-sm-12">
                <Card>
                  <CardBody>
                    <CardTitle tag="h5">PRODUCTION REPORT FOR ({formattedYesterdayDate})</CardTitle>
                    <CardSubtitle className="text-muted" tag="h6">All Location: Files</CardSubtitle>
                    <Chart
                      options={formatChartData(todayFile, ["#36C2CE"]).options}
                      series={formatChartData(todayFile, ["#36C2CE"]).series}
                      type="bar"
                      height="350"
                    />
                  </CardBody>
                </Card>

              </div>
              <div className="col-md-6 col-sm-12">
                <Card>
                  <CardBody>
                    <CardTitle tag="h5">PRODUCTION REPORT FOR ({formattedYesterdayDate})</CardTitle>
                    <CardSubtitle className="text-muted" tag="h6">All Location: Images</CardSubtitle>
                    <Chart
                      options={formatChartData(todayImage, ["#36C2CE"]).options}
                      series={formatChartData(todayImage, ["#36C2CE"]).series}
                      type="bar"
                      height="350"
                    />
                  </CardBody>
                </Card>

              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-6 col-sm-12">
                <Card>
                  <CardBody>
                    <CardTitle tag="h5">Weekly Report (Scanned)</CardTitle>
                    <CardSubtitle className="text-muted" tag="h6">All Location: Files</CardSubtitle>
                    <Chart
                      options={donutFileData.options}
                      series={donutFileData.series}
                      type="donut"
                      height="350"

                    />
                  </CardBody>
                </Card>
              </div>
              <div className="col-md-6 col-sm-12">
                <Card>
                  <CardBody>
                    <CardTitle tag="h5">Weekly Report (Scanned)</CardTitle>
                    <CardSubtitle className="text-muted" tag="h6">All Location: Images</CardSubtitle>
                    <Chart
                      options={donutImageData.options}
                      series={donutImageData.series}
                      type="donut"
                      height="350"
                    />
                  </CardBody>
                </Card>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-6 col-sm-12">
                <Card>
                  <CardBody>
                    <CardTitle tag="h5">SCANNED REPORT FOR ({formattedYesterdayDate})</CardTitle>
                    <CardSubtitle className="text-muted" tag="h6">All Location: Images</CardSubtitle>
                    <Chart
                      options={formatChartData(allLocationYesImage, ["#088395"]).options}
                      series={formatChartData(allLocationYesImage, ["#088395"]).series}
                      type="bar"
                      height="350"
                    />
                  </CardBody>
                </Card>
              </div>
              <div className="col-md-6 col-sm-12">
                <Card>
                  <CardBody>
                    <CardTitle tag="h5">Cumulative Scanned Till Date</CardTitle>
                    <CardSubtitle className="text-muted" tag="h6">All Location: Images</CardSubtitle>
                    <Chart
                      options={formatChartData(allLocationImage, ["#088395"]).options}
                      series={formatChartData(allLocationImage, ["#088395"]).series}
                      type="bar"
                      height="350"
                    />
                  </CardBody>
                </Card>
              </div>
            </div>

            <div className="row mt-4">
              <Card>
                <CardBody>
                  <CardTitle tag="h5">Images Processing Chart</CardTitle>
                  {chartData && (
                    <Chart
                      options={chartData.options}
                      series={chartData.series}
                      type="line" // Line type for mixed chart
                      height={400}
                    />
                  )}
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};





export default Dashboard;
