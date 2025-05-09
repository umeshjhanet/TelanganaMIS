import React, { useEffect, useState, useRef } from "react";
import Chart from 'react-apexcharts';
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import axios, { all } from "axios";
import DatePicker from "react-datepicker";
import "./App.css";
import Footer from "./Components/Footer";
// import { BarChart } from "@mui/x-charts/BarChart";
import { format, sub } from "date-fns";
import { MdFileDownload } from "react-icons/md";
import DistrictHeadDashboard from "./DistrictHeadDashboard";
import { API_URL } from "./Api";
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { BsAlignTop } from "react-icons/bs";
import moment from "moment";

const ExclusiveDashboard = () => {
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
  const vendorDropdownRef = useRef(null);
  const [showLocation, setShowLocation] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [showVendor, setShowVendor] = useState(false);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [locations, setLocations] = useState();
  const [filteredLocations, setFilteredLocations] = useState([]);
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
  const [showYesterday, setShowYesterday] = useState(false);
  const [showCumulative, setShowCumulative] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [highVolumeData, setHighVolumeData] = useState(null);
  const [billingChartData, setBillingChartData] = useState(null);
  const [billingTotalData, setBillingTotalData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [yesterdayReport, setYesterdayReport] = useState([]);
  const [vendorName, setVendorName] = useState();
  const [cumulative, setCumulative] = useState();
  const [target, setTarget] = useState();
  const navigate = useNavigate();

  const getStyle = (property) => {
    return getComputedStyle(document.documentElement).getPropertyValue(property);
  };
  const userLog = JSON.parse(localStorage.getItem("user"));
  console.log("User's Info", userLog);

  const [barFile, setBarFile] = useState({
    labels: [],
    datasets: [
      {
        label: "No. of Files",
        backgroundColor: " #8DECB4",
        data: [],
      },
    ],
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  });
  const [barImage, setBarImage] = useState({
    labels: [],
    datasets: [
      {
        label: "No. of Images",
        backgroundColor: "#3674B5",
        data: [],
      },
    ],
  });
  const [todayFile, setTodayFile] = useState({
    labels: [],
    datasets: [
      {
        label: "No. of Files",
        backgroundColor: "#1679AB",
        data: [],
      },
    ],
  });
  const [todayImage, setTodayImage] = useState({
    labels: [],
    datasets: [
      {
        label: "No. of Images",
        backgroundColor: "#1679AB",
        data: [],
      },
    ],
  });
  const [weekFile, setWeekFile] = useState([]);
  const [weekImage, setWeekImage] = useState([]);

  const [monthImage, setMonthImage] = useState({
    labels: [],
    datasets: [
      {
        label: "No. of Images",
        backgroundColor: "#AF8260",
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
        backgroundColor: "#AF8260",
        data: [],
      },
    ],
  });
  const [allLocationImage, setAllLocationImage] = useState({
    labels: [],
    datasets: [
      {
        label: "No. of Images",
        backgroundColor: "#AF8260",
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
      if (vendorDropdownRef.current && !vendorDropdownRef.current.contains(event.target)) {
        setShowVendor(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleLocation = (location) => {
    if (!selectedLocations.includes(location)) {
      setSelectedLocations([...selectedLocations, location]);
    }
    setSearchInput('');
    setFilteredLocations(locations);
    setShowLocation(false);
  };

  const removeLocation = (location) => {
    setSelectedLocations(selectedLocations.filter((loc) => loc !== location));
  };
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value === '') {
      setFilteredLocations(locations);
    } else {
      setFilteredLocations(
        locations.filter((loc) =>
          loc.LocationName.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
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
  const handleVendor = (vendorName) => {
    if (!selectedVendors.includes(vendorName)) {
      setSelectedVendors([...selectedVendors, vendorName]);

      setSearchInput("");
    }
    // setShowVendor(false); // Close the dropdown when a Vendor is selected
  };
  const removeVendor = (vendorName) => {
    setSelectedVendors(
      selectedVendors.filter((loc) => loc !== vendorName)
    );
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
  const fetchYesterdayData = async () => {
    try {
      const params = {};
  
      if (selectedDate) {
        params.date = selectedDate;
      }
  
      if (selectedVendors && selectedVendors.length > 0) {  
        params.vendor = selectedVendors.join(","); // Convert array to comma-separated string
      }
  
      if (selectedLocations && selectedLocations.length > 0) {
        params.locationName = selectedLocations;
      }
  
      const response = await axios.get(`${API_URL}/vendorReport`, { params });
      setYesterdayReport(response.data);
    } catch (error) {
      console.error("Error fetching report data:", error);
      setError("Error fetching report data. Please try again.");
    }
  };
  
  const fetchCumulative = async () => {
    try {
      const params = {};
  
      if (selectedDate) {
        params.date = selectedDate;
      }
  
      if (selectedVendors && selectedVendors.length > 0) {  
        params.vendor = selectedVendors.join(","); // Convert array to comma-separated string
      }
  
      if (selectedLocations && selectedLocations.length > 0) {
        params.locationName = selectedLocations;
      }
  
      const response = await axios.get(`${API_URL}/fetch-data-sequential`, { params });
      setCumulative(response.data);
    } catch {
      console.log("Error fetching cumulative data");
    }
  };

  useEffect(() => {
    const fetchLocationData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/locations`);
        setLocations(response.data);
        setFilteredLocations(response.data);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };
    const locationName = selectedLocations;
    const vendor = selectedVendors;
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
              backgroundColor: "#8DECB4", // Change the background color here
            };
          });
          setBarFile({
            labels: labels,
            datasets: datasets,
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            },
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

          console.log("API Data:", apiData);

          const labels = Object.keys(apiData[0]).filter(
            (label) => label !== "locationid" && label !== "LocationName"
          );

          // Extracting bar chart values
          const barData = labels.map((label) =>
            apiData.reduce((sum, locationData) => sum + (parseFloat(locationData[label]) || 0), 0)
          );

          // Calculate moving average for trend line
          const lineData = barData.map((val, index, arr) => {
            if (index === 0) return val;
            return parseFloat(((arr[index - 1] + val) / 2).toFixed(2)); // Ensure proper formatting
          });

          setBarImage({
            labels,
            datasets: [
              {
                name: "No. of Images",
                type: "bar",
                data: barData.map((val) => parseFloat(val.toFixed(2))), // Ensure clean values
              },
              {
                name: "Trend",
                type: "line",
                data: lineData.map((val) => parseFloat(val.toFixed(2))), // Format large numbers
              },
            ],
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
              backgroundColor: "#B04759", // Change the background color here
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
              backgroundColor: "#B04759", // Change the background color here
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

          // Calculate the maximum value of the data
          const maxValue = Math.max(...data);

          // Determine the minimum value for the y-axis
          const minY = Math.floor(maxValue / 50000) * 50000;

          // Update civilCase state with data and options
          setCivilCase({
            labels: labels.filter((label) => label !== "id"),
            datasets: [
              {
                ...civilCase.datasets[0],
                data: data,
              },
            ],
            options: {
              scales: {
                y: {
                  ticks: {
                    min: 0, // set a minimum value
                    stepSize: 50000,
                    suggestedMin: minY, // ensure visibility of smaller values
                  },
                },
              },
            },
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
                backgroundColor: "#AF8260", // Set the background color
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
          // Extract labels and data from the API response
          const labels = apiData.map((item) => item["Location Name"]);
          const data = apiData.map((item) => parseInt(item["Images"], 10)); // Parse string to integer

          // Update state with the new data format
          setAllLocationImage({
            labels: labels,
            datasets: [
              {
                label: "No. of Images",
                backgroundColor: "#AF8260",
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
        .get(`${API_URL}/tabularData`)
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
        const flaggingImages = data.map((item) => parseInt(item.FlaggingImages, 10));
        const indexImages = data.map((item) => parseInt(item.IndexImages, 10));
        const cbslQaImages = data.map((item) => parseInt(item.CBSL_QAImages, 10));
        const clientQaImages = data.map((item) => parseInt(item.Client_QAImages, 10));
        const digiSignImages = data.map((item) => parseInt(item.DigiSignImages, 10));
        // const dmsUploadImages = data.map((item) => parseInt(item.DMSUploadImages, 10));

        setChartData({
          series: [
            { name: "Scanned Images", type: "bar", data: scannedImages, color: "#1E90FF" },
            { name: "QC Images", type: "bar", data: qcImages, color: "#32CD32" },
            { name: "Flagging Images", type: "bar", data: flaggingImages, color: "#AC1754" },
            { name: "Indexing Images", type: "bar", data: indexImages, color: "#4DA1A9" },
            { name: "CBSL QA Images", type: "bar", data: cbslQaImages, color: "#FF4500" },
            { name: "Client QA Images", type: "bar", data: clientQaImages, color: "#735557" },
            { name: "Digi Sign Images", type: "bar", data: digiSignImages, color: "#006A71" },
            // { name: "DMS Upload Images", type: "bar", data: dmsUploadImages, color: "#E69DB8" },
            { name: "Scanned Images (Line)", type: "line", data: scannedImages, color: "#1E90FF" },
            { name: "QC Images (Line)", type: "line", data: qcImages, color: "#32CD32" },
            { name: "Flagging Images (Line)", type: "line", data: flaggingImages, color: "#AC1754" },
            { name: "Indexing Images (Line)", type: "line", data: indexImages, color: "#4DA1A9" },
            { name: "CBSL QA Images (Line)", type: "line", data: cbslQaImages, color: "#FF4500" },
            { name: "Client QA Images (Line)", type: "line", data: clientQaImages, color: "#735557" },
            { name: "Digi Sign Images (Line)", type: "line", data: digiSignImages, color: "#006A71" },
            // { name: "DMS Upload Images (Line)", type: "line", data: dmsUploadImages, color: "#E69DB8" },
          ],
          options: {
            chart: {
              type: "line",
              toolbar: { show: true },
            },
            stroke: {
              width: [0, 0, 0, 0, 0,0,0,0, 2, 2, 2, 2, 2,2,2,2], // Line series has width 2, bars have 0
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
              enabledOnSeries: [0, 1, 2, 3, 4,5,6,7], // Only for bar series
              formatter: (val) => val,
              offsetY: -10,
              style: { fontSize: "12px", colors: ["#304758"] },
            },
            tooltip: {
              shared: true,
              sharedOnSeries: [ 8, 9,10,11,12,13,14,15],
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
    const fetch15LocationsData = async () => {
      try {
        const response = await axios.get(`${API_URL}/15locations`, {
          params: { locationName },
        });

        const data = response.data;

        // Process data for the chart
        const dates = data.map((item) => item.date);
        const scannedImages = data.map((item) => parseInt(item.ScannedImages, 10));
        const qcImages = data.map((item) => parseInt(item.QCImages, 10));
        const cbslQaImages = data.map((item) => parseInt(item.CBSL_QAImages, 10));

        setHighVolumeData({
          series: [
            { name: "Scanned Images", type: "bar", data: scannedImages, color: "#6A1E55" },
            { name: "QC Images", type: "bar", data: qcImages, color: "#000B58" },
            { name: "CBSL QA Images", type: "bar", data: cbslQaImages, color: "#F95454" },
            { name: "Scanned Images (Line)", type: "line", data: scannedImages, color: "#6A1E55" },
            { name: "QC Images (Line)", type: "line", data: qcImages, color: "#000B58" },
            { name: "CBSL QA Images (Line)", type: "line", data: cbslQaImages, color: "#F95454" },
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
              sharedOnSeries: [3, 4, 5],
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
    const fetchBillingData = async () => {
      try {
        const response = await axios.get(`${API_URL}/billingData`); // API endpoint
        const data = response.data;

        // Transform data for the chart
        const categories = data.map((item) => moment(item["Billing Date"]).format("YYYY-MM-DD"));
        const qcImages = data.map((item) => parseFloat(item["Image-QC"]));
        const cbslQaImages = data.map((item) => parseFloat(item["CBSL-QA"]));

        setBillingChartData({
          options: {
            chart: { type: "bar", toolbar: { show: false } },
            xaxis: { categories, title: { text: "Billing Date" } },
            yaxis: { title: { text: "Image Count (in Lakhs)" } },
            stroke: { width: 3, curve: "smooth" },
            markers: { size: 5 },
            colors: ["#15B392", "#FCCD2A"],
            legend: { position: "top" }
          },
          series: [
            { name: "Image-QC", data: qcImages },
            { name: "CBSL-QA", data: cbslQaImages }
          ]
        });

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };
    const fetchCumulativeData = async () => {
      try {
        const response = await axios.get(`${API_URL}/cumulativeTotals`);
        const data = response.data;

        if (!data || Object.keys(data).length === 0) {
          throw new Error("No data available");
        }

        setBillingTotalData({
          options: {
            chart: { type: "bar", toolbar: { show: false } },
            xaxis: { categories: ["Billed QC", "CBSL QA Done"], title: { text: "Processes" } },
            yaxis: { title: { text: "Total Images (in Lakhs)" } },
            plotOptions: { bar: { horizontal: false, columnWidth: "45%" } },
            colors: ["#FF7F3E", "#FF7F3E"]
          },
          series: [
            { name: "Images Processed", data: [data["Billed QC"], data["CBSL QA Done"]] }
          ]
        });

        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
        setLoading(false);
      }
    };
    fetchLocationData();
    fetchYesterdayData();
    fetchCumulativeData();
    fetchBillingData();
    fetch15LocationsData();
    fetchData(locationName,vendor);
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
    fetchCumulative(locationName);

  }, [selectedLocations,selectedVendors]);

  useEffect(() => {
    const fetchTarget = async () => {
      try {
        const response = await axios.get(`${API_URL}/mptarget`);
        setTarget(response.data);
      } catch {
        console.log("Error fetching target data");
      }
    };
    const fetchVendor = async () => {
      try {
        const response = await axios.get(`${API_URL}/vendorName`);
        setVendorName(response.data);
      } catch {
        console.log("Error fetching target data");
      }
    };

    const fetchData = async () => {
      setIsLoading(true);  // ✅ Set loading before fetching
      await Promise.all([fetchCumulative(), fetchTarget()]); // ✅ Wait for both requests
      setIsLoading(false); // ✅ Only set false after both complete
    };

    fetchData();
    fetchVendor();
  }, []);

  const columnSums = calculateColumnSum();

  // if (!userLog) {
  //   navigate('/');
  // }
  // Log the content of allLocationImage before passing it to the BarChart component
  console.log("allLocationImage content:", allLocationImage);
  const formatChartData = (data, colors) => ({
    options: {
      chart: {
        toolbar: { show: false },
        stacked: false,
      },
      dataLabels: {
        enabled: true,
        formatter: (val, { seriesIndex }) => {
          return seriesIndex === 0 ? val.toLocaleString() : ""; // Show only for bars
        },
        offsetY: -20,
        style: { fontSize: "12px", colors: ["#3674B5"] },
      },
      stroke: {
        show: true,
        width: [2, 3], // Bar has width 2, Line has width 3
        colors: ["#3674B5", "#FF8383"], // Bar (green) and line (red)
      },
      legend: { show: true },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "40%", // Adjust width for better visibility
          borderRadius: 2,
          dataLabels: { position: "top" },
        },
      },
      tooltip: {
        enabled: true,
        shared: false,
        custom: function ({ seriesIndex, dataPointIndex, w }) {
          if (seriesIndex === 0) {
            return `<div class="tooltip-box">
                      <strong>${w.globals.seriesNames[seriesIndex]}:</strong> 
                      ${w.globals.series[seriesIndex][dataPointIndex].toLocaleString()}
                    </div>`;
          }
          return ""; // Hide tooltip for line
        },
      },
      colors: ["#3674B5", "#FF8383"], // Bar (green) and line (red)
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
    series: data.datasets.map((dataset) => ({
      name: dataset.name,
      type: dataset.type,
      data: dataset.data,
    })),
  });
  const formatLongData = (data, colors) => ({
    options: {
      chart: {
        toolbar: {
          show: false,
        },
        stacked: false,
      },
      dataLabels: {
        enabled: false,
        formatter: (val) => val,
        offsetY: -10,
        style: { fontSize: "12px", colors: ["#304758"] },
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
          dataLabels: { position: "top" },
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

  const hideCumulative = () => {
    setShowCumulative(!showCumulative);
  }
  const hideYesterday = () => {
    setShowYesterday(!showYesterday);
  }
  const donutImageData = formatDonutData(weekImage);
  const donutFileData = formatDonutData(weekFile);

  const handleDateChange = (date) => {
      if (date) {
          // Format to YYYY-MM-DD (removing time)
          const formattedDate = format(date, "yyyy-MM-dd");
          setSelectedDate(formattedDate); // Store as a string to avoid timezone issues
      }
  };
  const handleDateFilter = () => {
    if (!selectedVendors && !selectedDate) {
      alert("Please select at least a vendor or a date");
      return;
    }
  
    if (selectedVendors && !selectedDate) {
      // Only vendor is selected, call fetchYesterdayData
      fetchYesterdayData();
      fetchCumulative(selectedVendors);
    } else if (selectedVendors && selectedDate) {
      // Both vendor and date are selected, call both functions
      fetchCumulative(selectedLocations);
      fetchYesterdayData();
    } else if (!selectedVendors && selectedDate) {
      // Only date is selected, call fetchCumulative
      fetchCumulative(selectedLocations);
    }
  };
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
                <h4>Telangana Dashboard</h4>
                <p
                  style={{
                    fontSize: "12px",
                    color: '#4bc0c0',
                    textAlign: "right",
                  }}
                >
                  Last Active Login:{" "}
                  {userLog ? userLog.last_active_login : "Guest"}
                </p>
              </div>
            </div>
            <div className="row  mt-2  search-report-card">
              <div className='col-md-6 col-sm-12'>
                <div className="search-container" ref={dropdownRef} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <input
                      type="text"
                      className="search-bar mt-1"
                      style={{ border: '1px solid #000', padding: '5px', borderRadius: '5px', minHeight: '30px', width: '100%' }}
                      value={searchInput}
                      onChange={handleSearchChange}
                      onClick={() => setShowLocation((prev) => !prev)} // Toggle dropdown on click
                      placeholder="Search or select a location"
                    />
                    {showLocation && (
                      <div className="location-card" style={{ position: 'absolute', top: '40px', background: '#fff', border: '1px solid #ccc', zIndex: 10, width: '100%' }}>
                        {filteredLocations.length > 0 ? (
                          filteredLocations.map((item, index) => (
                            <p key={index} onClick={() => handleLocation(item.LocationName)} style={{ cursor: 'pointer', padding: '5px' }}>
                              {item.LocationName}
                            </p>
                          ))
                        ) : (
                          <p style={{ padding: '5px' }}>No locations found</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Selected Locations on the Right */}
                  <div className="selected-locations" style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {selectedLocations.map((location, index) => (
                      <span key={index} className="selected-location" style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {location}
                        <button onClick={() => removeLocation(location)} style={{ backgroundColor: 'black', color: 'white', border: 'none', cursor: 'pointer' }}>x</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-md-6"></div>
            </div>
            <div className="row mt-2">
              <div className="card">
                <Card>
                  <CardBody>
                    <CardTitle tag="h5">SCANNED REPORT OF LAST 30 DAYS </CardTitle>
                    <Chart
                      options={formatLongData(monthImage, ["#4bc0c0"]).options}
                      series={formatLongData(monthImage, ["#4bc0c0"]).series}
                      type="bar"
                      height="379"
                    />
                  </CardBody>
                </Card>
              </div>
            </div>
            <div className="row mt-2">
              <Card>
                <CardBody>
                  <CardTitle tag="h5">Cumulative Images </CardTitle>
                  <Chart
                    options={formatChartData(barImage, ["#8DECB4"]).options}
                    series={formatChartData(barImage, ["#8DECB4"]).series}
                    type="bar"
                    height="350"
                  />
                </CardBody>
              </Card>
            </div>
            <div className="row search-report-card mt-2">
              <div className="col-2">
              <DatePicker
                  className="date-field"
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Select Date"
                />
              </div>
               <div className="col-md-4 col-sm-12">
                            <div
                              ref={vendorDropdownRef}
                              className="search-bar"
                              style={{
                                border: "1px solid #000",
                                padding: "5px",
                                borderRadius: "5px",
                                minHeight: "30px",
                                width:'250px'
                              }}
            
                              contentEditable={true}
                              onClick={() => setShowVendor(!showVendor)}
                            >
                              {selectedVendors.length === 0 && !showVendor && (
                                <span className="placeholder-text">Search Vendors...</span>
                              )}
                              {selectedVendors.map((vendor, index) => (
                                <span key={index} className="selected-location">
                                  {vendor}
                                  <button
                                    onClick={() => removeVendor(vendor)}
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
                            {showVendor && (
                              <>
                                <div className="location-card">
                                  {vendorName &&
                                    vendorName.map((item, index) => (
                                      <div key={index}>
                                        <p
                                          onClick={() => handleVendor(item.Vendor)}
                                        >
                                          {item.Vendor}
                                        </p>
                                      </div>
                                    ))}
                                </div>
                              </>
                            )}
                          </div> 
              <div className="col-3">
                <button className="btn add-btn" onClick={handleDateFilter}>Submit</button>
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
            {/* <div className="row mt-4">
              <Card>
                <CardBody>
                  <CardTitle tag="h5">15 High Volume Locations</CardTitle>
                  {highVolumeData && (
                    <Chart
                      options={highVolumeData.options}
                      series={highVolumeData.series}
                      type="line" // Line type for mixed chart
                      height={400}
                    />
                  )}
                </CardBody>
              </Card>
            </div> */}
            {/* <div className="row mt-4">
              <div className="col-6">
                <Card>
                  <CardBody>
                    <CardTitle tag="h5">Billed QC vs CBSL QA Done Graph</CardTitle>
                    {loading && <p>Loading...</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {billingTotalData && (
                      <Chart
                        options={billingTotalData.options}
                        series={billingTotalData.series}
                        type="bar"
                        height={400}
                      />
                    )}
                  </CardBody>
                </Card>
              </div>
              <div className="col-6">
                <Card>
                  <CardBody>
                    <CardTitle tag="h5">Quarterly Billing Graph</CardTitle>
                    {billingChartData && (
                      <Chart
                        options={billingChartData.options}
                        series={billingChartData.series}
                        type="bar"
                        height={400}
                      />
                    )}
                  </CardBody>
                </Card>
              </div>
            </div> */}
            <div className="row mt-4">
              <Card>
                <CardBody>
                  <CardTitle tag="h5">SCANNED REPORT FOR ({formattedYesterdayDate})
                    <button className="btn add-btn" onClick={hideYesterday}>{showYesterday ? "Hide" : "Show"}</button></CardTitle>
                  <CardSubtitle className="text-muted" tag="h6">All Location: Images</CardSubtitle>
                  {showYesterday && (
                    <Chart
                      options={formatLongData(allLocationYesImage, ["#AF8260"]).options}
                      series={formatLongData(allLocationYesImage, ["#AF8260"]).series}
                      type="bar"
                      height="350"
                    />
                  )}
                </CardBody>
              </Card>
            </div>
            <div className="row mt-4">
              <Card>
                <CardBody>
                  <CardTitle tag="h5">Cumulative Scanned Till Date
                    <button className="btn add-btn" onClick={hideCumulative}>{showCumulative ? "Hide" : "Show"}</button>
                  </CardTitle>
                  <CardSubtitle className="text-muted" tag="h6">All Location: Images</CardSubtitle>
                  {showCumulative && (
                    <Chart
                      options={formatLongData(allLocationImage, ["#AF8260"]).options}
                      series={formatLongData(allLocationImage, ["#AF8260"]).series}
                      type="bar"
                      height="350"
                    />
                  )}
                </CardBody>
              </Card>
            </div>
            
           
            <div className="row mt-3 me-1">
              <div className="table-card">
                <div
                  className="row"
                  style={{
                    padding: "5px",
                    backgroundColor: "#4bc0c0",
                    paddingTop: "15px",
                  }}
                >
                  <div className="col-10">
                    <h6 className="" style={{ color: "white" }}>
                      MANPOWER ANALYZE REPORT
                    </h6>
                  </div>
                </div>
                <div
                  className="row mt-3 ms-2 me-2"
                  style={{ overflowX: "auto", maxHeight: '500px' }}
                >
                  <table class="table table-hover table-bordered table-responsive date-table" style={{ zIndex: '0' }}>
                    <thead>
                      <tr>
                        <th>Process Steps</th>
                        <th>MP</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>Manpower Target</th>
                        <th>Average</th>
                        <th>Differences B/W Target & Achieved</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "Received/ Collection of records", manpower: cumulative?.manpowerData?.CollectionMP, files: cumulative?.scannedData?.total_inventoryfiles, images: "-", processKey: "Collection" },
                        { name: "Scanning (ADF)", manpower: cumulative?.manpowerData?.ScanningMP, files: cumulative?.scannedData?.total_scanfiles, images: cumulative?.scannedData?.total_scanimages, processKey: "Scanning" },
                        { name: "Image QC", manpower: cumulative?.manpowerData?.QCMP, files: cumulative?.scannedData?.total_qcfiles, images: cumulative?.scannedData?.total_qcimages, processKey: "QC" },
                        { name: "Document Classification (Flagging)", manpower: cumulative?.manpowerData?.FlaggingMP, files: cumulative?.scannedData?.total_flaggingfiles, images: cumulative?.scannedData?.total_flaggingimages, processKey: "Flagging" },
                        { name: "Indexing (Data Entry)", manpower: cumulative?.manpowerData?.IndexingMP, files: cumulative?.scannedData?.total_indexfiles, images: cumulative?.scannedData?.total_indeximages, processKey: "Indexing" },
                        { name: "CBSL QA", manpower: cumulative?.manpowerData?.CBSLQAMP, files: cumulative?.scannedData?.total_cbslqafiles, images: cumulative?.scannedData?.total_cbslqaimages, processKey: "CBSL QA" },
                        { name: "Client QC", manpower: cumulative?.manpowerData?.ClientQAMP, files: cumulative?.scannedData?.total_clientqaacceptfiles, images: cumulative?.scannedData?.total_clientqaacceptimages, processKey: "Client QC" },
                        { name: "DMS Upload", manpower: cumulative?.manpowerData?.DMSUploadMP, files: "-", images: "-", processKey: "DMS Upload" },
                        { name: "Inventory In & Out", manpower: cumulative?.manpowerData?.InventoryMP, files: cumulative?.barcodingData?.invoutfiles, images: "-", processKey: "InvOut" }
                      ].map((row, index) => {
                        const targetValue = target?.find(targetItem => targetItem.process_name === row.processKey)?.target || "-";

                        // ✅ Calculate Average (Files / Manpower)
                        const average = row.manpower && row.images && row.manpower !== "-" && row.images !== "-"
                          ? (parseInt(row.images) / parseInt(row.manpower)).toFixed(2)
                          : "-";

                        // ✅ Calculate Difference (Average / Target * 100)
                        const difference = targetValue !== "-" && average !== "-"
                          ? ((parseFloat(average) / parseFloat(targetValue) * 100)).toFixed(2)
                          : "-";

                        // ✅ Determine Cell Color for Difference Column
                        let differenceStyle = {};
                        if (difference === "-") {
                          differenceStyle = { backgroundColor: "#fff" }; // Orange for empty
                        } else if (parseFloat(difference) < 90) {
                          differenceStyle = { backgroundColor: "red" }; // Red for below 90%
                        } else {
                          differenceStyle = { backgroundColor: "green" }; // Green for 90% and above
                        }

                        return (
                          <tr key={index}>
                            <td style={{ textAlign: 'left' }}>{row.name}</td>
                            <td>{row.manpower}</td>
                            <td>{row.files}</td>
                            <td>{row.images}</td>
                            <td>{targetValue}</td>
                            <td>{average}</td>
                            <td style={differenceStyle}>{difference !== "-" ? `${difference}%` : "-"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="row mt-2 me-1">
              <div className="table-card" style={{ marginBottom: "0px" }}>
                <div className="row" style={{ padding: "5px", backgroundColor: "#4BC0C0", paddingTop: "15px" }}>
                  <div className="col-10">
                    <h6 className="" style={{ color: "white" }}>Production Report ({formattedYesterdayDate})</h6>
                  </div>
                  {/* <div className="col-2 text-end">
                                <button onClick={handleExportYesterdayCSV} className="btn btn-light" style={{ marginTop: '-10px' }}>
                                  Export to CSV
                                </button>
                              </div> */}
                </div>
                <div className="row mt-3 ms-2 me-2" style={{ overflowX: "auto" }}>
                  <table className="table table-hover table-bordered table-responsive data-table">
                    <thead style={{ color: "#4bc0c0", fontWeight: '300', textAlign: 'center' }}>
                      <tr>
                        <th rowSpan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle', width: '150px' }}>
                          Location
                        </th>
                        <th rowSpan="2" style={{ verticalAlign: 'middle' }}>
                          Vendor Deployment
                        </th>
                        <th rowSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Scanner Deployment
                        </th>
                        <th rowSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          System Deployment
                        </th>
                        <th rowSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Target
                        </th>
                        <th rowSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Present ManPower
                        </th>
                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Collection Files
                        </th>
                        <th colSpan="3" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Scanning
                        </th>
                        <th colSpan="3" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Image QC
                        </th>
                        <th colSpan="3" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Flagging
                        </th>
                        <th colSpan="3" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Indexing
                        </th>
                        <th colSpan="3" style={{ verticalAlign: 'middle', width: '150px' }}>
                          CBSL QA
                        </th>
                        <th colSpan="3" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Customer QA
                        </th>
                        <th colSpan="3" style={{ verticalAlign: 'middle', width: '150px' }}>
                          DMS Uploaded
                        </th>
                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Inventory Out
                        </th>
                      </tr>
                      <tr style={{ color: "black", fontWeight: '300' }}>
                        <th>MP</th>
                        <th>Files</th>
                        <th>MP</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>MP</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>MP</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>MP</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>MP</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>MP</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>MP</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>MP</th>
                        <th>Files</th>
                      </tr>
                    </thead>
                    <tbody className="scrollable" style={{ color: "#4bc0c0", height: "80px" }}>
                      {yesterdayReport && yesterdayReport.map((elem, index) => {
                        // Calculate total manpower for each row
                        const totalManpower = [
                          parseInt(elem.Scan_MP) || 0,
                          parseInt(elem.Image_QC_MP) || 0,
                          parseInt(elem.Flagging_MP) || 0,
                          parseInt(elem.Index_MP) || 0,
                          parseInt(elem.CBSL_QA_MP) || 0,
                          parseInt(elem.Ready_Cust_QA_MP) || 0,
                          parseInt(elem.Cust_QA_Done_MP) || 0,
                          parseInt(elem.DMS_Upload_MP) || 0,
                          parseInt(elem.Refilling_MP) || 0,
                          parseInt(elem.Inventory_MP) || 0,
                        ].reduce((sum, manpower) => sum + manpower, 0);

                        return (
                          <tr key={index} style={{ backgroundColor: "white" }}>
                            <td style={{ whiteSpace: 'nowrap', textAlign: 'left' }}>{elem.locationname}</td>
                            <td style={{ whiteSpace: 'nowrap', textAlign: 'left' }}>{elem.Vendor}</td>
                            <td>{elem.ScannerAvailability}</td>
                            <td>{elem.SystemAvailability}</td>
                            <td>{elem.ScanningTarget}</td>
                            <td>{totalManpower.toString()}</td>
                            <td>{isNaN(parseInt(elem.Coll_Index_MP)) ? "0" : parseInt(elem.Coll_Index_MP).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.ReceivedFiles)) ? "0" : parseInt(elem.ReceivedFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Scan_MP)) ? "0" : parseInt(elem.Scan_MP).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.ScannedFiles)) ? "0" : parseInt(elem.ScannedFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.ScannedImages)) ? "0" : parseInt(elem.ScannedImages).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Image_QC_MP)) ? "0" : parseInt(elem.Image_QC_MP).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.QCFiles)) ? "0" : parseInt(elem.QCFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.QCImages)) ? "0" : parseInt(elem.QCImages).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Flagging_MP)) ? "0" : parseInt(elem.Flagging_MP).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.FlaggingFiles)) ? "0" : parseInt(elem.FlaggingFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.FlaggingImages)) ? "0" : parseInt(elem.FlaggingImages).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Index_MP)) ? "0" : parseInt(elem.Index_MP).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.IndexingFiles)) ? "0" : parseInt(elem.IndexingFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.IndexingImages)) ? "0" : parseInt(elem.IndexingImages).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.CBSL_QA_MP)) ? "0" : parseInt(elem.CBSL_QA_MP).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.CBSL_QAFiles)) ? "0" : parseInt(elem.CBSL_QAFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.CBSL_QAImages)) ? "0" : parseInt(elem.CBSL_QAImages).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Cust_QA_Done_MP)) ? "0" : parseInt(elem.Cust_QA_Done_MP).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Client_QA_AcceptedFiles)) ? "0" : parseInt(elem.Client_QA_AcceptedFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Client_QA_AcceptedImages)) ? "0" : parseInt(elem.Client_QA_AcceptedImages).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.DMS_Upload_MP)) ? "0" : parseInt(elem.DMS_Upload_MP).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.DMS_UploadFiles)) ? "0" : parseInt(elem.DMS_UploadFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.DMS_UploadImages)) ? "0" : parseInt(elem.DMS_UploadImages).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Inventory_MP)) ? "0" : parseInt(elem.Inventory_MP).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Inv_Out_Files)) ? "0" : parseInt(elem.Inv_Out_Files).toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ color: "#4BC0C0", fontWeight: "bold", textAlign: 'right' }}>
                        <td style={{ textAlign: 'left' }}>Total</td>
                        <td></td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.ScannerAvailability) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.SystemAvailability) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.ScanningTarget) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((total, elem) => {
                            const manpower = [
                              parseInt(elem.Scan_MP) || 0,
                              parseInt(elem.Image_QC_MP) || 0,
                              parseInt(elem.Flagging_MP) || 0,
                              parseInt(elem.Index_MP) || 0,
                              parseInt(elem.CBSL_QA_MP) || 0,
                              parseInt(elem.Ready_Cust_QA_MP) || 0,
                              parseInt(elem.Cust_QA_Done_MP) || 0,
                              parseInt(elem.DMS_Upload_MP) || 0,
                              parseInt(elem.Refilling_MP) || 0,
                              parseInt(elem.Inventory_MP) || 0,
                            ].reduce((sum, manpower) => sum + manpower, 0);
                            return total + manpower;
                          }, 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.Coll_Index_MP) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.ReceivedFiles) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.Scan_MP) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.ScannedFiles) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.ScannedImages) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.Image_QC_MP) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.QCFiles) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.QCImages) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.Flagging_MP) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.FlaggingFiles) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.FlaggingImages) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.Index_MP) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.IndexingFiles) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.IndexingImages) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.CBSL_QA_MP) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.CBSL_QAFiles) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.CBSL_QAImages) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.Cust_QA_Done_MP) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.Client_QA_AcceptedFiles) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.Client_QA_AcceptedImages) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.DMS_Upload_MP) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.DMS_UploadFiles) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.DMS_UploadImages) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.Inventory_MP) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.Inv_Out_Files) || 0), 0).toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExclusiveDashboard;
