import React, { useEffect, useState, useRef } from "react";
import Chart from 'react-apexcharts';
import DatePicker from "react-datepicker";
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import Header from "./Components/Header";
import axios, { all } from "axios";
import "./App.css";
import { format, sub } from "date-fns";
import { MdFileDownload } from "react-icons/md";
import { API_URL } from "./Api";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';
import SearchBar from "./Components/SearchBar";
import SearchButton from "./Components/Button";
import BarGraph from "./Components/BarGraph";
import DonutGraph from "./Components/DonutGraph";
import ProjectStatusTable from "./Components/ProjectStatusTable";

const Dashboard = ({ showSideBar }) => {
  const currentDate = new Date();
  const yesterdayDate = sub(currentDate, { days: 1 });
  const previousDate = sub(currentDate, { days: 2 });
  const formattedCurrentDate = format(currentDate, "dd-MM-yyyy");
  const formattedYesterdayDate = format(yesterdayDate, "dd-MM-yyyy");
  const formattedPreviousDate = format(previousDate, "dd-MM-yyyy");
  const [tableData, setTableData] = useState([]);
  const [csv, setCsv] = useState(null);
  const dropdownRef = useRef(null);
  const vendorDropdownRef = useRef(null);
  const [showLocation, setShowLocation] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [showVendor, setShowVendor] = useState(false);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [locations, setLocations] = useState();
  //const [filteredLocations, setFilteredLocations] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  const [exportTableFormat, setExportTableFormat] = useState('csv');
  const [chartData, setChartData] = useState(null);
  const [cumulative, setCumulative] = useState();
  const [target, setTarget] = useState();
  const [selectedDate, setSelectedDate] = useState(null);
  const [yesterdayReport, setYesterdayReport] = useState([]);
  const [vendorName, setVendorName] = useState([]);
  const [locationSearchInput, setLocationSearchInput] = useState("");



  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const dropdownMenuRef = useRef(null); // Add this ref for the dropdown menu

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
      const locationNames = response.data.map((item) => item.LocationName);
      setLocations(locationNames);
      //setFilteredLocations(response.data);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };
  const locationName = selectedLocations;

  const fetchGraphFileData = async (queryParams) => {
    try {
      let apiUrl = `${API_URL}/graph1LocationWise`;

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

      const labels = Object.keys(apiData[0]).filter(
        label => label !== "locationid" && label !== "LocationName"
      );

      const datasets = apiData.map(locationData => ({
        label: locationData.LocationName || "Files",
        data: labels.map(label => locationData[label]),
        backgroundColor: "#ad33ff",
      }));

      setBarFile({
        labels: labels,
        datasets: datasets,
      });

    } catch (error) {
      console.error("Error in fetchGraphFileData:", {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
    }
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




  const fetchGraphImageData = async (queryParams) => {
    try {
      let apiUrl = `${API_URL}/graph2`;

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
        console.error("No image data received from the API");
        return;
      }

      const labels = Object.keys(apiData[0]).filter(
        label => label !== "locationid" && label !== "LocationName"
      );

      const datasets = apiData.map(locationData => ({
        label: locationData.LocationName || "Images",
        data: labels.map(label => locationData[label]),
        backgroundColor: "#ad33ff",
      }));

      setBarImage({
        labels: labels,
        datasets: datasets,
      });

    } catch (error) {
      console.error("Error in fetchGraphImageData:", {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
    }
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

        if (!apiData || apiData.length === 0) {
          console.error("No data received from the API");
          return;
        }

        const labels = Object.keys(apiData[0]);
        const data = Object.values(apiData[0]);

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

        if (!apiData || apiData.length === 0) {
          console.error("No data received from the API");
          return;
        }

        const labels = Object.keys(apiData[0]);
        const data = Object.values(apiData[0]);

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

  const fetchAllYesGraphImageData = async (queryParams) => {
    try {
      let apiUrl = `${API_URL}/graph9`;

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


      setAllLocationYesImage({
        labels: labels,
        datasets: [{
          label: "Images",
          data: data,
          backgroundColor: "#02B2AF",
        }],
      });

    } catch (error) {
      console.error("Error in fetchAllYesGraphImageData:", {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
    }
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


  const fetchTableData = () => {
    axios
      .get(`${API_URL}/tabularData`)
      .then((response) => {
        // console.log(response.data);
        let data = response.data;
        if (selectedLocations.length > 0) {

          data = data.filter(item =>
            selectedLocations.includes(item.LocationName)
          );
          // console.log(data);
          setTableData(data);
        } else {
          setTableData(response.data);
        }

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
            width: [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2], // Line series has width 2, bars have 0
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
            enabledOnSeries: [0, 1, 2, 3, 4, 5, 6, 7], // Only for bar series
            formatter: (val) => val,
            offsetY: -10,
            style: { fontSize: "12px", colors: ["#304758"] },
          },
          tooltip: {
            shared: true,
            sharedOnSeries: [8, 9, 10, 11, 12, 13, 14, 15],
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
  useEffect(() => {

    fetchYesterdayData();
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
    fetchAllWeekImageData(locationName);
    fetchCumulative(locationName);
    fetchLocationData();
  }, []);
  const fetchYesterdayData = async () => {
    try {
      const params = {};

      if (selectedDate) {
        params.date = selectedDate;
      }

      if (selectedVendors) {  // Ensure vendor is included if selected
        params.vendor = selectedVendors;
      }

      if (selectedLocations && selectedLocations.length > 0) {
        params.locationName = selectedLocations; // Pass locations if selected
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
      console.error("Error fetching cumulative data");
    }
  };
  useEffect(() => {
    const fetchTarget = async () => {
      try {
        const response = await axios.get(`${API_URL}/mptarget`);
        setTarget(response.data);
      } catch {
        console.error("Error fetching target data");
      }
    };
    const fetchVendor = async () => {
      try {
        const response = await axios.get(`${API_URL}/vendorName`);
        setVendorName(response.data);
      } catch {
        console.error("Error fetching target data");
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

  const formatDonutData = (data) => {
    const labels = data.map(item => item.scandate);
    const series = data.map(item => parseInt(item.scannedfiles || item.scannedimages, 10));



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
    const table = document.querySelector(".data-table"); // Select the table by className
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
  const processNames = [
    "Collection", "Barcoding", "Page Numbering", "Preparation", "Scanning",
    "ReScanning", "QC", "Flagging", "Indexing", "CBSL QA", "Refilling", "InvOut"
  ];
  // Extract data for graph
  const targetValues = processNames.map(process => {
    return target?.find(item => item.process_name === process)?.target || 0;
  });
  const achievedValues = processNames.map(process => {
    const processData = [
      { key: "Collection", manpower: "CollectionMP", files: "total_inventoryfiles" },
      { key: "Barcoding", manpower: "BarcodingMP", files: "total_barcodingfiles" },
      { key: "Page Numbering", manpower: "NumberingPreparationMP", files: "-" },
      { key: "Preparation", manpower: "NumberingPreparationMP", files: "preparefiles" },
      { key: "Scanning", manpower: "ScanningMP", files: "total_scanfiles" },
      { key: "ReScanning", manpower: "-", files: "-" },
      { key: "QC", manpower: "QCMP", files: "total_qcfiles" },
      { key: "Flagging", manpower: "FlaggingMP", files: "total_flaggingfiles" },
      { key: "Indexing", manpower: "IndexingMP", files: "total_indexfiles" },
      { key: "CBSL QA", manpower: "CBSLQAMP", files: "total_cbslqafiles" },
      { key: "Refilling", manpower: "BindingMP", files: "refillingfiles" },
      { key: "InvOut", manpower: "-", files: "invoutfiles" }
    ].find(item => item.key === process);

    if (!processData || processData.manpower === "-" || processData.files === "-") {
      return 0;
    }

    const manpower = cumulative?.manpowerData?.[processData.manpower] || 0;
    const files = cumulative?.scannedData?.[processData.files] || cumulative?.barcodingData?.[processData.files] || 0;

    return manpower && files ? (files / manpower).toFixed(2) : 0;
  });
  const differenceValues = achievedValues.map((achieved, index) => {
    const target = targetValues[index];
    return target > 0 ? ((achieved / target) * 100).toFixed(2) : 0;
  });
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

        fetchYesterdayData(),
        fetchData(),
        fetchData(),
        fetchGraphFileData(queryParams),
        fetchGraphImageData(queryParams),
        fetchWeekFileGraphData(queryParams),
        fetchWeekImageGraphData(queryParams),
        fetchMonthImageGraphData(queryParams),
        fetchTodayGraphFileData(queryParams),
        fetchTodayGraphImageData(queryParams),
        fetchCivilCaseGraphData(queryParams),
        fetchCriminalCaseGraphData(queryParams),
        fetchAllYesGraphImageData(queryParams),
        fetchAllGraphImageData(queryParams),
        fetchTableData(),
        fetchAllWeekImageData(queryParams),
        fetchCumulative(queryParams),
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

  const vendorOptions = vendorName.map(item => item.Vendor);


  return (
    <>
      <div className="main-fluid p-3 m-2">
        <div className="row">
          <div className={`${showSideBar ? 'col-lg-1 col-md-0' : 'col-lg-2 col-md-0'} d-none d-lg-block`}></div>
          <div className={`${showSideBar ? 'col-lg-11 col-md-12' : 'col-lg-10 col-md-12 '} col-sm-12`}>
            <div className="row mt-2">
              <div
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <h4> Telangana Dashboard</h4>
                <p
                  style={{
                    fontSize: "12px",
                    color: 'maroon',
                    textAlign: "right",
                  }}
                >
                  Last Active Login:{" "}
                  {/* {userLog ? userLog.last_active_login : "Guest"} */}
                </p>
              </div>
            </div>
            <div
              className="row mt-2 search-report-card d-flex gap-4 flex-wrap align-items-center"
              style={{ gap: '24px' }}
            >
              <div className="col-lg-4 col-md-2 col-sm-12 mt-1" style={{ position: "relative" }}>
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

            <div className="row mt-2 ">
              <div className="col-md-6 col-sm-12">
                <BarGraph
                  Heading="Cumulative Files"
                  barFile={barFile}
                  color={["#508C9B"]}
                  bar="bar"
                  height={350}
                ></BarGraph>

              </div>
              <div className="col-md-6 col-sm-12">
                <BarGraph
                  Heading="Cumulative Images"
                  barFile={barImage}
                  color={["#508C9B"]}
                  bar="bar"
                  height={350}
                ></BarGraph>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-6 col-sm-12">
                <BarGraph
                  Heading="Civil Cases (Files & Images)"
                  barFile={civilCase}
                  color={["#50B498"]}
                  bar="bar"
                  height={350}
                />

              </div>
              <div className="col-md-6 col-sm-12">
                <BarGraph
                  Heading="Criminal Cases (Files & Images)"
                  barFile={criminalCase}
                  color={["#50B498"]}
                  bar="bar"
                  height={350}
                />

              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-6 col-sm-12">
                <BarGraph
                  Heading={`PRODUCTION REPORT FOR (${formattedYesterdayDate})`}
                  subTitle="All Location: Images" // add subtitle support if needed
                  barFile={todayFile}
                  color={["#36C2CE"]}
                  bar="bar"
                  height={350}
                />

              </div>
              <div className="col-md-6 col-sm-12">
                <BarGraph
                  Heading={`PRODUCTION REPORT FOR (${formattedYesterdayDate})`}
                  subTitle="All Location: Images"
                  barFile={todayImage}
                  color={["#36C2CE"]}
                  bar="bar"
                  height={350}
                />

              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-6 col-sm-12">
                <DonutGraph
                  heading="Weekly Report"
                  subTitle="All Location: Files"
                  rawData={weekFile}
                  height={350}
                />
              </div>
              <div className="col-md-6 col-sm-12">
                <DonutGraph
                  heading="Weekly Report (Scanned)"
                  subTitle="All Location: Images"
                  rawData={weekImage}
                  height={350}
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-6 col-sm-12">
                <BarGraph
                  Heading={`SCANNED REPORT FOR (${formattedYesterdayDate})`}
                  subTitle="All Location: Images"
                  barFile={allLocationYesImage}
                  color={["#088395"]}
                  bar="bar"
                  height={350}
                />
              </div>
              <div className="col-md-6 col-sm-12">
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

            <div className="row mt-2">
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
            <div className="row search-report-card mt-2">
              <div className="col-2">
                <DatePicker
                  className="date-field"
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Select Date"
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
              <div className="col-md-4 col-sm-12">
                <SearchBar
                  items={vendorOptions} // all available 
                  // locations

                  selectedItems={selectedVendors} // current selections
                  onChange={(newSelected) =>
                    setSelectedVendors(newSelected)
                  } // update handler
                  placeholder="Search Vendors..."
                  showSelectAll={true}
                  Name="Vendors"
                />
              </div>
              <div className="col-3">
                <button className="btn add-btn" onClick={handleDateFilter}>Submit</button>
              </div>
            </div>
            <div className="row mt-2">
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
                  <table className="table table-hover table-bordered table-responsive date-table" style={{ zIndex: '0' }}>
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
                    <h6 className="" style={{ color: "white" }}>Production Report ({!selectedDate ? formattedYesterdayDate : selectedDate})</h6>
                  </div>
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
                            <td>
                              {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.ScannerAvailability) || 0), 0).toLocaleString()}
                            </td>
                            <td>
                              {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.SystemAvailability) || 0), 0).toLocaleString()}
                            </td>
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
                        <td></td>
                        <td></td>
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

export default Dashboard;
